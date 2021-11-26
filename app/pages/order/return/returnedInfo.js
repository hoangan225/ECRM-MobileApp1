import React from 'react';
import moment from 'moment';
import { Alert, StyleSheet, Text, View, Modal, TextInput, ScrollView, Platform, Keyboard, Dimensions } from 'react-native';
import { Toast, Button } from 'native-base';

import Toolbar from '../../controls/toolbars';
import Loading from '../../controls/loading';
import { connect } from '../../../lib/connect';
import * as actions from '../../../actions/returned';
import { confirmReturn } from '../../../actions/product/order';
import { getAddress } from '../../../actions/location';
import { getDetails } from '../../../actions/product/invoice';
class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            address: null,
            returnFee: 0,
            details: {},
            error: false,
            height: 50
        }
    }

    componentDidMount() {
        const order = this.props.model ? this.props.model.order : null;
        if (order) {
            this.props.actions.getDetails(order.invoice.id);
            this.props.actions.getAddress(order.wardId, order.districtId, order.provinceId)
                .then(data => {
                    this.setState({ address: order.shippingAddress + ", " + data.address });
                })
        }
    }

    onFocus() {
        // console.log('onFocus')
        this.setState({
            height: Platform.OS === 'ios' ? 350 : 50
        })
    }

    onBlur() {
        // console.log('onBlur')
        this.setState({
            height: 50
        })
    }

    setReturnValue = (item, value) => {
        value = Number(value);
        var detailItem = this.state.details[item.product.id] || {};
        var distroyValue = detailItem.distroyQuantity || 0;

        if (value > item.quantity) {
            value = item.quantity;
            distroyValue = 0;
        }
        else if (distroyValue > item.quantity - value) {
            distroyValue = item.quantity - value;
        }

        this.setDetailItem(item, value, distroyValue)
    }

    setDistroyValue = (item, value) => {
        value = Number(value);
        var detailItem = this.state.details[item.product.id] || {};
        var returnValue = detailItem.returnQuantity || 0;

        if (value > item.quantity) {
            value = item.quantity;
            returnValue = 0;
        }
        else if (returnValue > item.quantity - value) {
            returnValue = item.quantity - value;
        }

        this.setDetailItem(item, returnValue, value)
    }

    setDetailItem = (item, returnValue, distroyValue) => {
        this.setState({
            details: {
                ...this.state.details,
                [item.product.id]: {
                    productId: item.product.id,
                    returnQuantity: parseInt(returnValue),
                    distroyQuantity: parseInt(distroyValue)
                }
            }
        })
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
        const details = this.props.model ? this.props.model.details : [];

        var error = details.every(item => {
            let detailItem = this.state.details[item.product.id] || {};
            let totalReturn = (detailItem.returnQuantity || 0) + (detailItem.distroyQuantity || 0);
            return totalReturn == 0;
        });

        this.setState({ error });

        if (!error) {
            if (!this.state.returnReason && !this.state.returnFee) {
                Alert.alert(
                    "Chú ý",
                    "Bạn chưa nhập phí hoàn và lý do hoàn, bạn có muốn tiếp tục không?",
                    [
                        {
                            text: "Cancel",
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel"
                        },
                        {
                            text: "OK", onPress: () => {
                                this.send();
                            }
                        }
                    ],
                    { cancelable: false }
                );
            }
            else {
                this.send();
            }
        }
    }

    send = () => {
        this.setState({ loading: true })
        this.props.actions.confirmReturn(this.props.model.order.id, {
            returnReason: this.state.returnReason,
            returnFee: parseInt(this.state.returnFee),
            details: Object.values(this.state.details)
        }).then(() => {
            alert("Cập nhật thành công");
            this.setState({ loading: false })
            this.handleClose();
        })
            .catch(error => {
                alert(error.error, error.message);
                this.setState({ loading: false })
            })
    }


    render() {
        let returned = this.props.model;
        // // console.log(this.state.height, "this height")
        if (!returned || !this.props.open) return null;
        const order = !!returned ? returned.order : null;
        const details = returned ? returned.details : null;
        if (returned.order.status != 61 && returned.order.status != 62) {
            return (
                <Modal style={styles.page} onRequestClose={this.props.onRequestClose}>
                    <Toolbar
                        noShadow
                        onIconPress={this.props.onRequestClose}
                        titleText={__('Xử lý hàng hoàn')}
                        style={styles.toolbar}
                    ></Toolbar>
                    {
                        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps='always'>
                            <View style={styles.card}>
                                <Text style={{ textAlign: 'center' }}>{__('Đơn hàng chưa được chuyển hoàn')}</Text>
                            </View>
                        </ScrollView>
                    }
                    {
                        this.state.loading && <Loading />
                    }
                </Modal>
            )
        }
        // // console.log(order, 'order')
        return (
            <Modal style={styles.page} onRequestClose={this.props.onRequestClose}>
                <Toolbar
                    noShadow
                    onIconPress={this.props.onRequestClose}
                    titleText={__('Xử lý hàng hoàn')}
                    style={styles.toolbar}
                ></Toolbar>
                {
                    <View style={styles.wrap}>
                        <ScrollView contentContainerStyle={styles.container}  >
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
                                        {order.customerName} - {order.customerPhoneNumber} {"\n"}{this.state.address || order.shippingAddress}
                                    </Text>
                                </View>
                                {
                                    order.invoice.notes &&
                                    <View style={styles.prop}>
                                        <Text style={styles.name}>{__('Ghi chú CSKH')}</Text>
                                        <Text style={styles.value}>
                                            {order.invoice.notes}
                                        </Text>
                                    </View>
                                }
                                {!!order.customerNotes &&
                                    <View style={styles.prop}>
                                        <Text style={styles.name}>{__('Ghi chú vận đơn')}</Text>
                                        <Text style={styles.value}>
                                            {order.customerNotes}
                                        </Text>
                                    </View>
                                }
                                <View style={styles.prop}>
                                    <Text style={styles.name}>{__('Người bán')}</Text>
                                    <Text style={styles.value}>
                                        {order.salerName} - {order.salerPhoneNumber}
                                    </Text>
                                </View>
                                <View style={styles.prop}>
                                    <Text style={styles.name}>{__('Phí hoàn')}</Text>
                                    <View style={styles.value}>
                                        <TextInput
                                            onBlur={() => this.onBlur()}
                                            onFocus={() => this.onFocus()}
                                            style={styles.textbox}
                                            autoCapitalize='none'
                                            underlineColorAndroid='transparent'
                                            value={this.state.returnFee ? this.state.returnFee.toString() : '0'}
                                            keyboardType='number-pad'
                                            onChangeText={text => this.setState({ returnFee: Number(text) })}
                                        />
                                    </View>
                                </View>

                                <View style={styles.prop}>
                                    <Text style={styles.name}>{__('Lý do hoàn')}</Text>
                                    <View style={styles.value}>
                                        <TextInput
                                            onBlur={() => this.onBlur()}
                                            onFocus={() => this.onFocus()}
                                            style={styles.textbox}
                                            autoCapitalize='none'
                                            multiline
                                            numberOfLines={4}
                                            underlineColorAndroid='transparent'
                                            value={this.state.returnReason}
                                            onChangeText={text => this.setState({ returnReason: text })}
                                        />
                                    </View>
                                </View>
                            </View>

                            {
                                details && details.map((item, index) => {
                                    let detailItem = this.state.details[item.product.id] || {}
                                    return (
                                        <View key={item.product.id} style={styles.card}>
                                            <View style={styles.prop}>
                                                <Text style={styles.name}>{__('Sản phẩm')} {index + 1}</Text>
                                                <Text style={styles.value}>
                                                    {item.product.code} - {item.product.name}
                                                </Text>
                                            </View>
                                            <View style={styles.prop}>
                                                <Text style={styles.name}>{__('Số lượng bán')}</Text>
                                                <Text style={styles.value}>
                                                    {item.quantity}
                                                </Text>
                                            </View>
                                            <View style={styles.prop}>
                                                <Text style={styles.name}>{__('Số lượng khách nhận')}</Text>
                                                <Text style={styles.value}>
                                                    {item.quantity - (detailItem.returnQuantity || 0) - (detailItem.distroyQuantity || 0)}
                                                </Text>
                                            </View>
                                            <View style={styles.prop}>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={styles.name}>{__('Số lượng hoàn tồn')}</Text>
                                                    <TextInput
                                                        onBlur={() => this.onBlur()}
                                                        onFocus={() => this.onFocus()}
                                                        style={[styles.textbox, { marginRight: 5 }]}
                                                        autoCapitalize='none'
                                                        underlineColorAndroid='transparent'
                                                        value={detailItem.returnQuantity ? detailItem.returnQuantity.toString() : '0'}
                                                        placeholder='Số lượng hoàn tồn'
                                                        keyboardType='number-pad'
                                                        onChangeText={v => this.setReturnValue(item, v)}
                                                    />
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={[styles.name]}>{__('Số lượng xuất hủy')}</Text>
                                                    <TextInput
                                                        onBlur={() => this.onBlur()}
                                                        onFocus={() => this.onFocus()}
                                                        style={[styles.textbox, { marginLeft: 5 }]}
                                                        autoCapitalize='none'
                                                        underlineColorAndroid='transparent'
                                                        value={detailItem.distroyQuantity ? detailItem.distroyQuantity.toString() : '0'}
                                                        placeholder='Số lượng xuất hủy'
                                                        keyboardType='number-pad'
                                                        onChangeText={v => this.setDistroyValue(item, v)}
                                                    />
                                                </View>
                                            </View>


                                        </View>
                                    )
                                })
                            }

                            {
                                this.state.error &&
                                <Text style={styles.error}>Cần nhập số lượng hoàn tồn hoặc xuất hủy</Text>
                            }

                            {
                                !!returned.order.status && returned.order.status == 62 ?
                                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: this.state.height }}>
                                        <Button style={[styles.button, { backgroundColor: '#ccc' }]}>
                                            <Text style={{ color: '#fff' }}>ĐÃ HOÀN HÀNG</Text>
                                        </Button>
                                    </View> :
                                    !!returned.order.status && (returned.order.status == 61) &&
                                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: this.state.height }}>
                                        <Button onPress={this.handleSubmit} primary style={styles.button}>
                                            <Text style={{ color: '#fff' }}>XÁC NHẬN HOÀN HÀNG</Text>
                                        </Button>
                                    </View>
                            }
                        </ScrollView>
                    </View>

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
}), { confirmReturn, getDetails, getAddress });

const styles = StyleSheet.create({
    page: {
        flex: 1
    },
    wrap: {
        height: Dimensions.height
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
        alignSelf: 'flex-start'
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