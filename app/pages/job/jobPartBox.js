import React, { Component } from 'react';
import {
    View, Text, StyleSheet, Modal, Dimensions
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Spinner } from 'native-base';
import JobDetailsBox from './jobPartBoxDetail';
import JobEditBox from './jobPartBoxEdit';
import JobCreateBox from './jobPartBoxCreate';
import { connect } from '../../lib/connect';
import * as actions from '../../actions/job';
import Toolbar from '../controls/toolbars';

class JobBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            changed: false,
            box: this.props.box
        }
    }

    componentDidMount() {
        // if (this.props.job.items.length <= 0) {
        if (this.loading) {
            this.props.actions.getList().catch((e) => {
                // console.log(e)
            })
        }
    }

    UNSAFE_componentWillReceiveProps(props) {
        if (!this.state.changed) {
            this.setState({ box: props.box });
        }
    }

    showBox = (entry, box) => {
        if (entry != null) {
            this.setState({ box: box, changed: true });
        }
        else {
            this.onRequestClose();
        }
    }

    onRequestClose = () => {
        this.setState({ changed: false });
        this.props.onRequestClose();
    }

    render() {
        var { show, entry, entityId, customerIds, processId, stepId } = this.props;
        var canReport = this.props.canReport || this.context.user.can("Job.Report");

        if (!show) return null;
        if (entry == null && entityId > 0) {

            entry = this.props.job.items.find(item => item.id == entityId);

            if (entry == null && !this.loading) {
                this.loading = true;
                this.props.actions.getList({ id: entityId });
            }
        }

        if (entry == null) {
            return (
                <Modal
                    onRequestClose={this.onRequestClose}
                    transparent={true}
                    animationType='fade'
                >
                    <View style={styles.container}>
                        <View style={styles.actionSheet}>
                            <Toolbar
                                noPadding
                                style={styles.toolbar}
                                icon={<MaterialIcons name='arrow-back' size={22} />}
                                iconColor='#000'
                                onIconPress={this.onRequestClose}
                                titleText={__('Quay lại')}
                                titleColor='#000'
                            ></Toolbar>
                            <View style={styles.item}>
                                <Text>{__('Dữ liệu trống hoặc đã bị xóa')}</Text>
                            </View>
                        </View>
                    </View>
                </Modal>
            );
        }

        this.loading = false;

        if (this.state.box == 'edit') {
            return <JobEditBox entry={entry} onRequestClose={this.onRequestClose} />;
        }

        if (this.state.box == 'details') {
            return <JobDetailsBox entry={entry} showBox={this.showBox} onRequestClose={this.onRequestClose} canReport={canReport} />;
        }

        if (this.state.box == 'create') {
            return <JobCreateBox
                entry={entry}
                customerIds={customerIds}
                processId={processId}
                stepId={stepId}
                onRequestClose={this.onRequestClose}
            />;
        }

        if (this.state.box == 'menucontext') {
            return null;
        }

        return (
            <View>
                <Text style={styles.pending}>{__('Chức năng đang được xây dựng')} {this.state.box}</Text>
            </View>
        );

    }
}

export default connect(JobBox, state => ({
    job: state.job,
    jobStatus: state.jobstatus,
}), { ...actions });


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,.4)',
    },
    actionSheet: {
        width: Dimensions.get('window').width - 20,
        maxWidth: 300,
        borderRadius: 4,
        backgroundColor: '#fff'
    },
    toolbar: {
        backgroundColor: '#fff',
        elevation: 1,
        shadowOpacity: 0,
        shadowRadius: 0,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 60,
        padding: 20
    },
    pending: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 100
    },
    viewSpinner: {
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: '#5db761',
        borderRadius: 10,
    }
});

