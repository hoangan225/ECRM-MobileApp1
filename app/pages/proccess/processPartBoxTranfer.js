import moment from 'moment';
// import Toast from 'react-native-simple-toast';
import React, { Component } from 'react';
import {
    Dimensions, Linking, StyleSheet, View, ScrollView,
    TouchableOpacity, Text, Image, Modal, WebView, TextInput, RefreshControl
} from 'react-native';
import { Icon, Toast } from 'native-base';
import KeyboardSpacer from '../controls/keyboard-space';
import Toolbar from '../controls/toolbars';
import Select from '../controls/select';
import Loading from '../controls/loading';
import * as actions from '../../actions/opportunity';
import { connect } from '../../lib/connect';

class ProcessTransferBox extends Component {
    constructor(props) {
        super(props);

        const step = this.props.steps.find(item => item.id == this.props.entry.stepId);
        this.state = {
            entry: {
                ...this.props.entry,
                id: this.props.entry.id,
                stepId: this.props.entry.stepId,
                revenue: this.props.entry.revenue || 0,
                reason: this.props.entry.reason,
                percent: step.percent
            },
            changed: false,
            selectedOpp: [this.props.entry.id],
        }

    }

    setValue = (data) => {
        this.setState({
            changed: true,
            entry: { ...this.state.entry, ...data }
        })
    }

    setStep = (value, item) => {
        this.setValue({ stepId: value, model: item.model });
    }

    save = () => {
        if (this.state.entry.percent == 0 && !this.state.entry.reason) {
            return alert('Yêu cầu nhập lý do thất bại.');
        }

        this.setState({ loading: true });
        const step = { ...this.state.entry.model };
        if (step) {
            const items = this.props.opportunity.items.filter(item => this.state.selectedOpp.contains(item.id));
            if (step.percent == 100) {
                this.props.actions.patchBulk(this.state.selectedOpp, { revenue: this.state.entry.revenue }).catch(({ error, message }) => {
                    // console.log('e1');
                    this.setState({ loading: false });
                })
            }

            if (step.percent == 0) {
                this.props.actions.patchBulk(this.state.selectedOpp, { reason: this.state.entry.reason }).catch(({ error, message }) => {
                    // console.log('e2');
                    this.setState({ loading: false });
                })
            }
            this.props.actions.updateStepBulk(items, step).then(data => {
                this.setState({ loading: false });
                this.props.onRequestClose();

                Toast.show({
                    text: 'Cập nhật thành công',
                    duration: 2500,
                    position: 'bottom',
                    textStyle: { textAlign: 'center' },

                });
            }).catch(({ error, message }) => {
                // console.log('e3');
                this.setState({ loading: false });
            })
        }
    }


    render() {
        const entry = this.state.entry;
        // // console.log('this.props.steps', this.props.steps);
        if (!entry) return null;

        return (
            <Modal
                supportedOrientations={['portrait', 'landscape']}
                onRequestClose={this.props.onRequestClose}>
                <Toolbar
                    icon={<Icon type='MaterialIcons' style={{ fontSize: 22, color: '#fff' }} name='arrow-back' />}
                    onIconPress={this.props.onRequestClose}
                    actions={[
                        {
                            icon: <Icon name='save' type='MaterialIcons' style={{ fontSize: 22, color: '#fff' }} />,
                            onPress: this.save,
                            disabled: this.state.loading
                        }
                    ]}
                    titleText='Chuyển bước cơ hội'
                    style={styles.toolbar}
                ></Toolbar>
                <View style={styles.process}>
                    <ScrollView>
                        <View style={styles.processInfo}>
                            <View style={styles.processProp}>
                                <Text style={styles.label}>{__('Bước tiếp theo')}</Text>
                                <Select
                                    items={this.props.steps.map(item => ({ ...item, label: item.name, value: item.id, model: { ...item }, }))}
                                    style={styles.select}
                                    onValueChange={(value, item) => this.setStep(value, item)}
                                    selectedValue={entry.stepId}
                                    showSearchBox={false} />
                            </View>

                            {
                                entry.percent == 100 && (
                                    <View style={styles.processProp}>
                                        <Text style={styles.label}>{__('Doanh thu')}</Text>
                                        <TextInput
                                            style={styles.input}
                                            underlineColorAndroid='transparent'
                                            keyboardType='numeric'
                                            value={entry.revenue + ""}
                                            onChangeText={value => this.setValue({ revenue: value })} />
                                    </View>
                                )
                            }

                            {
                                entry.percent == 0 && (
                                    <View style={styles.processProp}>
                                        <Text style={styles.label}>{__('Lý do thất bại')}</Text>
                                        <TextInput
                                            style={[styles.input, { textAlignVertical: 'top' }]}
                                            underlineColorAndroid='transparent'
                                            multiline={true}
                                            numberOfLines={3}
                                            value={entry.reason}
                                            onChangeText={value => this.setValue({ reason: value, revenue: 0 })} />
                                    </View>

                                )
                            }

                            <View style={{ height: 100 }} />
                        </View>

                    </ScrollView>
                </View>
                {
                    this.state.loading &&
                    <Loading />
                }
                <KeyboardSpacer iosOnly={true} />
            </Modal>
        )
    }
}

export default connect(ProcessTransferBox, state => ({
    opportunity: state.opportunity,
    host: state.account.host,
}), actions);

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: '#f2f2f2'
    },
    toolbar: {
        backgroundColor: '#F44336'
    },
    process: {
        backgroundColor: '#f2f2f2',
        flex: 1,
    },
    processInfo: {
        flex: 1,
        padding: 10,
    },
    processTitle: {
        flex: 1,
        color: '#fff',
        fontSize: 20,
        padding: 10,
        fontWeight: 'bold',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1
    },
    label: {
        marginTop: 10,
        marginBottom: 10,
        fontSize: 14,
        color: '#444',
        fontWeight: 'bold'
    },
    value: {
        fontSize: 15,
        color: '#555',
        padding: 10,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#ccc',
        backgroundColor: '#f9f9f9'
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#ccc',
        backgroundColor: '#fff',
        minHeight: 45,
        flex: 1,
        fontSize: 16,
        paddingHorizontal: 4
    },
    datepicker: {
        backgroundColor: '#fff',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#ccc',
        backgroundColor: '#fff',
        minHeight: 45,
        flex: 1,
    },
    select: {
        backgroundColor: '#fff',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#ccc',
        backgroundColor: '#fff',
        minHeight: 45
    },
    editor: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#ccc',
    },
    editorToolbar: {
        position: 'absolute',
        left: 0,
        right: 0
    },
    content: {
        padding: 10,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#ccc',
        backgroundColor: '#f9f9f9'
    },
    processComments: {
        marginTop: 20,
        paddingBottom: 50
    },
    commentTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        padding: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 40,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#ccc'
    },
});