import moment from 'moment';
// import Toast from 'react-native-simple-toast';
import React, { Component } from 'react';
import {
    Dimensions, Linking, StyleSheet, View, ScrollView,
    TouchableOpacity, Text, Image, Modal, WebView, TextInput, RefreshControl, Alert
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

class ProcessEditBox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            entry: {
                ...props.entry,
                customerId: props.entry.customerId || props.entry.customer.id
                // company: null,
                // owner: null,
                // customer: null,
                // creator: null
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
        if (item) {
            if (!this.state.entry.email && item.email) {
                this.state.entry.email = item.email;
            }
            if (!this.state.entry.phone && item.phone) {
                this.state.entry.phone = item.phone;
            }
            if (!this.state.entry.name && item.fullName) {
                this.state.entry.name = item.fullName;
            }
            this.setValue({ customer: item, customerId: item.id });
        }
        else {
            // console.log('setCustomer: no value')
        }
    }

    save = () => {
        if (!this.state.entry.customerId) {
            return alert('Yêu cầu chọn khách hàng.');
        }

        this.setState({ loading: true });
        const newOpportunity = {
            id: this.props.entry.id,
            name: this.state.name,
            phone: this.state.phone,
            email: this.state.email,
            probability: this.state.probability,
            expectedRevenue: this.state.expectedRevenue,
            deadline: this.state.deadline,
            note: this.state.note,
            ownerId: this.state.owner,
            stepId: this.state.stepId,
        }

        this.props.actions.update(this.state.entry).then(data => {
            this.setState({ loading: false });
            this.props.onRequestClose();
            Toast.show({
                text: 'Cập nhật thành công',
                duration: 2500,
                position: 'bottom',
                textStyle: { textAlign: 'center' },

            });
        }).catch(error => {
            alert(error);
            this.setState({ loading: false });
        })

    }

    onRequestClose = () => {
        if (this.state.changed) {
            Alert.alert(
                __('Lưu thay đổi?'),
                __('Một vài trường dữ liệu đã được thay đổi, bạn có muốn lưu lại không?'),
                [
                    {
                        text: '', onPress: () => console.log('Ask me later pressed')
                    },
                    { text: 'Cancel', onPress: () => this.props.onRequestClose() },
                    { text: 'OK', onPress: () => this.save() },
                ],
                { cancelable: false }
            )
        }
        else {
            this.props.onRequestClose();
        }
    }

    render() {
        const entry = this.state.entry;

        if (!entry) return null;

        return (
            <Modal
                supportedOrientations={['portrait', 'landscape']}
                onRequestClose={this.onRequestClose}>
                <Toolbar
                    icon={<Icon type='MaterialIcons' name='arrow-back' style={{ fontSize: 22, color: '#fff' }} />}
                    onIconPress={this.onRequestClose}
                    actions={[
                        {
                            icon: <Icon type='MaterialIcons' name='save' style={{ fontSize: 22, color: '#fff' }} />,
                            onPress: this.save,
                            disabled: this.state.loading
                        }
                    ]}
                    titleText='Cập nhật cơ hội mới'
                    style={styles.toolbar}
                ></Toolbar>
                <View style={styles.process}>
                    <ScrollView keyboardShouldPersistTaps='always'>
                        <View style={styles.processInfo}>
                            <View style={styles.processProp}>
                                <Text style={styles.label}>{__('Khách hàng')}</Text>
                                <CustomerSelect
                                    disabled={true}
                                    style={styles.select}
                                    multiple={false}
                                    showPhone={true}
                                    onValueChange={(value, item) => this.setCustomer(item)}
                                    selectedValue={entry.customerId} />
                            </View>

                            <View style={styles.processProp}>
                                <Text style={styles.label}>{__('Tên cơ hội')}</Text>
                                <TextInput
                                    style={styles.input}
                                    underlineColorAndroid='transparent'
                                    value={entry.name}
                                    onChangeText={value => this.setValue({ name: value })} />
                            </View>

                            <View style={styles.processProp}>
                                <Text style={styles.label}>{__('Điện thoại')}</Text>
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
                                <Text style={styles.label}>{__('Phụ trách')}</Text>
                                <UserSelect style={styles.select}
                                    onValueChange={(value, item) => this.setValue({ ownerId: value })}
                                    selectedValue={entry.ownerId}
                                />
                            </View>

                            <View style={styles.processProp}>
                                <Text style={styles.label}>{__('Xác suất thành công')}</Text>
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
                                <Text style={styles.label}>{__('Doanh thu dự kiến')}</Text>
                                <TextInput
                                    style={styles.input}
                                    underlineColorAndroid='transparent'
                                    keyboardType='numeric'
                                    value={entry.expectedRevenue ? entry.expectedRevenue.toString() : ""}
                                    onChangeText={value => this.setValue({ expectedRevenue: value })} />
                            </View>

                            <View style={styles.processProp}>
                                <Text style={styles.label}>{__('Ngày chốt dự kiến')}</Text>
                                <DatePicker
                                    mode="date"
                                    style={styles.datepicker}
                                    date={entry.deadline}
                                    onDateChange={(date) => { this.setValue({ deadline: date }) }}
                                />
                            </View>

                            <View style={styles.processProp}>
                                <Text style={styles.label}>{__('Ghi chú')}</Text>
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

export default connect(ProcessEditBox, state => ({
    opportunity: state.opportunity,
    host: state.account.host,
}), actions);

const styles = StyleSheet.create({
    page: {
        flex: 1,
    },
    toolbar: {
        backgroundColor: '#F44336'
    },
    process: {
        flex: 1,
        backgroundColor: '#f2f2f2'
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