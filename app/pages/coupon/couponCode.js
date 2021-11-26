import React, { Component } from 'react';
import moment from 'moment';
import { KeyboardAvoidingView, StyleSheet, View, Text, Platform, StatusBar, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Container, Icon, Toast, Button } from 'native-base';
import { DrawerActions } from 'react-navigation-drawer';
import MyStatusBar from '../statusBar/MyStatusBar';
import Toolbar from '../controls/toolbars';
import Loading from '../controls/loading';
import { connect } from '../../lib/connect';
import * as actions from '../../actions/coupon';
import { getItem } from '../../actions/kopo/coupon';

import Scanner from './qrscanner';
import OldInfo from './oldCouponInfo';
import Info from './couponInfo';

const styles = StyleSheet.create({
    page: {
        flex: 1,
    },
    logo: {
        width: 300,
        height: 130,
        marginBottom: 40
    },
    text: {
        color: '#28cc54',
        marginTop: 50
    },
    title: {
        flexDirection: "row",
        margin: 20
    },
    textbox: {
        flex: 1,
        height: 40,
        padding: 4,
        margin: 0,
        backgroundColor: '#f9f9f9',
        borderColor: "#ccc"
    },
    btnSearch: {
        flex: 1 / 4,
        backgroundColor: "#2196f3",
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff'
    },
    customerProp: {
        flexDirection: 'row',
        paddingVertical: 6,
    },
    icon: {
        marginTop: 3,
        fontSize: 14,
        color: '#444'
    },
    value: {
        fontSize: 15,
        color: '#555',
        marginLeft: 10,
        fontWeight: "bold"
    },
    wrap: {
        alignItems: 'center',
        paddingTop: 100,
        flex: 1
    },
    scanButton: {
        backgroundColor: "#2196f3",
        marginBottom: 20,
        alignSelf: 'center'
    },
    scanButtonText: {
        color: '#fff',
        marginHorizontal: 20
    },
    hintText: {
        marginVertical: 10,
        color: '#ccc'
    }
});

class CouponCode extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            search: null,
            oldCouponItem: null,
            couponItem: null,
            loading: false
        }

        this.canCoupon = this.context.user.hasCap("Coupon.Manage");
    }

    searchSubmit = () => {
        var code = this.state.search;
        if (code) this.searchCode(code);
    }

    searchCode = code => {
        var businessId = this.context.options.kopoBusinessId;
        this.setState({ loading: true });


        if (businessId && code.length > 5) {
            this.props.actions.getItem(code).then((data) => {
                // console.log('new coupon data', data)
                this.setState({ couponItem: data, loading: false });
            }).catch(e => {
                // console.log(e)
                this.setState({ loading: false, showMess: true });
                setTimeout(() => alert('Mã không hợp lệ'), 200)
            });
        }
        else {
            this.props.actions.searchCode({ search: code }).then((data) => {
                // console.log('old coupon data', data)
                if (data && data.item) {
                    this.setState({ oldCouponItem: data.item, loading: false });
                } else {
                    this.setState({ loading: false, oldCouponItem: null });
                    setTimeout(() => alert('Mã không hợp lệ'), 200)
                }
            }).catch(({ error, message }) => {
                this.setState({ loading: false, showMess: true });
                setTimeout(() => alert('Mã không hợp lệ'), 200)
            });
        }
    }



    getActionMenu = () => {
        return [];
    }

    showMenu = () => {
        this.props.navigation.dispatch(DrawerActions.openDrawer());
    }

    onScannedSuccess = data => {
        if (data) this.searchCode(data);
    }

    render() {
        const actions = this.getActionMenu();
        const navigationState = this.props.navigation.state;

        const backgroundColor = navigationState.params && navigationState.params.backgroundColor || '#50ba54';


        return (
            <View style={styles.page}>
                {
                    Platform.OS === 'ios' ?
                        <StatusBar backgroundColor={backgroundColor} barStyle='light-content' /> :
                        <MyStatusBar backgroundColor={backgroundColor} barStyle='light-content' />
                }
                <Toolbar
                    noShadow
                    icon={<Icon type='MaterialIcons' name="menu" style={{ fontSize: 22, color: '#fff' }} />}
                    actions={actions}
                    onIconPress={this.showMenu}
                    titleText={__('Mã coupon')}
                    style={{ backgroundColor }}
                    onPressMore={() => this.showBox({}, 'menucontext')}
                ></Toolbar>
                {
                    this.canCoupon ? (
                        <KeyboardAvoidingView style={styles.wrap} behavior="padding" enabled>
                            {this.state.loading && <Loading />}
                            <Button
                                style={styles.scanButton}
                                large iconLeft
                                onPress={() => this.setState({ showScanner: true })}>
                                <Icon name='scan-outline' type='Ionicons' />
                                <Text style={styles.scanButtonText}>Quét mã QR</Text>
                            </Button>
                            <Text style={styles.hintText}>Hoặc tra cứu mã</Text>
                            <View style={styles.title}>
                                <TextInput style={styles.textbox}
                                    autoCapitalize='characters'
                                    underlineColorAndroid='transparent'
                                    placeholder="Nhập mã coupon"
                                    value={this.state.search}
                                    onChangeText={text => this.setState({ search: text })} />
                                <TouchableOpacity style={styles.btnSearch} onPress={this.searchSubmit}>
                                    <Text style={{ color: "#fff" }}>Tra cứu</Text>
                                </TouchableOpacity>
                            </View>
                        </KeyboardAvoidingView>
                    ) : (
                        <Text style={{ color: "red", textAlign: 'center', paddingTop: 20 }}>Bạn không có quyền thao tác chức năng này</Text>
                    )
                }
                <Scanner
                    open={this.state.showScanner}
                    onRequestClose={() => this.setState({ showScanner: false })}
                    onScannedSuccess={this.onScannedSuccess} />

                <OldInfo
                    open={!!this.state.oldCouponItem}
                    model={this.state.oldCouponItem}
                    onRequestClose={() => this.setState({ oldCouponItem: null, search: null })}
                />

                <Info
                    open={!!this.state.couponItem}
                    model={this.state.couponItem}
                    onRequestClose={() => this.setState({ couponItem: null, search: null })}
                />
            </View>
        );
    }
}

export default connect(CouponCode, null, { ...actions, getItem });