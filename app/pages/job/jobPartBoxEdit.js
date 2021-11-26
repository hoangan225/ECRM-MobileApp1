import React, { Component } from 'react';
// import Toast from 'react-native-simple-toast';
import {
    Dimensions, Linking, StyleSheet, View, ScrollView,
    TouchableOpacity, Text, Image, Modal, WebView, TextInput, RefreshControl, Alert
} from 'react-native';
import striptags from 'striptags';
import KeyboardSpacer from '../controls/keyboard-space';
import WebContainer from '../controls/webcontainer';
import Toolbar from '../controls/toolbars';
import DatePicker from '../controls/datepicker';
import ImageViewer from '../controls/image-viewer';
import UserSelect from '../user';
import Loading from '../controls/loading';
// import HtmlEditor from '../controls/html-editor';

import Menu from '../controls/action-menu';
import { Icon, Toast } from 'native-base';

import StatusSelect from './jobStatusSelect';
import CustomerSelect from '../customer/components/customerSelect';

import { connect } from '../../lib/connect';
import * as actions from '../../actions/job';

const colors = ['#b00700', '#57e72e', '#ed4c56', '#877564', '#504559', '#d20cac', '#45095e',
    '#0e672f', '#b5b318', '#9e03b2', '#be084f', '#71f44c', '#2ef4ab', '#bc2e72'];

const jobs = [
    {
        id: 1,
        name: 'Công việc',
        icon: 'briefcase'
    },
    { id: 2, name: 'Gọi điện', icon: 'phone' },
    { id: 3, name: 'Hẹn gặp', icon: 'group' },
    { id: 4, name: 'Email', icon: 'envelope' },
    { id: 5, name: 'Ăn trưa', icon: 'glass' },
    { id: 6, name: 'Kỉ niệm', icon: 'gift' }];

class JobEditBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            entry: {
                ...this.props.entry,
                userIds: props.entry ? props.entry.users.filter(u => !u.isPrimary).map(u => u.id) : [],
                managerId: props.entry ? props.entry.users.find(u => u.isPrimary).id : 0,
                customerIds: props.entry ? props.entry.customers.map(u => u.id) : [],
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

    setManager = (user) => {
        let index = this.state.entry.users.findIndex(u => u.isPrimary);
        if (index >= 0) {
            this.state.entry.users[index] = {
                ...user,
                userId: user.id,
                isPrimary: true
            };
        }
        else {
            this.state.entry.users.push({
                ...user,
                userId: user.id,
                isPrimary: true
            })
        }

        this.setState({
            changed: true
        });
    }

    setUsers = (users) => {
        let manager = this.state.entry.users.find(u => u.isPrimary);
        this.state.entry.users = [
            manager,
            ...users.map(user => ({
                ...user,
                userId: user.id,
                isPrimary: false
            }))
        ];

        this.setState({
            changed: true
        });
    }

    save = () => {
        if (!this.state.entry.name || !this.state.entry.content) {
            return alert('Yêu cầu nhập tên và nội dung công việc.');
        }

        this.props.actions.update(this.state.entry)
            .then(data => {
                this.props.onRequestClose();

                Toast.show({
                    text: 'Cập nhật thành công',
                    duration: 2500,
                    position: 'bottom',
                    textStyle: { textAlign: 'center' },

                });
            })
            .catch(({ error, message }) => {
                this.props.onRequestClose();
                alert("Cập nhật công việc thất bại", message);
            });
        // this.props.onRequestClose();
    }


    onRequestClose = () => {
        if (this.state.changed) {
            Alert.alert(
                'Lưu thay đổi?',
                'Một vài trường dữ liệu đã được thay đổi, bạn có muốn lưu lại không?',
                [
                    { text: 'Cancel', onPress: () => this.props.onRequestClose(), style: 'cancel' },
                    {
                        text: 'OK', onPress: () => {
                            this.save()
                        }
                    },
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
        const striptagcontent = striptags(entry.content);
        if (!entry) return null;

        const managerId = entry.users.filter(u => u.isPrimary).map(c => c.id)[0];
        const userIds = entry.users.filter(u => !u.isPrimary).map(c => c.id);
        const customerIds = entry.customers.map(u => u.id);

        return (
            <Modal
                supportedOrientations={['portrait', 'landscape']}
                onRequestClose={this.onRequestClose}>
                <Toolbar
                    style={{ backgroundColor: entry.color }}
                    icon={<Icon type='MaterialIcons' style={{ fontSize: 22, color: '#fff' }} name='arrow-back' />}
                    onIconPress={this.onRequestClose}
                    actions={[
                        {
                            icon: <Icon name='save' type='MaterialIcons' style={{ fontSize: 22, color: '#fff' }} />,
                            onPress: this.save,
                            disabled: this.state.loading
                        }
                    ]}
                    titleText='Chỉnh sửa công việc'
                ></Toolbar>
                <View style={styles.job}>
                    <ScrollView keyboardShouldPersistTaps='always'>
                        <View style={styles.jobInfo}>

                            <Text style={styles.label}>{__('Loại công việc')}</Text>
                            <View style={styles.jobTypes}>
                                {
                                    jobs.map((item, i) => (
                                        <TouchableOpacity
                                            key={item.name}
                                            style={[styles.type, entry.type == item.id && styles.typeActive]}
                                            onPress={() => this.setValue({ type: item.id })}>
                                            <Icon type='FontAwesome' name={item.icon} style={styles.typeIcon} />
                                        </TouchableOpacity>

                                    ))
                                }

                            </View>

                            <View style={styles.jobProp}>
                                <Text style={styles.label}>{__('Tên công việc')}</Text>
                                <TextInput
                                    style={styles.input}
                                    underlineColorAndroid='transparent'
                                    value={entry.name}
                                    onChangeText={value => this.setValue({ name: value })} />
                            </View>

                            <View style={styles.jobProp}>
                                <Text style={styles.label}>{__('Trạng thái')}</Text>
                                <StatusSelect
                                    selectedValue={entry.statusId}
                                    style={styles.select}
                                    onValueChange={(value, item) => this.setValue({ statusName: item, statusId: value })} />
                            </View>
                            <View style={styles.jobProp}>
                                <Text style={styles.label}>{__('Nội dung')}</Text>
                                <TextInput
                                    numberOfLines={5}
                                    multiline={true}
                                    style={[styles.input, styles.inputTextarea]}
                                    underlineColorAndroid='transparent'
                                    // value={entry.content}
                                    value={striptagcontent}
                                    onChangeText={value => this.setValue({ content: value })} />
                            </View>
                            {/*
                            <View style={styles.jobProp}>
                                <Text style={styles.label}>Nội dung</Text>
                                <HtmlEditor
                                    style={styles.editor}
                                    html={entry.content}
                                    onContentChange={html => this.setValue({ content: html })} />
                            </View>

                             thiếu  chiến dịch */}

                            <View style={styles.jobProp}>
                                <Text style={styles.label}>{__('Khách hàng')}</Text>
                                <CustomerSelect
                                    style={styles.select}
                                    multiple={true}
                                    showPhone={true}
                                    selectedValue={this.state.entry.customerIds}
                                    onValueChange={(values, items) => this.setValue({ customerIds: values })}
                                />
                            </View>

                            <View style={styles.jobProp}>
                                <Text style={styles.label}>{__('Bắt đầu')}</Text>
                                <DatePicker
                                    style={styles.datepicker}
                                    mode="datetime"
                                    date={entry.startDate}
                                    onDateChange={(date) => { this.setValue({ startDate: date }) }}
                                />
                            </View>

                            <View style={styles.jobProp}>
                                <Text style={styles.label}>{__('Kết thúc')}</Text>
                                <DatePicker
                                    style={styles.datepicker}
                                    mode="datetime"
                                    date={entry.deadline}
                                    onDateChange={(date) => { this.setValue({ deadline: date }) }}
                                />
                            </View>


                            <View style={styles.jobProp}>
                                <Text style={styles.label}>{__('Giao cho')}</Text>
                                <UserSelect style={styles.select}
                                    onValueChange={text => this.setValue({ managerId: text || 0 })}
                                    selectedValue={this.state.entry.managerId}
                                />
                            </View>

                            <View style={styles.jobProp}>
                                <Text style={styles.label}>{__('Người liên quan')}</Text>
                                <UserSelect style={styles.select}
                                    multiple={true}
                                    selectedValue={this.state.entry.userIds}
                                    onValueChange={(values, items) => this.setValue({ userIds: values })}
                                />
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

export default connect(JobEditBox, state => ({
    job: state.job,
    jobStatus: state.jobstatus,
}), { ...actions });


const styles = StyleSheet.create({
    page: {
        flex: 1
    },
    job: {
        flex: 1,
        backgroundColor: '#f2f2f2'
    },
    jobInfo: {
        flex: 1,
        padding: 10,
    },
    jobTitle: {
        flex: 1,
        color: '#fff',
        fontSize: 20,
        padding: 10,
        fontWeight: 'bold',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1
    },
    jobTypes: {
        flexDirection: 'row'
    },
    type: {
        flex: 1,
        padding: 10,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#ccc',
        elevation: 0,
        shadowColor: 'black',
        shadowOpacity: 0.1,
        shadowRadius: StyleSheet.hairlineWidth,
        shadowOffset: {
            height: StyleSheet.hairlineWidth,
        },
        backgroundColor: '#fff'
    },
    typeIcon: {
        fontSize: 22,
        textAlign: 'center',
    },
    typeActive: {
        elevation: -10,
        shadowOpacity: 0,
        shadowRadius: 0,
        backgroundColor: '#f0f0f0'
    },
    jobProp: {
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
        height: 45,
        flex: 1,
        fontSize: 16,
        paddingHorizontal: 4
    },
    inputTextarea: {
        height: 150,
        justifyContent: "flex-start",
        textAlignVertical: 'top',
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
    jobComments: {
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
