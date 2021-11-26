import React, { Component } from 'react';
import {
    StyleSheet, View, Text, Modal, Dimensions, ScrollView
} from 'react-native';
import moment from 'moment';
import { Icon } from 'native-base';
import { connect } from '../../../lib/connect';
import { getAddress } from '../../../actions/location';
import Toolbar from '../../controls/toolbars';

class OrderBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            changed: false,
            box: this.props.box,
            address: ''
        }
        this.data = null;
    }

    onRequestClose = () => {
        this.props.onRequestClose()
    }

    componentDidMount() {
        let { entry } = this.props;
        this.props.actions.getAddress(entry.wardId, entry.districtId, entry.provinceId)
            .then(data => {
                this.setState({ address: entry.shippingAddress + ", " + data.address });
            })
    }

    render() {
        let { entry } = this.props;
        let { invoice } = this.props.entry;
        var customerFee = entry.invoice.total;
        if (!entry.isFreeShipping) {
            customerFee = entry.invoice.total + entry.invoice.shippingFeeX;
        }
        return (
            <Modal
                onRequestClose={this.onRequestClose}
                animationType='fade'
            >
                <View style={styles.container}>
                    <View style={styles.actionSheet}>
                        <Toolbar
                            noPadding
                            style={styles.toolbar}
                            icon={<Icon type="MaterialIcons" name='arrow-back' style={{ color: '#fff' }} size={22} />}
                            iconColor='#fff'
                            onIconPress={this.onRequestClose}
                            titleText={__('Chi tiết đơn hàng')}
                            titleColor='#fff'
                        ></Toolbar>
                        {invoice.details.length > 0 ?
                            <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
                                {
                                    invoice.details.map((item, key) => {
                                        let total = item.price * item.quantity;
                                        let totalAmount = total - (item.isDiscountPrice ? item.discount : (item.discount * total / 100))
                                        return (
                                            <View style={styles.customerInfo} key={key}>
                                                <View style={styles.customerProp}>
                                                    <Text style={[styles.value, { color: 'green' }]}>{__('Sản phẩm:')} {item.product.code + ' - ' + item.product.name}</Text>
                                                </View>
                                                <View style={styles.customerProp}>
                                                    <Text style={styles.value}>{__('Đơn vị tính:')} {item.product.unit}</Text>
                                                </View>
                                                <View style={styles.customerProp}>
                                                    <Text style={styles.value}>{__('Số lượng:')} {item.quantity}</Text>
                                                </View>
                                                <View style={styles.customerProp}>
                                                    <Text style={styles.value}>{__('Khối lượng:')} {item.product.weight}</Text>
                                                </View>
                                                <View style={styles.customerProp}>
                                                    <Text style={styles.value}>{__('Giá:')} {item.price.toLocaleString()}</Text>
                                                </View>
                                                <View style={styles.customerProp}>
                                                    <Text style={styles.value}>{__('Tổng tiền:')} {totalAmount.toLocaleString()}</Text>
                                                </View>
                                                <View style={styles.customerProp}>
                                                    <Text style={styles.value}>{__('Người bán:')} {entry.salerPhoneNumber ? entry.salerName + ' - ' + entry.salerPhoneNumber : entry.salerName}</Text>
                                                </View>
                                                <View style={styles.customerProp}>
                                                    <Text style={styles.value}>{__('Khách hàng:')} {entry.customerPhoneNumber ? entry.customerName + ' - ' + entry.customerPhoneNumber : entry.customerName}</Text>
                                                </View>
                                                <View style={styles.customerProp}>
                                                    <Text style={styles.value}>{__('Địa chỉ giao hàng:')} {this.state.address || entry.shippingAddress}</Text>
                                                </View>
                                                <View style={styles.customerProp}>
                                                    <Text style={styles.value}>{__('Hãng vận chuyển:')} {entry.transporterName}</Text>
                                                </View>
                                            </View>
                                        )
                                    })
                                }
                                <View style={[styles.customerInfo, { backgroundColor: '#ccc' }]}>
                                    <View style={styles.customerProp}>
                                        <Text style={styles.value}>{__('Tổng tiền:')} {invoice.details.sum(d => d.totalAmount).toLocaleString()}</Text>
                                    </View>
                                    <View style={styles.customerProp}>
                                        <Text style={styles.value}>{__('Chiết khấu:')} {
                                            entry.invoice.isDiscountPrice ?
                                                entry.invoice.discount.toLocaleString() :
                                                (invoice.details.sum(d => d.totalAmount) * entry.invoice.discount / 100).toLocaleString()
                                        }</Text>
                                    </View>
                                    <View style={styles.customerProp}>
                                        <Text style={styles.value}>{__('Trả trước:')} {
                                            (entry.invoice.depositAmount + entry.invoice.transferAmount).toLocaleString()
                                        }</Text>
                                    </View>
                                    <View style={styles.customerProp}>
                                        <Text style={styles.value}>{__('Phí giao hàng:')} {
                                            entry.invoice.shippingFee.toLocaleString()} {entry.isFreeShipping && ' (Người bán trả)'
                                            }</Text>
                                    </View>
                                    <View style={styles.customerProp}>
                                        <Text style={styles.value}>{__('Khách phải trả:')} {customerFee.toLocaleString()}</Text>
                                    </View>
                                </View>
                            </ScrollView>
                            :
                            <View style={styles.customerInfo}>
                                <View style={styles.customerProp}>
                                    <Text style={{ justifyContent: 'center', alignItems: 'center' }}>Không có dữ liệu</Text>
                                </View>
                            </View>

                        }
                    </View>
                </View>
            </Modal>
        );
    }
}

export default connect(OrderBox, state => ({
    invoices: state.invoice
}), { getAddress });

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    customerInfo: {
        padding: 10,
        borderColor: '#ccc',
        borderWidth: 2
    },
    customerProp: {
        flexDirection: 'row',
        paddingVertical: 6,
    },
    toolbar: {
        backgroundColor: '#ffb400',
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
    icon: {
        marginTop: 3,
        fontSize: 14,
        color: '#444'
    },
    value: {
        fontSize: 15,
        color: '#555',
        marginLeft: 10
    },
    viewSpinner: {
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: '#5db761',
        borderRadius: 10,
    },
    borderBottom: {
        borderColor: '#ccc',
        borderWidth: 2
    }
});
