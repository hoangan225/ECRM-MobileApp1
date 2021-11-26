import React, { Component } from 'react';
import { StyleSheet } from 'react-native';

import { Container, Header, Content, Spinner, View, Thumbnail } from 'native-base';

const logo = require('../../assets/images/logo.png');

export default class Loading extends Component {
    render() {
        return (
            <Container>
                <View style={styles.container}>
                    <View>
                        <Thumbnail style={styles.thumbnail} square source={logo} resizeMode="contain" />
                        <Spinner />
                    </View>
                </View>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginLeft: 10,
        marginRight: 10,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    thumbnail: {
        width: 300,
        height: 150
    }
});
