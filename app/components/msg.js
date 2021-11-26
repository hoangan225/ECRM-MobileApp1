import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'native-base';

class emailerror extends Component {
    render() {

        const { msg } = this.props
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
export default emailerror;