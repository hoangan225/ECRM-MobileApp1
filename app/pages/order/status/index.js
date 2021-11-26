import React, { Component } from 'react';
import moment from 'moment';
import { KeyboardAvoidingView, StyleSheet, View, Text, Platform, StatusBar, CheckBox, TouchableOpacity, Alert } from 'react-native';
import { Container, Icon, Toast, Button } from 'native-base';
import { DrawerActions } from 'react-navigation-drawer';
import MyStatusBar from '../../statusBar/MyStatusBar';
import Toolbar from '../../controls/toolbars';
import Loading from '../../controls/loading';
import Select from '../../controls/select';
import { connect } from '../../../lib/connect';
import * as actions from '../../../actions/returned';
import { update as updateStatus } from '../../../actions/product/order';
import { getList as getListOrder } from '../../../actions/product/order';
import { rememberStatusOrder } from '../../../actions/account';
import Scanner from './scannerOrder';
import Info from './confirmStatus';

export const typeStatusMapping = {
    all: ['Picking', 'Picked', 'Delivering', 'DeliveringDelayed', 'Delivered', 'Successful', 'Returned', 'Returning', 'ConfirmReturned'],
    shipping: ['Picked', 'Delivering', 'DeliveringDelayed'],
}

class StatusOrderChange extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            search: null,
            loading: false,
            infoItemCode: null,
            checked: false,
            status: 51,
        }

    }

    onValueChange = (value) => {
        // console.log(value, "valuechange")
        this.setState({ status: value })
    }

    componentDidMount() {
        this.props.actions.getListOrder();
    }

    searchSubmit = () => {
        var code = this.state.search;
        if (code) this.searchCode(code);
    }

    searchCode = code => {
        this.setState({ loading: true, code: null });
        if (code.length > 4) {
            this.props.actions.searchCode(code).then((data) => {
                // console.log('new coupon data', data)
                var rememberStatus = this.props.order.rememberStatus;
                if (!!rememberStatus) {
                    // if (this.props.order.idOrder != data.order.id && !!rememberStatus) {
                    this.handleSubmit(data);
                    this.setState({ loading: false });
                    // }
                } else {
                    this.setState({ infoItemCode: data, loading: false, code });
                }

            }).catch(e => {
                // console.log(e)
                this.setState({ loading: false, showMess: true });
                setTimeout(() => alert('Mã không hợp lệ'), 200)
            });
        } else {
            this.setState({ loading: false })
            alert('Mã không hợp lệ')
        }
    }

    handleSubmit = (model) => {
        if (model) {
            let { rememberStatus } = this.props.order;
            let params = {
                ...model.order,
                invoice: {
                    ...model.order.invoice,
                    details: model.details
                },
                status: this.state.status
            }
            this.setState({ loading: true })
            // console.log(params, "params paramsssssss")
            this.props.actions.updateStatus(params).then(() => {
                alert("Cập nhật thành công");
                this.setState({ loading: false })
                this.handleClose();
            })
                .catch(error => {
                    this.setState({ loading: false })
                })
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

    getStatusList = (type) => {
        var mappingList = typeStatusMapping['all'];
        if (!mappingList) return null;

        var list = !!this.props.status && this.props.status.filter(s =>
            this.context.user.hasCap("Order.ChangeStatus." + s.name));
        if (!list) return null;

        if (type == 'for-select') {
            return this.state.type == 'all' ?
                list : list.filter(item => mappingList.contains(item.name))
        } else {
            return list.filter(s => s.value != 72 && s.value != 79 && s.value != 62 && mappingList.contains(s.name)); // loại trừ trạng thái người bán
            // hủy, xóa
        }
    }

    rememberStatus = () => {
        this.setState({ checked: !this.state.checked })
    }

    onRequestClose = () => {
        this.setState({ showScanner: false, });
    }

    render() {
        const actions = this.getActionMenu();
        const navigationState = this.props.navigation.state;

        const backgroundColor = navigationState.params && navigationState.params.backgroundColor || '#ffb400';
        var statusList = this.getStatusList();
        let lstOptions = [];
        if (!!statusList && statusList.length > 0) {
            lstOptions = statusList;
        }

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
                    titleText={__('Chuyển trạng thái đơn')}
                    style={{ backgroundColor }}
                    onPressMore={() => this.showBox({}, 'menucontext')}
                ></Toolbar>
                <KeyboardAvoidingView style={styles.wrap} behavior="padding" enabled>
                    {this.state.loading && <Loading />}
                    <View style={{ flexDirection: 'row', paddingHorizontal: 25 }}>
                        <Text style={styles.hintText}>Chọn trạng thái đơn:</Text>
                        <Select
                            style={{ flex: 1, backgroundColor: '#e8e8e8' }}
                            showSearchBox={false}
                            items={lstOptions}
                            selectedValue={this.state.status}
                            value={this.state.status}
                            onValueChange={this.onValueChange} />
                    </View>

                    <Button
                        style={styles.scanButton}
                        large iconLeft
                        onPress={() => this.setState({ showScanner: true })}>
                        <Icon name='scan-outline' type='Ionicons' />
                        <Text style={styles.scanButtonText}>Quét mã vận đơn, mã đơn hàng</Text>
                    </Button>
                </KeyboardAvoidingView>

                <Scanner
                    open={this.state.showScanner}
                    onRequestClose={this.onRequestClose}
                    onScannedSuccess={this.onScannedSuccess} />
                <Info
                    open={!!this.state.infoItemCode}
                    model={this.state.infoItemCode}
                    key={this.state.code}
                    checked={this.state.checked}
                    status={this.state.status}
                    onRequestClose={() => this.setState({ infoItemCode: null, search: null })}
                />
            </View>
        );
    }
}

export default connect(StatusOrderChange,
    state => ({
        order: state.order,
        branch: state.branch,
        status: state.app.enums.orderStatus,
    }),
    { ...actions, getListOrder, rememberStatusOrder, updateStatus });


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
        margin: 20,
        height: 40
    },
    textbox: {
        flex: 3,
        height: 40,
        padding: 4,
        margin: 0,
        backgroundColor: '#f9f9f9',
        borderColor: "#ccc"
    },
    btnSearch: {
        flex: 1,
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
        // alignItems: 'center',
        paddingTop: 100,
        flex: 1
    },
    scanButton: {
        backgroundColor: "#2196f3",
        marginVertical: 20,
        alignSelf: 'center'
    },
    scanButtonText: {
        color: '#fff',
        marginHorizontal: 20
    },
    hintText: {
        margin: 10,
        color: '#ccc'
    }
});
