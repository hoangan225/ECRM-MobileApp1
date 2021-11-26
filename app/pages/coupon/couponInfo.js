import React from 'react';
import moment from 'moment';
import { Alert, StyleSheet, Text, View, Modal, TextInput } from 'react-native';
import { Toast, Button } from 'native-base';

import Toolbar from '../controls/toolbars';
import Loading from '../controls/loading';

import { connect } from '../../lib/connect';
import * as actions from '../../actions/kopo/coupon';


class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            showExchangeModal: false,
            numberOfPerson: null,
            paymentNotes: null,
            billingAmount: null
        }
    }

    showExchange = () => {
        this.setState({ showExchangeModal: true })
    }

    exchange = () => {
        if (!this.state.billingAmount || !this.state.numberOfPerson) {
            return alert('Vui lòng nhập các vào thông tin đối với các trường bắt buộc');
        }

        this.setState({ loading: true });

        this.props.actions.checkout({
            id: this.props.model.id,
            numberOfPerson: this.state.numberOfPerson,
            paymentNotes: this.state.paymentNotes,
            billingAmount: this.state.billingAmount
        })
            .then(() => {
                this.setState({ loading: false });
                Toast.show({
                    text: 'Đổi mã thành công',
                    duration: 4000,
                    position: 'bottom',
                    textStyle: { textAlign: 'center' }
                });
                this.props.onRequestClose();
            })
            .catch(error => {
                this.setState({ loading: false });
                alert(error.error, error.message);
            })
    }

    render() {
        const coupon = this.props.model;
        if (!coupon || !this.props.open) return null;

        if (this.state.showExchangeModal) {
            return this.renderExchangeModal();
        }

        return (
            <Modal style={styles.page} onRequestClose={this.props.onRequestClose}>
                <Toolbar
                    noShadow
                    onIconPress={this.props.onRequestClose}
                    titleText={__('Thông tin khuyến mãi')}
                    style={styles.toolbar}
                ></Toolbar>
                {
                    <View style={{ marginHorizontal: 20 }}>
                        {
                            !!coupon.business &&
                            <View style={styles.prop}>
                                <Text style={styles.name}>{__('Nhà cung cấp')}</Text>
                                <Text style={styles.value}>{coupon.business.name}</Text>
                            </View>
                        }

                        <View style={styles.prop}>
                            <Text style={styles.name}>{__('Chương trình')}</Text>
                            <Text style={styles.value}>{coupon.voucher.title}</Text>
                        </View>
                        <View style={styles.prop}>
                            <Text style={styles.name}>{__('Mã coupon')}</Text>
                            <Text style={styles.value}>{coupon.code}</Text>
                        </View>
                        <View style={styles.prop}>
                            <Text style={styles.name}>{__('Khách hàng')}</Text>
                            <Text style={styles.value}>{coupon.user.fullName}</Text>
                        </View>
                        <View style={styles.prop}>
                            <Text style={styles.name}>{(__('Ngày nhận'))}</Text>
                            <Text style={styles.value}>{moment(coupon.createdDate).format('L HH:mm')}</Text>
                        </View>
                        <View style={styles.prop}>
                            <Text style={styles.name}>{(__('Hạn sử dụng'))}</Text>
                            <Text style={styles.value}>{coupon.expiryDate ? moment(coupon.expiryDate).format('L HH:mm') : 'Không hạn'}</Text>
                        </View>
                        <View style={styles.prop}>
                            <Text style={styles.name}>{(__('Giá trị'))}</Text>
                            <Text style={styles.value}>{this.getDiscountText(coupon.voucher)}</Text>
                        </View>
                        <View style={styles.prop}>
                            <Text style={styles.name}>{(__('Trạng thái'))}</Text>
                            <Text style={[styles.value, coupon.status != 1 ? styles.textRed : null]}>{getEnumLabel(coupon.status, this.props.couponStatus)}</Text>
                        </View>

                        {
                            !!coupon.booking && (
                                <View>
                                    <View style={styles.prop}>
                                        <Text style={styles.name}>{(__('Đặt chỗ ngày'))}</Text>
                                        <Text style={styles.value}>{moment(coupon.booking.bookingTime).format('L HH:mm')}</Text>
                                    </View>
                                    <View style={styles.prop}>
                                        <Text style={styles.name}>{(__('Số người'))}</Text>
                                        <Text style={styles.value}>{coupon.booking.numberOfPerson}</Text>
                                    </View>
                                </View>
                            )
                        }

                        {
                            coupon.status == 1 && (
                                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                                    <Button onPress={this.showExchange} primary style={styles.button}>
                                        <Text style={{ color: '#fff' }}>ÁP DỤNG THANH TOÁN</Text>
                                    </Button>
                                </View>
                            )
                        }
                    </View>
                }
                {
                    this.state.loading && <Loading />
                }
            </Modal>
        );
    }

    renderExchangeModal = () => {
        const coupon = this.props.model;
        return (
            <Modal style={styles.page} onRequestClose={this.props.onRequestClose}>
                <Toolbar
                    noShadow
                    onIconPress={this.props.onRequestClose}
                    titleText={__('Áp dụng thanh toán mã khuyến mãi')}
                    style={styles.toolbar}
                ></Toolbar>
                {
                    <View style={{ marginHorizontal: 20 }}>
                        {
                            !!coupon.business &&
                            <View style={styles.prop}>
                                <Text style={styles.name}>{__('Nhà cung cấp')}</Text>
                                <Text style={styles.value}>{coupon.business.name}</Text>
                            </View>
                        }

                        <View style={styles.prop}>
                            <Text style={styles.name}>{__('Chương trình')}</Text>
                            <Text style={styles.value}>{coupon.voucher.title}</Text>
                        </View>
                        <View style={styles.prop}>
                            <Text style={styles.name}>{__('Mã coupon')}</Text>
                            <Text style={styles.value}>{coupon.code}</Text>
                        </View>
                        <View style={styles.prop}>
                            <Text style={styles.name}>{__('Khách hàng')}</Text>
                            <Text style={styles.value}>{coupon.user.fullName}</Text>
                        </View>

                        <View style={styles.prop}>
                            <Text style={styles.name}>{__('Số người tham gia *')}</Text>
                            <TextInput
                                style={styles.textbox}
                                underlineColorAndroid='transparent'
                                value={this.state.numberOfPerson}
                                keyboardType='number-pad'
                                returnKeyType='next'
                                onChangeText={text => this.setState({ numberOfPerson: text })}
                            />
                        </View>

                        <View style={styles.prop}>
                            <Text style={styles.name}>{__('Số tiền thanh toán *')}</Text>
                            <TextInput
                                style={styles.textbox}
                                underlineColorAndroid='transparent'
                                value={this.state.billingAmount}
                                keyboardType='number-pad'
                                returnKeyType='next'
                                onChangeText={text => this.setState({ billingAmount: text })}
                            />
                        </View>

                        <View style={styles.prop}>
                            <Text style={styles.name}>{__('Ghi chú')}</Text>
                            <TextInput
                                style={styles.textbox}
                                underlineColorAndroid='transparent'
                                value={this.state.paymentNotes}
                                returnKeyType='done'
                                onChangeText={text => this.setState({ paymentNotes: text })}
                            />
                        </View>


                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                            <Button onPress={this.exchange} primary style={styles.button}>
                                <Text style={{ color: '#fff' }}>ÁP DỤNG</Text>
                            </Button>
                        </View>

                    </View>
                }
                {
                    this.state.loading && <Loading />
                }
            </Modal>
        );
    }

    getDiscountText = item => {
        if (item.discountAmount == 0) {
            return 'Miễn phí';
        }
        if (item.discountAmount > 0) {
            switch (item.discountType) {
                case 1:
                    return `Giảm ${item.discountAmount.toLocaleString()} %`;
                case 2:
                    return `Giảm ${item.discountAmount.toLocaleString()} đ`;
                case 3:
                    return `Chỉ còn ${item.discountAmount.toLocaleString()} đ`;
            }
        }
    }
}

export default connect(App, state => ({
    couponStatus: state.app.enums.couponStatus,
    channelType: state.app.enums.channelType
}), actions)

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