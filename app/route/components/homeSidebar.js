import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants'
import React, { Component } from 'react';
import { Alert, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { DrawerActions, DrawerItems } from 'react-navigation-drawer';
import * as actions from '../../actions/account';
import * as appActions from '../../actions/app';
import { getProfile as getListUser } from '../../actions/account';
import { getList as getListBranch, setBranch as setListBranch } from '../../actions/branch';
import { getToken as actionsVoid } from '../../actions/voip/call';
import { connect } from '../../lib/connect';
import Avatar from '../../pages/controls/avatar';
import Select from '../../pages/controls/select';
import * as Updates from 'expo-updates';
import MyStatusBar from '../../pages/statusBar/MyStatusBar';
import NotificationHandler from './notificationHandler';

const ios = Platform.OS === 'ios';
const { version } = Constants.manifest
const buildNumber = ios ?
    Constants.manifest.ios.buildNumber :
    Constants.manifest.android.versionCode

class MainSidebar extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            selectedItem: 'null',
            activeBegin: true,
            loading: false,
            logoPressCount: 0,
            hideCoupon: false,
            kopoBusinessId: null
        }
        this.canCoupon = this.context.user.hasCap("Coupon.Manage");
    }

    componentDidMount() {
        if (this.props.voip.token.accessToken == null) {
            // this.props.actions.actionsVoid()
            //     .catch(({ error, message }) => {
            //         console.log(error)
            //     });
        }

        this.props.actions.getOptions().then((data) => {
            this.setState({
                hideCoupon: data ? data.hideCoupon : false,
                kopoBusinessId: data.kopoBusinessId
            })
        }).catch((e) => { console.log('error', e) })

        this.props.actions.getProfile();
        this.props.actions.getListUser().then(() => {
            this.setState({
                loading: false,
            })
        })
            .catch(({ error, message }) => {
                console.log(message)
            });
        // if (!this.props.branch.loaded || this.props.branch.items.length == 0) {

        this.setState({
            loading: true,
        })
        this.props.actions.getListBranch().then((s) => {
            this.setState({
                loading: false,
            })
        })
            .catch(({ error, message }) => {
                this.setState({
                    loading: false,
                })
            });
        // }

        Linking.addEventListener('url', this.handleOpenURL);
    }

    componentWillUnmount() {
        Linking.removeEventListener('url', this.handleOpenURL);
    }

    handleOpenURL = ({ url }) => {

        let { path, queryParams } = Linking.parse(url);
        if (queryParams.action == 'get-token') {
            Linking.openURL('stringeeapp://strtoken/?action=set-token&token=' + this.props.account.token + '&host=' + this.props.account.host + '&branch=' + this.props.branch.currentId)
                .catch(err => console.error('An error occurred', err));
        }
    }

    checkUpdate = async () => {
        try {
            const update = await Updates.checkForUpdateAsync();
            if (update.isAvailable) {
                Alert.alert(
                    'Cập nhật ứng dụng',
                    'Đã có phiên bản ứng dụng mới, bạn có muốn cập nhật ngay không?',
                    [
                        { text: 'Hủy Bỏ', style: 'cancel' },
                        {
                            text: 'Cập nhật', onPress: async () => {
                                await Updates.fetchUpdateAsync();
                                await Updates.reloadAsync();
                            }
                        },
                    ],
                    { cancelable: false }
                )
            }
            else {
                alert('Bạn đang sử dụng phiên bản ứng dụng mới nhất');
            }
        } catch (e) {
            console.log('check update error', e)
        }
    }

    setBranch = branch => {
        if (branch.value != this.props.branch.currentId) {
            var itembr = {
                balance: null,
                cashBooks: null,
                contracts: null,
                departments: null,
                description: null,
                id: branch.value,
                invoices: null,
                name: branch.lable,
                processes: null,
                products: null,
                status: 1,
            }
            this.props.actions.setListBranch(itembr);
            if (this.props.onChange) {
                this.props.onChange(branch.value);
            }
        }
    }



    onMenuItemPress = (scene, base) => {
        this.props.navigation.dispatch(DrawerActions.closeDrawer());
        if (scene.route.key.match(/^Divider/i)) {
            return false;
        }
        if (scene.route.key == 'Logout') {
            Alert.alert(
                __('Thông Báo'),
                __('Bạn Có Muốn Đăng Xuất Không?'),
                [
                    { text: __('Hủy Bỏ'), style: __('cancel') },
                    { text: __('Đăng Xuất'), onPress: () => this.props.navigation.navigate('Logout') },
                ],
                { cancelable: false }
            )
        }
        else {
            base(scene);
        }
        if (this.props.onMenuItemPress) {
            this.props.onMenuItemPress(scene.route.key);
        }
    }

    getLabel = (scene, base) => {
        if (scene.route.key.match(/^Divider/i)) {
            return (
                <TouchableWithoutFeedback>
                    <View style={styles.dividerWrap}>
                        <View style={styles.divider} />
                    </View>
                </TouchableWithoutFeedback>
            );
        }
        return (
            <View style={styles.menuLabel}>
                <Text style={[styles.menuText, { color: scene.tintColor }]}>{base(scene)}</Text>
                {
                    scene.route.key == 'Notification' && this.props.notification.newCount > 0 && (
                        <View style={styles.menuCount}>
                            <Text style={styles.menuCountText}>{this.props.notification.newCount}</Text>
                        </View>
                    )
                }
            </View>
        );
    }
    acc = () => {
        this.props.navigation.navigate('Profile')
    }

    handleUsernamePress = () => {
        if (this.state.logoPressCount == 5) {
            this.setState({ logoPressCount: 0 });
            Notifications.scheduleLocalNotificationAsync({
                title: "Test notification",
                body: "Notification should be okay"
            }, { time: (new Date()).getTime() + 3000 })
                .catch(e => console.log('test notification error', e))
        }
        else {
            this.setState({ logoPressCount: this.state.logoPressCount + 1 });
        }
    }

    render() {
        const navigationState = this.props.navigation.state;
        const currentRoute = navigationState.routes[navigationState.index]
        var menu = this.props.items;

        if (this.state.hideCoupon) {
            menu = menu.filter(item =>
                item.routeName != 'CouponOld' &&
                item.routeName != 'Coupon' &&
                item.routeName != 'CrossChecking' &&
                item.routeName != 'Booking' &&
                !item.routeName.match(/Divider_Kopo/i)
            );
        }
        else if (!this.state.kopoBusinessId) {
            menu = menu.filter(item =>
                item.routeName != 'Coupon' &&
                item.routeName != 'CrossChecking' &&
                item.routeName != 'Booking' &&
                !item.routeName.match(/Divider_Kopo/i)
            );
        }
        else {
            menu = menu.filter(item =>
                item.routeName != 'CouponOld'
            );
        }

        let background = currentRoute.params && currentRoute.params.backgroundColor || '#ffb400';

        const { items, userBranchIds, canSeeAllBranchs, currentId } = this.props.branch;
        if (!items) {
            return null;
        }
        const list = canSeeAllBranchs ? items : !!items && items.filter(b => userBranchIds.contains(b.id));

        const branch = !!list && list.find(b => b.id == currentId);
        const listBranch = !!list && list.map(item => ({
            label: item.name,
            value: item.id,
        }));

        return (
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <NotificationHandler />
                <MyStatusBar
                    barStyle="light-content"
                    backgroundColor={background}
                />
                <View style={[styles.posAvt, { backgroundColor: background }]}>
                    <Image source={require('../../assets/images/sidebar-logo.png')} resizeMode="cover" style={styles.logo} />
                </View>
                {
                    this.props.user && (
                        <View style={[styles.header, { backgroundColor: background }]}>
                            <TouchableOpacity onPress={this.acc}>
                                <Avatar style={styles.avatar}
                                    url={this.props.user.avatar}
                                    id={this.props.user.id}
                                    name={this.props.user.fullName}
                                    size={50} />
                            </TouchableOpacity>
                            <Text style={styles.username} onPress={this.handleUsernamePress}>{this.props.user.fullName}</Text>
                        </View>
                    )
                }

                {list.length > 1 &&
                    <View style={[{ backgroundColor: background, paddingLeft: 15, }]}>
                        <Select
                            items={listBranch}
                            selectTextStyle={styles.selectTextStyle}
                            arrowStyle={styles.arrowStyle}
                            selectedValue={branch ? branch.id : null}
                            showSearchBox={false}
                            onValueChange={(value, item) => this.setBranch(item)} />
                    </View>
                }
                <DrawerItems
                    {...this.props}
                    items={menu}
                    onItemPress={route => this.onMenuItemPress(route, this.props.onItemPress)}
                    getLabel={scene => this.getLabel(scene, this.props.getLabel)}
                />

                <View style={styles.version}>
                    <Text style={{ color: '#999' }} onLongPress={this.checkUpdate}>Version: {version}.{buildNumber}</Text>
                </View>
            </ScrollView>
        )
    }
}

export default connect(MainSidebar, state => ({
    branch: state.branch,
    account: state.account,
    user: state.account.user,
    notification: state.notification,
    host: state.account.host,
    app: state.app,
    voip: state.voip
}), {
    ...actions,
    ...appActions,
    getListUser,
    getListBranch,
    setListBranch,
    actionsVoid
});

const styles = StyleSheet.create({
    header: {
        height: 80,
        overflow: 'hidden',
        backgroundColor: '#50ba54',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
    },
    posAvt: {
        alignItems: 'center',
        paddingTop: 10,
    },
    logo: {
        width: 180,
        height: 90,
        resizeMode: 'contain',
    },
    imgAvt: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderColor: '#fff',
        borderWidth: 2,
    },
    username: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textShadowColor: '#777',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 6,
        backgroundColor: 'transparent',
        padding: 7,
        flex: 1
    },
    dividerWrap: {
        paddingVertical: 5,
        flex: 1
    },
    divider: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#ccc',
    },
    menuLabel: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 11
    },
    menuText: {
        fontSize: 16,
        flex: 1
    },
    menuCount: {
        backgroundColor: 'red',
        borderRadius: 10,
        marginRight: 15,
        paddingHorizontal: 6,
        paddingVertical: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 3
    },
    menuCountText: {
        color: '#fff'
    },
    selectTextStyle: {
        color: '#fff',
        fontSize: 16,
    },
    arrowStyle: {
        color: '#fff',
        fontSize: 30
    },
    avatar: {
        borderColor: '#fff',
        borderWidth: 3,
    },
    version: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 15,
        flexGrow: 1
    }
})
