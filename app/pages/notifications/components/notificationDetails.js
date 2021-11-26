import React, { Component } from 'react';
import { Alert } from 'react-native';
import JobBox from '../../job/jobPartBox';
import CustomerBox from '../../customer/primary/customerPartBox';


class NotificationDetails extends Component {
    constructor(props) {
        super(props);
    }

    onRequestClose = () => {
        this.props.onRequestClose();
    }

    render() {
        const { notification, show } = this.props;
        // console.log('notification---', notification);

        if (!show) return null;

        if (notification.entity == 'job') {
            return <JobBox
                entityId={notification.entityId}
                show={true}
                onRequestClose={this.onRequestClose}
                box='details' />
        }

        if (notification.entity == 'customer') {
            return <CustomerBox
                entityId={notification.entityId}
                show={true}
                onRequestClose={this.onRequestClose}
                box='details' />
        }

        else {
            Alert.alert(
                notification.title,
                notification.message,
                [
                    { text: 'OK', onPress: () => console.log('') }
                ],
                { cancelable: false }
            )
        }

        return null;
    }
}

export default NotificationDetails;