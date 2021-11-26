import React from "react";
import { createStackNavigator } from 'react-navigation-stack';
import ResetPW from '../pages/account/changePassword';
import AccountInfoPage from '../pages/account/accountinfo';
import ChangeAccountPage from '../pages/account/ChangeAccount';
import Account from '../pages/account';
// import changePassWordPage from './../pages/account/changePassWordPage';
// import LoginPage from './../pages/account/login';
const AccountStackNavigator = createStackNavigator(
    {
        Account: Account,
        ResetPassword: ResetPW,
        AccountInfo: AccountInfoPage,
        ChangeAccountPage: ChangeAccountPage,
        // ChangePassWordPage: changePassWordPage,
        // Login: LoginPage
    },
    {
        defaultNavigationOptions: {
            title: 'Tài khoản',
            headerStyle: {
                backgroundColor: '#ffb400'
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        },
    }
);

export default AccountStackNavigator;