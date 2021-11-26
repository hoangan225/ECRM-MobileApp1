import React, {
    Component
} from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    Text,
    Image,
    ScrollView,
    RefreshControl,
    ActivityIndicator,
    AppState,
    Platform,
    StatusBar
} from 'react-native';
// import FCM from 'react-native-fcm';
import {
    Icon
} from 'native-base';
import {
    connect
} from '../../../lib/connect';
// import request from '../../../lib/request';
import * as actions from '../../../actions/notification';

import Toolbar from '../../controls/toolbars';

import NotificationItem from './notificationPartItem';
import MyStatusBar from '../../statusBar/MyStatusBar';
import NotificationDetails from './notificationDetails';

import { getNotificationEntityData } from '../../../route/components/notificationHandler';

// const defaultAvatar = require('../../../assets/images/avatar.png');

class NotificationPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            loadingMore: false,
            refreshing: false,
            currentNotification: null
        }
    }

    componentDidMount() {
        //this.props.actions.getList() --> đã lấy ở notificationHandler
        this.markReceive();
    }

    componentDidUpdate() {
        this.markReceive();
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        if (!this.props.open && newProps.open && this.props.message.newCount > 0) {
            this.props.actions.markAllAsReceived();
        }
        if (newProps.notification.currentNotification) {
            this.setState({ currentNotification: newProps.notification.currentNotification });
        }
    }

    markReceive = () => {
        if (this.props.navigation.state.key == 'Notification') {
            if (this.props.notification.newCount > 0) {
                this.props.actions.markAllAsReceived();
            }
        }
    }

    formatNotification = (notif) => {
        return getNotificationEntityData(notif);
    }

    onPress = (item) => {
        // var { notification, actions } = this.props
        var format = this.formatNotification(item);
        this.props.actions.markAsRead(item.id, format);
    }

    loadMore = () => {
        if (this.props.notification.total > this.props.notification.offset) {
            if (this.state.loadingMore == false) {
                this.setState({
                    loadingMore: true
                });
                this.props.actions.getList(this.props.notification.offset)
                    .catch(() => 1).then(() => {
                        this.setState({
                            loadingMore: false
                        })
                    })
            }
        }
    }

    onRefresh = () => {
        this.props.actions.getList()
            .catch(({ error, message }) => alert(error, message))
            .then(() => {
                this.setState({ refreshing: false })
            })
    }

    showMenu = () => {
        this.props.navigation.openDrawer();
    }

    closeDetails = () => {
        this.setState({ currentNotification: null });
        this.props.actions.closeNotification();
    }

    render() {
        const { messages } = this.props.notification;
        return (
            <View style={styles.page}>
                {Platform.OS === 'ios' ? <StatusBar backgroundColor='#ffb400' barStyle='light-content' /> : <MyStatusBar backgroundColor='#ffb400' barStyle='light-content' />}
                <Toolbar
                    icon={<Icon type='MaterialIcons' name='menu' style={{ fontSize: 22, color: '#fff' }} />}
                    onIconPress={this.showMenu}
                    titleText='Thông báo'
                />
                <FlatList
                    style={styles.listView}
                    data={messages}
                    keyExtractor={item => 'ID' + item.id}
                    renderItem={this.renderItem}
                    ListFooterComponent={this.renderFooter()}
                    onEndReached={this.loadMore}
                    refreshControl={
                        <RefreshControl
                            tintColor="#28cc54"
                            title="Loading..."
                            titleColor="#00ff00"
                            colors={['#28cc54', '#00ff00', '#ff0000']}
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh}
                        />
                    }
                />

                <NotificationDetails
                    show={this.state.currentNotification != null}
                    onRequestClose={this.closeDetails}
                    notification={this.state.currentNotification} />
            </View>
        )
    }

    renderItem = ({ item }) => {
        return (<NotificationItem
            account={this.props.account}
            notification={item}
            onPress={this.onPress}
        />
        );
    }

    renderFooter = () => {
        return (<View style={styles.footer}>
            {
                // this.props.notification.total <= this.props.notification.offset &&
                this.state.loadingMore ? <ActivityIndicator /> : <Text> {__('Đã load hết thông báo')} </Text>
            }
        </View>
        )
    }
}

export default connect(NotificationPage, state => ({
    account: state.account,
    notification: state.notification,
    activity: state.activity
}), actions);


const styles = StyleSheet.create({
    page: {
        flex: 1
    },
    headerText: {
        color: 'red',
        textAlign: 'center',
        padding: 20
    },
    listView: {
        //backgroundColor: 'red'
    },
    footer: {
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
});