import moment from 'moment';
import React, { PureComponent } from 'react';
import { Platform, Linking, StyleSheet, View, Text, Image } from 'react-native';
import { Icon } from 'native-base';
import Avatar from '../../controls/avatar';
import RsTouchableNativeFeedback from '../../controls/touchable-native-feedback';

class ListItemReturn extends PureComponent {
    constructor(props) {
        super(props);
    }

    onPress = (idInvoice, idOrder) => {
        this.props.showBox(idInvoice, idOrder);
    }

    render() {
        const { order } = this.props;
        if (!order) return null;
        return (
            <RsTouchableNativeFeedback
                onPress={() => this.onPress(order.invoice.id, order.id)}
            >
                <View style={styles.customer}>
                    <Avatar url={null} name={order.customerName} id={order.id} />
                    <View style={styles.customerInfo}>
                        <Text style={styles.customerTitle} ellipsizeMode='tail' numberOfLines={1}>
                            {order.customerName + ' - ' + order.customerPhoneNumber}
                        </Text>
                        <View style={styles.customerProp}>
                            <Text style={[styles.value, { marginLeft: 0 }]} ellipsizeMode='tail' numberOfLines={1}>{order.code}</Text>
                            <Text style={styles.value} ellipsizeMode='tail' numberOfLines={1}>{moment(order.invoice.createDate).format('L HH:MM')}</Text>
                            <Text style={styles.value} ellipsizeMode='tail' numberOfLines={1}>{order.invoice.total.toLocaleString()}</Text>
                        </View>
                        <View style={styles.customerProp}>
                            <Text style={[styles.value, { marginLeft: 0 }]} ellipsizeMode='tail' numberOfLines={1}>
                                {
                                    order.status == 60 ? "Đang chuyển hoàn" :
                                        order.status == 61 ? "Đã chuyển hoàn" :
                                            order.status == 62 ? "Xác nhận c.hoàn" : "Không xác định"
                                }
                            </Text>
                        </View>
                    </View>
                </View>
            </RsTouchableNativeFeedback>
        )
    }
}

export default ListItemReturn;


const styles = StyleSheet.create({
    customer: {
        flexDirection: 'row',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#f2f2f2',
        paddingVertical: 5
    },
    customerInfo: {
        flex: 1,
        paddingLeft: 5,
        paddingRight: 10
    },
    customerTitle: {
        fontSize: 15,
        paddingTop: 10,
        color: '#222'
    },
    customerProp: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    icon: {
        fontSize: 12,
        // color: '#999'
        color: '#00000096',
    },
    value: {
        fontSize: 12,
        color: '#00000096',
        marginLeft: 10
    },
    customerAction: {
        padding: 7,
    },
    customerActionIcon: {
        flex: 1,
        padding: 3,
        fontSize: 25,
    },

});