import React, { Component } from 'react';
import moment from 'moment';
import { KeyboardAvoidingView, StyleSheet, View, Text, Platform, StatusBar, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Container, Icon, Toast, Button } from 'native-base';
import { DrawerActions } from 'react-navigation-drawer';
import MyStatusBar from '../../statusBar/MyStatusBar';
import Toolbar from '../../controls/toolbars';
import Loading from '../../controls/loading';
import { connect } from '../../../lib/connect';
import * as actions from '../../../actions/returned';
import { getList as getListOrder } from '../../../actions/product/order';
import Info from './returnedInfo';
import Scanner from './qrscanner';

class returnedCode extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            search: null,
            loading: false,
            infoItemCode: null
        }

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
                this.setState({ infoItemCode: data, loading: false, code });
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

        const backgroundColor = navigationState.params && navigationState.params.backgroundColor || '#ffb400';


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
                    titleText={__('Hoàn hàng')}
                    style={{ backgroundColor }}
                    onPressMore={() => this.showBox({}, 'menucontext')}
                ></Toolbar>
                <KeyboardAvoidingView style={styles.wrap} behavior="padding" enabled>

                    <Button
                        style={styles.scanButton}
                        large iconLeft
                        onPress={() => this.setState({ showScanner: true })}>
                        <Icon name='scan-outline' type='Ionicons' />
                        <Text style={styles.scanButtonText}>Quét mã vận đơn, mã đơn hàng</Text>
                    </Button>
                    <Text style={styles.hintText}>Hoặc tra cứu mã</Text>
                    <View style={styles.title}>
                        <TextInput style={styles.textbox}
                            autoCapitalize='characters'
                            underlineColorAndroid='transparent'
                            placeholder="Nhập mã vận đơn, mã đơn hàng"
                            value={this.state.search}
                            onChangeText={text => this.setState({ search: text })} />
                        <TouchableOpacity style={styles.btnSearch} onPress={this.searchSubmit}>
                            <Text style={{ color: "#fff" }}>Tra cứu</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
                {this.state.loading && <Loading />}
                <Scanner
                    open={this.state.showScanner}
                    onRequestClose={() => this.setState({ showScanner: false })}
                    onScannedSuccess={this.onScannedSuccess} />
                <Info
                    open={!!this.state.infoItemCode}
                    model={this.state.infoItemCode}
                    key={this.state.code}
                    onRequestClose={() => this.setState({ infoItemCode: null, search: null })}
                />
            </View>
        );
    }
}

export default connect(returnedCode, null, { ...actions, getListOrder });


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
