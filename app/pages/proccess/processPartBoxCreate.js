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
import DatePicker from '../controls/datepicker';
import Select from '../controls/select';
import UserSelect from '../user';
import CustomerSelect from '../customer/components/customerSelect';
import Loading from '../controls/loading';

import * as actions from '../../actions/opportunity';
import { connect } from '../../lib/connect';
import request from '../../lib/request';


class ProcessCreateBox extends Component {
    constructor(props) {
        super(props);

        const step = this.props.steps[this.props.stepIndex];

        this.state = {
            entry: {
                stepId: step.id,
                processId: step.processId,
                customerId: 0,
                name: null,
                email: null,
                phone: null,
                statusOpportunityId: 0,
                probability: step.percent,
                ownerId: 0,
                expectedRevenue: "",
                deadline: null,
                notes: null
            },
            changed: false
        }

    }

    setValue = (data) => {
        this.setState({
            changed: true,
            entry: { ...this.state.entry, ...data }
        })
    }

    setCustomer = item => {
        if (!this.state.entry.email) {
            this.state.entry.email = item.email;
        }
        if (!this.state.entry.phone) {
            this.state.entry.phone = item.phone;
        }
        if (!this.state.entry.name) {
            this.state.entry.name = item.fullName;
        }
        this.setValue({ customerId: item.id });
    }

    setStep = item => {
        this.state.entry.probability = item.percent;
        this.setValue({ stepId: item.id });
    }

    save = () => {
        if (!this.state.entry.customerId) {
            return alert('Y??u c???u ch???n kh??ch h??ng.');
        }

        this.setState({ loading: true });

        this.props.actions
            .create(this.state.entry)
            .then(data => {
                this.setState({ loading: false });
                this.props.onRequestClose();

                Toast.show({
                    text: 'Th??m m???i th??nh c??ng',
                    duration: 2500,
                    position: 'bottom',
                    textStyle: { textAlign: 'center' },

                });
            })
            .catch(error => {
                alert(error);
                this.setState({ loading: false });
            });

    }


    render() {
        const entry = this.state.entry;

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
                    titleText='Th??m c?? h???i m???i'
                    style={styles.toolbar}
                ></Toolbar>
                <View style={styles.process}>
                    <ScrollView keyboardShouldPersistTaps='always'>
                        <View style={styles.processInfo}>
                            <View style={styles.processProp}>
                                <Text style={styles.label}>{__('B?????c')}</Text>
                                <Select
                                    items={this.props.steps.map(item => ({
                                        ...item, label: item.name, value: item.id
                                    }))}
                                    style={styles.select}
                                    onValueChange={(value, item) => this.setStep(item)}
                                    selectedValue={entry.stepId}
                                    showSearchBox={false} />
                            </View>

                            <View style={styles.processProp}>
                                <Text style={styles.label}>{__('Kh??ch h??ng')}</Text>
                                <CustomerSelect
                                    style={styles.select}
                                    multiple={false}
                                    showPhone={true}
                                    onValueChange={(value, item) => this.setCustomer(item)}
                                    selectedValue={entry.customerId} />
                            </View>

                            <View style={styles.processProp}>
                                <Text style={styles.label}>{__('T??n c?? h???i')}</Text>
                                <TextInput
                                    style={styles.input}
                                    underlineColorAndroid='transparent'
                                    value={entry.name}
                                    onChangeText={value => this.setValue({ name: value })} />
                            </View>

                            <View style={styles.processProp}>
                                <Text style={styles.label}>{__('??i???n tho???i')}</Text>
                                <TextInput
                                    style={styles.input}
                                    underlineColorAndroid='transparent'
                                    keyboardType='phone-pad'
                                    value={entry.phone}
                                    onChangeText={value => this.setValue({ phone: value })} />
                            </View>

                            <View style={styles.processProp}>
                                <Text style={styles.label}>{__('Email')}</Text>
                                <TextInput
                                    style={styles.input}
                                    underlineColorAndroid='transparent'
                                    keyboardType='email-address'
                                    value={entry.email}
                                    onChangeText={value => this.setValue({ email: value })} />
                            </View>

                            <View style={styles.processProp}>
                                <Text style={styles.label}>{__('Ph??? tr??ch')}</Text>
                                <UserSelect style={styles.select}
                                    onValueChange={(value, item) => this.setValue({ ownerId: value })}
                                    selectedValue={entry.ownerId} />
                            </View>

                            <View style={styles.processProp}>
                                <Text style={styles.label}>{__('X??c su???t th??nh c??ng')}</Text>
                                <Select
                                    items={[
                                        { label: '0%', value: '0' },
                                        { label: '10%', value: '10' },
                                        { label: '20%', value: '20' },
                                        { label: '30%', value: '30' },
                                        { label: '40%', value: '40' },
                                        { label: '50%', value: '50' },
                                        { label: '60%', value: '60' },
                                        { label: '70%', value: '70' },
                                        { label: '80%', value: '80' },
                                        { label: '90%', value: '90' },
                                        { label: '100%', value: '100' },
                                    ]}
                                    style={styles.select}
                                    selectedValue={entry.probability}
                                    showSearchBox={false}
                                    onValueChange={value => this.setValue({ probability: value })} />
                            </View>

                            <View style={styles.processProp}>
                                <Text style={styles.label}>{__('Doanh thu d??? ki???n')}</Text>
                                <TextInput
                                    style={styles.input}
                                    underlineColorAndroid='transparent'
                                    keyboardType='numeric'
                                    value={entry.expectedRevenue}
                                    onChangeText={value => this.setValue({ expectedRevenue: value })} />
                            </View>

                            <View style={styles.processProp}>
                                <Text style={styles.label}>{__('Ng??y ch???t d??? ki???n')}</Text>
                                <DatePicker
                                    mode="date"
                                    style={styles.datepicker}
                                    date={entry.deadline}
                                    onDateChange={(date) => { this.setValue({ deadline: date }) }}
                                />
                            </View>

                            <View style={styles.processProp}>
                                <Text style={styles.label}>{__('Ghi ch??')}</Text>
                                <TextInput
                                    style={[styles.input, { textAlignVertical: 'top' }]}
                                    underlineColorAndroid='transparent'
                                    multiline={true}
                                    numberOfLines={3}
                                    value={entry.notes}
                                    onChangeText={value => this.setValue({ notes: value })} />
                            </View>

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

export default connect(ProcessCreateBox, state => ({
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