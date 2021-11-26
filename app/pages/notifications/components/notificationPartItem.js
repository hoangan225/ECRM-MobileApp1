import moment from 'moment';
import React, { PureComponent } from 'react';
import { Platform, Linking, StyleSheet, View, Text, Image, Dimensions, TouchableOpacity } from 'react-native';
import striptags from 'striptags';
import { Icon } from 'native-base';
import RsTouchableNativeFeedback from '../../controls/touchable-native-feedback';
import Avatar from '../../controls/avatar';

class NotificationItem extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            hiddenRowActive: false
        }
    }

    onPress = () => {
        this.props.onPress(this.props.notification);
    }

    render() {
        const { notification, account } = this.props;

        return (
            <RsTouchableNativeFeedback
                onPress={this.onPress}
            >
                <View style={[styles.notification]}>
                    <Avatar id={Number(notification.id)} url={notification.avatar} name={notification.title} />
                    <View style={styles.notificationInfo}>
                        <Text style={styles.notificationText}>
                            <Text style={styles.notificationTitle}>
                                {notification.title + " "}
                            </Text>
                            <Text style={styles.notificationContent}>
                                {striptags(notification.content)}
                            </Text>
                        </Text>
                        <View style={styles.notificationTime}>
                            <Icon type='MaterialIcons' name="access-time" size={14} style={styles.notificationTimeIcon} />
                            <Text>{moment(notification.date).fromNow()}</Text>
                        </View>
                    </View>
                </View>
            </RsTouchableNativeFeedback>
        )
    }
}

export default NotificationItem;


const styles = StyleSheet.create({
    notification: {
        flexDirection: 'row',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#eee',
        paddingVertical: 5,
        backgroundColor: '#E4E9F2'
    },
    notificationViewed: {
        backgroundColor: '#E4E9F2'
    },
    notificationClicked: {
        backgroundColor: '#fff'
    },
    notificationIcon: {
        position: 'relative',
        opacity: 0.8,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 50,
        margin: 10,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#ccc'
    },
    notificationIconText: {
        width: 50,
        height: 50,
        borderRadius: 50,
        margin: 10,
        color: '#fff',
        fontSize: 30,
        textAlign: 'center',
        paddingTop: 4,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#ccc'
    },
    notificationInfo: {
        flex: 1,
        paddingRight: 10,
        paddingTop: 4
    },
    notificationText: {
        fontSize: 14,
        color: '#222',
        paddingTop: 10,
    },
    notificationTitle: {
        fontWeight: 'bold'
    },
    notificationTime: {
        marginTop: 5,
        flexDirection: 'row'
    },
    notificationTimeIcon: {
        marginTop: 3,
        marginRight: 5,
        fontSize: 14
    },
    hiddenRow: {
        flex: 1
    },
    hiddenRowActive: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        flex: 1,
    },
    hiddenText: {
        flex: 1,
    },
    hiddenAction: {
    }
});
