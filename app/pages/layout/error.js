import React from 'react';
import { View, Text } from 'react-native';

export default class ErrorPage extends React.Component {
    render() {
        if (this.props.message && this.props.message.indexOf('!doctype html') > -1) {
            location = location;
        }
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <View>
                    <Text style={{ color: 'red' }}>{this.props.error}</Text>
                    <Text style={{ color: 'red' }}>{this.props.message}</Text>
                </View>
            </View>
        );
    }
}