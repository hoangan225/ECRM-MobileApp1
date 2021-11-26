import React, { Component } from 'react';
import moment from 'moment';
import {
    Modal, StyleSheet, View, Text, TextInput, FlatList, ScrollView, ActivityIndicator, Switch, RefreshControl, Alert
} from 'react-native';
import { Button, Icon } from 'native-base';
import Toolbar from '../controls/toolbars';
import DatePicker from '../controls/datepicker';
import StatusSelect from './jobStatusSelect';
import CustomerSelect from './../customer/components/customerSelect';
import UserSelect from '../user/index';
import { connect } from '../../lib/connect';
import * as actions from '../../actions/job';
import RsTouchableNativeFeedback from '../controls/touchable-native-feedback';

class CustomerSearchBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            onlyCurrentTab: false,
            result: [],
            statusId: 0,
            customerId: 0,
            userId: 0,
            from: null,
            to: null,
            remember: false,
            jobStatusId: 0
        };

        this.timer = null;
    }

    setValue = (data) => {
        this.setState({
            ...this.state, ...data
        })
        // this.applyFilter(data);
    }

    onRequestClose = () => {
        this.props.onRequestClose();
    }

    removeFilter = () => {
        var data = {
            statusId: 0,
            customerId: 0,
            userId: 0,
            remember: false,
            from: null,
            to: null,
            jobStatusId: 0
        };

        Alert.alert(
            'Xóa bộ lọc?',
            'Bạn có chắc chắn muốn xóa không?',
            [
                { text: 'Cancel', onPress: () => this.props.onRequestClose(), style: 'cancel' },
                {
                    text: 'OK', onPress: () => {
                        this.setState({
                            statusId: 0,
                            customerId: 0,
                            userId: 0,
                            remember: false,
                            from: null,
                            to: null,
                            jobStatusId: 0
                        })
                        this.applyFilter(data);
                        this.props.onRequestClose()
                    }
                },
            ],
            { cancelable: false }
        )
    }

    applyFilter = filter => {
        filter = { ...this.state, ...filter };

        this.setState({ loading: true })

        this.props.actions.getList(filter)
            .then(data => {
                this.setState({
                    total: data.total,
                    filter,
                    loading: false
                });
            })
            .catch(error => {
                alert(error.error, error.message);
                this.setState({ loading: false })
            })
    }

    onUpdate = () => {
        filter = { ...this.state };

        this.setState({ loading: true })
        this.props.onRequestClose();
        this.props.actions.getList(filter)
            .then(data => {
                this.setState({
                    total: data.total,
                    filter,
                    loading: false
                });
            })
            .catch(error => {
                alert(error.error);
                this.setState({ loading: false })
            })
    }

    render() {
        if (!this.props.show) return null;
        var actions = [
            {
                icon: <Icon name='delete' type='MaterialIcons' style={{ fontSize: 22, }} />,
                onPress: this.removeFilter
            }
        ]
        return (
            <Modal
                supportedOrientations={['portrait', 'landscape']}
                onRequestClose={this.onRequestClose}
                animationType="fade"
                transparent={true}>
                <View style={styles.container}>
                    <View style={styles.box}>
                        <Toolbar
                            style={styles.toolbar}
                            icon={<Icon name='arrow-back' type='MaterialIcons' style={{ fontSize: 22, }} />}
                            iconColor='#000'
                            onIconPress={this.onRequestClose}
                            titleText='Lọc công việc'
                            titleColor='#000'
                            actions={actions}
                        ></Toolbar>
                        <View style={styles.options}>
                            <Text style={styles.optionLable}>{__('Ghi nhớ tùy chọn lọc')}</Text>
                            <Switch
                                value={this.state.remember}
                                onValueChange={() => this.setState({ remember: !this.state.remember })} />
                        </View>

                        <ScrollView style={styles.scrollView} scrollEnabled={this.state.scrollEnabled}>
                            <View style={styles.formGroup}>
                                <Text style={styles.title}>{__('Ngày thực hiện')}</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <DatePicker
                                        placeholder='Từ ngày'
                                        style={styles.input}
                                        date={this.state.from}
                                        onDateChange={(date) => { this.setValue({ from: date }) }}
                                    />
                                    <DatePicker
                                        placeholder='Đến ngày'
                                        style={styles.input}
                                        date={this.state.to}
                                        onDateChange={(date) => { this.setValue({ to: date }) }}
                                    />
                                </View>
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.title}>{__('Trạng thái')}</Text>
                                <StatusSelect
                                    selectedValue={this.state.jobStatusId}
                                    onValueChange={(value, item) => this.setValue({ statusName: item, jobStatusId: value })}
                                    style={styles.select}
                                    allowEmpty={true}
                                />

                            </View>
                            <View style={styles.formGroup}>
                                <Text style={styles.title}>{__('Khách hàng')}</Text>

                                <CustomerSelect
                                    selectedValue={this.state.customerId}
                                    onValueChange={(value, item) => this.setValue({ customerId: value })}
                                    style={styles.select}
                                    allowEmpty={true}
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.title}>{__('Người thực hiện')}</Text>

                                <UserSelect
                                    selectedValue={this.state.userId}
                                    onValueChange={(value, item) => this.setValue({ userId: value || 0 })}
                                    style={styles.select}
                                    allowEmpty={true}

                                />
                            </View>

                        </ScrollView>

                        <RsTouchableNativeFeedback onPress={this.onUpdate} >
                            <View style={styles.footer}>
                                <Icon type='MaterialIcons' name="done" style={[{ fontSize: 26 }, styles.footerText]} />
                                <Text style={styles.footerText}>ÁP DỤNG</Text>
                            </View>
                        </RsTouchableNativeFeedback>
                    </View>
                </View>
            </Modal>
        );
    }

}

export default connect(CustomerSearchBox, state => ({
    customers: state.customer.items,
    job: state.job,
    jobStatus: state.jobstatus,
}), { ...actions });

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //padding: 10,
        //backgroundColor: 'rgba(0,0,0,0.4)',
    },
    box: {
        flex: 1,
        backgroundColor: '#fff',
        //borderRadius: 4
    },
    toolbar: {
        elevation: 1,
        //shadowOpacity: 0,
        //shadowRadius: 0,
        backgroundColor: '#fff',
        //borderRadius: 4
    },

    options: {
        backgroundColor: '#f9f9f9',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc',
        paddingHorizontal: 10,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    optionLable: {
        flex: 1,
        fontSize: 15
    },

    scrollView: {
        paddingHorizontal: 10,
        paddingBottom: 160,
        flex: 1,
        backgroundColor: '#fff',
    },
    footer: {
        elevation: 1,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: '#f2f2f2',
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        //borderBottomLeftRadius: 4,
        //borderBottomRightRadius: 4,
    },
    footerText: {
        color: 'green'
    },

    title: {
        paddingVertical: 10,
        color: '#222'
    },
    input: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#ccc',
        backgroundColor: '#fff',
        height: 45,
        margin: 1,
        flex: 1
    },
    select: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#ccc',
        backgroundColor: '#fff',
        minHeight: 45
    },
})