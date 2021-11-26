import React, { Component } from 'react';
import {
    StyleSheet, View, Text, Modal, Dimensions
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Spinner } from 'native-base';
import { connect } from '../../../lib/connect';
import * as actions from '../../../actions/customer';
import * as customerAction from '../../../actions/customer';
import CustomerCreateBox from './customerPartBoxCreate';
import CustomerDetailsBox from './customerPartBoxDetail';
import CustomerEditBox from './customerPartBoxEdit';
import Toolbar from '../../controls/toolbars';

class CustomerBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            changed: false,
            box: this.props.box
        }
        this.data = null;
    }

    // componentDidMount() {
    //     if (this.loading) {
    //         this.props.actions.getlist({ pagesize: 1000 });
    //     }
    // }

    UNSAFE_componentWillReceiveProps(props) {
        if (!this.state.changed) {
            this.setState({ box: props.box });
        }
    }

    onRequestClose = () => {
        this.props.onRequestClose()
    }

    showEdit = () => {
        this.props.showEdit()
    }

    getEntry = (id) => {
        this.props.actions.getDetails(id).then((data) => {
            if (data) {
                this.data = data;
            }
        }).catch((e) => {
            // console.log(e);
        })
    }

    render() {
        var { show, entry, entityId } = this.props;
        // // console.log('jfjfjfjfksnlfjdhos', entry);
        if (!show) return null;
        if (!entry && entityId > 0) {
            // entry = this.props.customer.items.find(item => item.id == entityId);
            this.getEntry(entityId);
            if (!entry && !this.loading) {
                this.loading = true;
                this.props.actions.getlist({ id: entityId });
            }
        }
        if (!entry && this.data) {
            entry = this.data;
        }

        if (!entry && !this.data) {
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
                                <Spinner color='green' />
                            </View>
                        </View>
                    </View>
                </Modal>
            );
        }

        // if (!entry) {
        //     return (
        //         <Modal onRequestClose={this.onRequestClose}>
        //             <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}><Spinner style={styles.viewSpinner} color='white' /></View>
        //         </Modal>
        //     );
        // }

        this.loading = false;

        if (this.state.box == 'create') {
            return <CustomerCreateBox
                entry={entry}
                onRequestClose={this.onRequestClose}
                applyFor={this.props.applyFor} title={this.props.title} viewId={this.props.viewId}
            />;
        }

        if (this.state.box == 'edit') {
            return <CustomerEditBox
                entry={entry}
                showBox={this.showBox}
                onRequestClose={this.onRequestClose}
                applyFor={this.props.applyFor} title={this.props.title} viewId={this.props.viewId} />;
        }

        if (this.state.box == 'details') {
            return <CustomerDetailsBox
                entry={entry}
                showEdit={this.showEdit}
                onRequestClose={this.onRequestClose}
                applyFor={this.props.applyFor} title={this.props.title} viewId={this.props.viewId}
            />;
        }


        return null;
    }
}

export default connect(CustomerBox, state => ({
    customer: state.customer,
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
        justifyContent: 'center',
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
