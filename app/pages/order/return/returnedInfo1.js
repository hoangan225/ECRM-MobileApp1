import React from 'react';
import moment from 'moment';
import { Alert, StyleSheet, Text, View, Modal, TextInput } from 'react-native';
import { Toast, Button } from 'native-base';

import Toolbar from '../../controls/toolbars';
import Loading from '../../controls/loading';
import { connect } from '../../../lib/connect';
import * as actions from '../../../actions/returned';
import { getAddress } from '../../../actions/location';
class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            address: null
        }
    }

    componentDidMount() {
        let returned = this.props.model;
        if (returned && returned.order) {
            this.getAddress(returned.order.wardId, returned.order.districtId, returned.order.provinceId)
        }

    }

    getAddress = (wardId, districtId, provinceId) => {
        this.props.actions.getAddress(wardId, districtId, provinceId).then((data) => {
            if (data && data.address) {
                this.setState({
                    address: data.address
                })
            }
        })
    }

    showconfirm = (code) => {
        this.setState({ loading: true });
        this.props.actions.confirm(code)
            .then(() => {
                this.setState({ loading: false });
                Toast.show({
                    text: 'Đã hoàn hàng',
                    duration: 4000,
                    position: 'bottom',
                    textStyle: { textAlign: 'center' }
                });
                this.props.onRequestClose();
            })
            .catch(error => {
                this.setState({ loading: false });
                // console.log(error);
                alert(error.error, error.message);
            })
    }

    convertPrice = (priceCv) => {
        const price = priceCv.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
        return price.toLocaleString();
    }

    render() {
        const returned = this.props.model;
        if (!returned || !this.props.open) return null;
        // console.log(returned)

        return (
            <Modal style={styles.page} onRequestClose={this.props.onRequestClose}>
                <Toolbar
                    noShadow
                    onIconPress={this.props.onRequestClose}
                    titleText={__('Thông tin đơn hàng')}
                    style={styles.toolbar}
                ></Toolbar>
                {
                    <View style={{ marginHorizontal: 20 }}>
                        {
                            !!returned.details &&
                            <View style={styles.prop}>
                                <Text style={styles.name}>{__('Sản phẩm')}</Text>
                                <Text style={styles.value}>{returned.details.length > 0 &&
                                    (
                                        returned.details.map(item =>
                                            item.product.code + ' - ' + item.product.name
                                        )
                                    )
                                }</Text>
                            </View>
                        }
                        {
                            !!returned.order.customerName &&
                            <View style={styles.prop}>
                                <Text style={styles.name}>{__('Khách hàng')}</Text>
                                <Text style={styles.value}>{returned.order.customerName}</Text>
                            </View>
                        }
                        {
                            !!returned.order.customerPhoneNumber &&
                            <View style={styles.prop}>
                                <Text style={styles.name}>{__('Số điện thoại')}</Text>
                                <Text style={styles.value}>{returned.order.customerPhoneNumber}</Text>
                            </View>
                        }
                        {
                            !!returned.order.salerName &&
                            <View style={styles.prop}>
                                <Text style={styles.name}>{__('Người bán')}</Text>
                                <Text style={styles.value}>{returned.order.salerName}</Text>
                            </View>
                        }
                        {
                            !!returned.order.invoice.createDate &&
                            <View style={styles.prop}>
                                <Text style={styles.name}>{__('Ngày bán hàng')}</Text>
                                <Text style={styles.value}>{moment(returned.order.invoice.createDate).format('DD/MM/YYYY')}</Text>
                            </View>
                        }
                        {
                            !!returned.order.customerNotes &&
                            <View style={styles.prop}>
                                <Text style={styles.name}>{__('Khách hàng ghi chú')}</Text>
                                <Text style={styles.value}>{returned.order.customerNotes}</Text>
                            </View>
                        }
                        <View style={styles.prop}>
                            <Text style={styles.name}>{__('Địa chỉ')}</Text>
                            {this.state.address &&
                                <Text style={styles.value}>{this.state.address}</Text>
                            }

                        </View>

                        {
                            !!returned.order.status && returned.order.status == 62 ?
                                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                                    <Button style={[styles.button, { backgroundColor: '#ccc' }]}>
                                        <Text style={{ color: '#fff' }}>ĐÃ HOÀN HÀNG</Text>
                                    </Button>
                                </View> :
                                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                                    <Button onPress={() => this.showconfirm(returned.order.id)} primary style={styles.button}>
                                        <Text style={{ color: '#fff' }}>XÁC NHẬN HOÀN HÀNG</Text>
                                    </Button>
                                </View>
                        }
                    </View>
                }
                {
                    this.state.loading && <Loading />
                }
            </Modal>
        );
    }

}

export default connect(App, null, { ...actions, getAddress })

const styles = StyleSheet.create({
    page: {
        flex: 1
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
        paddingVertical: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#eee'
    },
    name: {
        flex: 1,
        color: '#999'
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
});