import React, { Component, useRef } from 'react';
import { AppState, Alert, Vibration } from 'react-native';
import Constants from 'expo-constants'
import { connect } from '../../lib/connect';
import * as actions from '../../actions/notification';
import getTokenAsync from '../../lib/notification';
import * as Notifications from 'expo-notifications';

export function getNotificationEntityData(notif) {
    if (notif) {
        let id = 0;
        let entity = null;
        let link = notif.link && notif.link.toLowerCase().replace(/^(https?:\/\/)?[^\/]+/, '');

        // console.log('link', link);

        let entityMatch = link && link.match(/^\/(\w+)\/?/);
        let idMatch = link && link.match(/\/(\d+)$/);

        if (entityMatch) {
            entity = entityMatch[1];
        }

        if (idMatch) {
            id = Number(idMatch[1]);
        }

        return {
            id: notif.id,
            message: notif.content,
            avatar: notif.image,
            title: notif.title,
            time: notif.date,
            entity: entity,
            entityId: id
        };
    }

    return null;
}

class NotificationHandler extends Component {
    state = {
        appState: AppState.currentState
    }

    async componentDidMount() {
        var token = await getTokenAsync();
        if (token) {
            // console.log('notification token', token);
            this.props.actions.sendToken(token, {
                type: Constants.platform.ios ? 2 : 1,
                model: Constants.deviceName
            });

            this._notificationSubscription = Notifications.addNotificationReceivedListener(this._handleNotification);
            this._notificationResponseSubscription = Notifications.addNotificationResponseReceivedListener(this._handleNotificationResponse)

        }
        this.props.actions.getList();
        AppState.addEventListener('change', this._handleAppStateChange);
    }

    componentWillUnmount() {
        this._notificationSubscription && this._notificationSubscription.remove();
        this._notificationResponseSubscription && this._notificationResponseSubscription.remove();
    }

    _handleAppStateChange = (nextAppState) => {
        this.setState({ appState: nextAppState });
    }

    _handleNotificationResponse = response => {
        const data = response.notification.data;
        if (data && data.id) {
            this.props.actions.markAsRead(data.id, getNotificationEntityData(data));
        }
    }

    _handleNotification = notification => {
        const data = notification.data;
        this.props.actions.getList();
        Vibration.vibrate();
        if (data) {
            if (data.action) {
                this._handleAction(data);
            }
            else if (data.id) {
                var exists = this.props.notification.messages.find(item => item.id == data.id);
                if (!exists) { // tin mới
                    this.props.actions.onMessage(data);
                }

                if (exists || notification.origin == 'selected') { // khi người dùng select (click) thông báo trên khay thông báo
                    this.props.actions.markAsRead(data.id, getNotificationEntityData(data));
                }
            }

            if (!!Constants.platform.ios && this.state.appState == 'active' && notification.title) {
                // với iphone thông báo không xuất hiện khi ứng dụng đang mở
                Alert.alert(
                    notification.title,
                    notification.message
                )
            }
        }
        // console.log("notification received. ", notification);
    }

    _handleAction = data => {
        switch (data.action) {
            case 'logout': //ép buộc đăng xuất
                break;
            case 'sycn': //yêu cầu đồng bộ dữ liệu với server
                break;
        }
    }

    render() {
        return null;
    }
}

export default connect(NotificationHandler, state => ({
    notification: state.notification
}), actions);