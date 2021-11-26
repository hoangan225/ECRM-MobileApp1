import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'native-base';

class messagererror extends Component {
    render() {
        var { msg } = this.props;
        if (msg.length > 1000) {
            msg = 'Internal Server Error';
        }
        return (
            <Text style={styles.msgs}>{__(msg)}</Text>
        );
    }
}

const styles = StyleSheet.create({
    msgs: {
        marginTop: 15,
        color: 'red',
        fontSize: 12
    }
});
export default messagererror;