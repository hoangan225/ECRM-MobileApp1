import React from 'react';
import moment from 'moment';
import { Alert, StyleSheet, Text, View, Modal, Platform } from 'react-native';
import { Toast } from 'native-base';

import MyStatusBar from '../statusBar/MyStatusBar';
import Toolbar from '../controls/toolbars';
import Loading from '../controls/loading';

import { connect } from '../../lib/connect';
import * as actions from '../../actions/coupon';
import Status from './btnCoupon';


class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false
        }
    }

    exchange = (item) => {
        Alert.alert(
            __('Sử dụng mã giảm giá'),
            __('Đánh dấu mã giảm giá đã được sử dụng?'),
            [
                { text: 'Cancel', onPress: () => this.setState({ loading: false }) },
                {
                    text: 'OK', onPress: () => {
                        this.setState({ loading: true });
                        this.props.actions.exchange(item)
                            .then(() => {
                                this.setState({ loading: false });
                                Toast.show({
                                    text: 'Đổi mã thành công',
                                    duration: 4000,
                                    position: 'bottom',
                                    textStyle: { textAlign: 'center' },
                                });
                                this.props.onRequestClose();
                            })
                            .catch(({ error, message }) => {
                                alert(message);
                                this.setState({ loading: false });
                            });
                    }
                },
            ],
            { cancelable: false }
        )

    }

    render() {
        const coupon = this.props.model;
        if (!coupon || !this.props.open) return null;

        return (
            <Modal style={styles.page} onRequestClose={this.props.onRequestClose}>
                <Toolbar
                    noShadow
                    onIconPress={this.props.onRequestClose}
                    titleText={__('Thông tin khuyến mãi')}
                    style={styles.toolbar}
                ></Toolbar>
                {
                    coupon &&
                    <View style={{ marginHorizontal: 20 }}>
                        {coupon.code &&
                            <View style={styles.customerProp}>
                                <Text style={styles.value}>{__('Mã coupon:')} {coupon.code}</Text>
                            </View>
                        }
                        {coupon.customer &&
                            <View style={styles.customerProp}>
                                <Text style={styles.value}>{__('Khách hàng:')} {coupon.customer.fullName}</Text>
                            </View>
                        }
                        {coupon.createDate &&
                            <View style={styles.customerProp}>
                                <Text style={styles.value}>{(__('Ngày tạo:'))} {moment(coupon.createDate).format('L HH:mm')}</Text>
                            </View>
                        }
                        {coupon.begin &&
                            <View style={styles.customerProp}>
                                <Text style={styles.value}>{(__('Bắt đầu có giá trị:'))} {moment(coupon.begin).format('L HH:mm')}</Text>
                            </View>
                        }
                        {coupon.expiryDate &&
                            <View style={styles.customerProp}>
                                <Text style={styles.value}>{(__('Hạn sử dụng:'))} {coupon.expiryDate ? moment(coupon.expiryDate).format('L HH:mm') : 'Không hạn'}</Text>
                            </View>
                        }

                        {coupon.type &&
                            <View style={styles.customerProp}>
                                <Text style={styles.value}>{(__('Giá trị:'))} {(coupon.type.discount || 0).toLocaleString() + (coupon.type.isPrice ? 'VNĐ' : '%')}</Text>
                            </View>
                        }

                        {coupon.type &&
                            <View style={styles.customerProp}>
                                <Text style={styles.value}>{(__('Loại coupon:'))} {(coupon.type ? coupon.type.name : '') + ' (' + (coupon.type ? coupon.type.code : '') + ')'}</Text>
                            </View>
                        }

                        {coupon.type &&
                            <View style={styles.customerProp}>
                                <Text style={styles.value}>{(__('Giới hạn số lượng:'))} {(coupon.type.max || 0).toLocaleString()}</Text>
                            </View>
                        }
                        {coupon.channel &&
                            <View style={styles.customerProp}>
                                <Text style={styles.value}>{(__('Loại kênh:'))} {coupon.channel ? getEnumLabel(coupon.channel, this.props.channelType) : ''}</Text>
                            </View>
                        }

                        {coupon.exchangeDate &&
                            <View style={styles.customerProp}>
                                <Text style={styles.value}>{(__('Ngày sử dụng:'))} {moment(coupon.exchangeDate).format('L HH:mm')}</Text>
                            </View>
                        }

                        {coupon.userFullName &&
                            <View style={styles.customerProp}>
                                <Text style={styles.value}>{(__('Nhân viên:'))} {coupon.userFullName}</Text>
                            </View>
                        }

                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                            <Status
                                onClick={() => this.exchange(coupon)}
                                expiryDate={coupon.expiryDate}
                                exchangeDate={coupon.exchangeDate}
                                onlyButton={true} button={true} />
                        </View>


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
    couponStatus: state.app.enums.couponStatus,
    channelType: state.app.enums.channelType
}), actions)

const styles = StyleSheet.create({
    page: {
        flex: 1
    },
    customerProp: {
        flexDirection: 'row',
        paddingVertical: 6,
    }
});