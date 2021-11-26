import React from 'react';
import moment from 'moment';
import { Alert, StyleSheet, Text, View, Modal, TextInput, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Toast, Button, CheckBox } from 'native-base';
import Toolbar from '../../controls/toolbars';
import Loading from '../../controls/loading';
import { connect } from '../../../lib/connect';
import * as actions from '../../../actions/product/order';
import { getAddress } from '../../../actions/location';
import { getDetails } from '../../../actions/product/invoice';
import { rememberStatusOrder } from '../../../actions/product/order';
class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            address: null,
            returnFee: 0,
            details: {},
            errors: {},
            checked: false,
        }
    }

    componentDidMount() {
        const order = this.props.model ? this.props.model.order : null;
        if (order) {
            this.props.actions.getDetails(order.invoice.id);
        }
    }

    getModel = () => {
        if (this.props.model) {
            return this.props.order.items.find(item => item.id == this.props.model.order.id);
        }
        return null;
    }

    handleClose = () => {
        if (this.props.onRequestClose) {
            this.props.onRequestClose();
        }
    }

    handleSubmit = () => {
        if (this.props.model) {
            let { rememberStatus } = this.props.order;
            let params = {
                ...this.props.model.order,
                invoice: {
                    ...this.props.model.order.invoice,
                    details: this.props.model.details
                },
                status: this.props.status
            }
            this.setState({ loading: true })
            this.props.actions.update(params).then(() => {
                alert("Cập nhật thành công");
                this.setState({ loading: false })
                this.handleClose();
            })
                .catch(error => {
                    alert(error.error, error.message);
                    this.setState({ loading: false })
                })
            if (this.state.checked) {
                this.props.actions.rememberStatusOrder(this.props.status);
            }
        }

    }

    rememberStatus = () => {
        this.setState({ checked: !this.state.checked })
    }

    render() {
        let status = this.props.model;

        if (!status || !this.props.open) return null;
        const order = !!status ? status.order : null;
        const details = status ? status.details : null;
        // // console.log(order, 'order')
        return (
            <Modal style={styles.page} onRequestClose={this.props.onRequestClose}>
                <Toolbar
                    noShadow
                    onIconPress={this.props.onRequestClose}
                    titleText={__('Chuyển trạng thái')}
                    style={styles.toolbar}
                ></Toolbar>
                {
                    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps='always'>
                        <View style={styles.card}>
                            <View style={styles.prop}>
                                <Text style={styles.name}>{__('Đơn hàng')}</Text>
                                <Text style={styles.value}>
                                    {order.code} - {moment(order.createDate).format('DD/MM/YYYY HH:mm')} - {order.invoice.total.toLocaleString()}đ
                                </Text>
                            </View>
                            <View style={styles.prop}>
                                <Text style={styles.name}>{__('Khách hàng')}</Text>
                                <Text style={styles.value}>
                                    {order.customerName} - {order.customerPhoneNumber}
                                </Text>
                            </View>
                        </View>
                        {
                            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: 50 }}>
                                <Button onPress={this.handleSubmit} primary style={styles.button}>
                                    <Text style={{ color: '#fff' }}>ĐỔI TRẠNG THÁI</Text>
                                </Button>
                                <TouchableOpacity
                                    style={{ flexDirection: 'row', paddingHorizontal: 28 }}
                                    onPress={this.rememberStatus}
                                >
                                    <CheckBox
                                        checked={this.state.checked}
                                        value={this.state.checked}
                                        onPress={this.rememberStatus}
                                        style={{ margin: 5, paddingLeft: 0 }}
                                    />
                                    <Text style={{ marginTop: 5, marginLeft: 5 }}> Không hỏi lại</Text>
                                </TouchableOpacity>
                            </View>
                        }
                    </ScrollView>
                }
                {
                    this.state.loading && <Loading />
                }
            </Modal>
        );
    }

}

export default connect(App, state => ({
    order: state.order
}), { ...actions, getDetails, getAddress, rememberStatusOrder });

const styles = StyleSheet.create({
    page: {
        flex: 1
    },
    container: {
        backgroundColor: '#f9f9f9',
        padding: 10
    },
    card: {
        padding: 10,
        backgroundColor: '#fff',
        marginBottom: 10
    },
    textRed: {
        color: 'red'
    },
    button: {
        marginTop: 20,
        padding: 10,
        alignSelf: 'center',
        backgroundColor: "#2196f3"
    },
    prop: {
        flexDirection: 'row',
        paddingVertical: 10
    },
    name: {
        flex: 1,
        color: '#999',
        alignSelf: 'center'
    },
    value: {
        flex: 2
    },
    textbox: {
        flex: 2,
        height: 40,
        padding: 6,
        margin: 0,
        backgroundColor: '#f9f9f9'
    },
    error: {
        textAlign: 'center',
        color: 'red'
    }
});