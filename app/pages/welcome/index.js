import React, { Component } from 'react';
import { StyleSheet, Image, View, Text, ActivityIndicator, StatusBar } from 'react-native';

var logo = require('../../assets/images/logo.png');

const styles = StyleSheet.create({
    page: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    logo: {
        width: 300,
        height: 130,
        marginBottom: 40
    },
    text: {
        color: '#28cc54',
        marginTop: 50
    }
});

class SplashPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.page}>
                <StatusBar backgroundColor='#3a993d' barStyle='light-content' />
                <Image source={logo} style={styles.logo} resizeMode="cover" />
                <ActivityIndicator size="large" color="#2196F3" />
                {
                    this.props.connecting &&
                    <Text style={styles.text}>
                        Connecting..{[...Array(this.props.reConnectCount)].map(() => ".")}
                    </Text>
                }
            </View>
        );
    }
}

export {
    SplashPage
} 