import { Icon } from 'native-base';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createAppContainer } from 'react-navigation';
import LogoutPage from '../../pages/account/logout';
import CustomerPage from '../../pages/customer/index';
import RefundPage from '../../pages/order/return/index';
import ListReturnPage from '../../pages/order/return/listReturn';
import ChangeStatusOrder from '../../pages/order/status/index';
import HomePage from '../../pages/home';
import JobPage from '../../pages/job/jobIndex';
import Notification from '../../pages/notifications/components/notificationIndex';
import ProfilePage from '../stacknavigations';
import MainSidebar from './homeSidebar';
// import ChatPages from '../../pages/chat';
import ChatPages from '../stackChatPages';

const AccountRouter = createDrawerNavigator(
    {
        Home: {
            screen: HomePage,
            path: 'home',
            navigationOptions: {
                drawerLabel: __('Trang chủ'),
                drawerIcon: props => (
                    <Icon type='FontAwesome' style={[styles.icon, { color: props.tintColor }]} name='home' color={props.tintColor} size={18} />
                ),
            }
        },
        Notification: {
            screen: Notification,
            path: 'notification',
            navigationOptions: {
                drawerLabel: __('Thông báo'),
                drawerIcon: props => (
                    <Icon type='FontAwesome' style={[styles.icon, { color: props.tintColor }]} name='bullseye' name='bell' color={props.tintColor} size={18} />
                ),
            }
        },
        Divider_Kopo_1: {
            screen: View
        },
        Pages: {
            screen: ChatPages,
            path: 'page',
            navigationOptions: {
                drawerLabel: __('Nobi chat'),
                drawerIcon: props => (
                    <Icon type='MaterialIcons' style={[styles.icon, { color: props.tintColor, transform: [{ rotate: '270deg' }] }]} name='offline-bolt' color={props.tintColor} size={18} />
                ),
            }
        },
        Job: {
            screen: JobPage,
            path: 'job',
            navigationOptions: {
                drawerLabel: __('Công việc'),
                drawerIcon: props => (
                    <Icon type='FontAwesome' style={[styles.icon, { color: props.tintColor }]} name='tasks' color={props.tintColor} size={18} />
                ),
            },
            params: {
                backgroundColor: '#00A7D0'
            }
        },
        // Customer: {
        //     screen: CustomerPage,
        //     path: 'customer',
        //     navigationOptions: {
        //         drawerLabel: () => __('Khách hàng'),
        //         drawerIcon: props => (
        //             <Icon type='FontAwesome' style={[styles.icon, { color: props.tintColor }]} name='users' color={props.tintColor} size={18} />
        //         ),
        //     }
        // },

        return: {
            screen: RefundPage,
            path: 'return',
            navigationOptions: {
                drawerLabel: () => __('Hoàn hàng'),
                drawerIcon: props => (
                    <Icon type='FontAwesome' style={[styles.icon, { color: props.tintColor }]} name='undo' color={props.tintColor} size={18} />
                ),
            }
        },
        listReturn: {
            screen: ListReturnPage,
            path: 'listReturn',
            navigationOptions: {
                drawerLabel: () => __('Danh sách hoàn'),
                drawerIcon: props => (
                    <Icon type='FontAwesome' style={[styles.icon, { color: props.tintColor }]} name='list' color={props.tintColor} size={18} />
                ),
            }
        },
        ListStatus: {
            screen: ChangeStatusOrder,
            path: 'statusOrder',
            navigationOptions: {
                drawerLabel: () => __('Chuyển trạng thái đơn'),
                drawerIcon: props => (
                    <Icon type='FontAwesome' style={[styles.icon, { color: props.tintColor }]} name='exchange' color={props.tintColor} size={18} />
                ),
            }
        },
        Divider_3: {
            screen: View
        },
        Profile: {
            screen: ProfilePage,
            path: 'profile',
            navigationOptions: {
                drawerLabel: __('Thông tin tài khoản'),
                drawerIcon: props => (
                    <Icon type='FontAwesome' style={[styles.icon, { color: props.tintColor }]} name='cog' color={props.tintColor} size={18} />
                ),
            }
        },
        Logout: {
            screen: LogoutPage,
            path: 'sign-out',
            navigationOptions: {
                drawerLabel: __('Đăng xuất'),
                drawerIcon: props => (
                    <Icon type='FontAwesome' style={[styles.icon, { color: props.tintColor }]} name='sign-out' color={props.tintColor} size={18} />
                ),
            }
        },
        Divider_4: {
            screen: View
        }
    },
    {
        initialRouteName: 'Home',
        contentComponent: props => (
            <MainSidebar {...props}
            // routes={this.routes}
            // onMenuItemPress={this.onMenuItemPress} 
            />
        )
    },

);

export default createAppContainer(AccountRouter);


const styles = StyleSheet.create({
    icon: { fontSize: 18, color: "#808080" }
});


