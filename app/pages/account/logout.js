import React, { Component } from 'react';
import { connect } from '../../lib/connect';
import { View, Text } from 'native-base';
import { logout } from '../../actions/account';
import { removeToken } from '../../actions/notification';
import Login from './login';

class Logout extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.actions.removeToken(this.props.notification.token)
            .catch(() => 1)
            .then(() => {
                this.props.actions.logout();
            })
    }

    UNSAFE_componentWillReceiveProps(props) {
        if (!props.account.loggedIn) {
            this.props.navigation.navigate('Login');
        }
    }

    render() {
        return (
            <View>
                <Text style={{ textAlign: 'center', paddingTop: 50 }}>Đang đăng xuất</Text>
            </View>
        )
    }
}



export default connect(Logout, state => ({
    account: state.account,
    notification: state.notification
}), { logout, removeToken });