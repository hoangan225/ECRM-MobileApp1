import React, { Component } from 'react';
import { Spinner, View } from 'native-base';
import { StyleSheet, Dimensions, Modal } from "react-native";
import { withNavigation } from 'react-navigation';

const maxHeight = Dimensions.get('window').height;

class LoadingPage extends Component {
    render() {
        const params = this.props.navigation.state.params;
        const backgroundColor = params && params.backgroundColor || '#ffb400';
        return (
            <Modal
                supportedOrientations={['portrait', 'landscape']}
                // onRequestClose={this.props.onRequestClose}
                animationType="fade"
                transparent={true}>
                <View style={[StyleSheet.absoluteFill, { flex: 1, minHeight: maxHeight - 150, maxHeight }]}>
                    <View style={styles.container}>
                        <Spinner style={[styles.viewSpinner, { backgroundColor }]} color='white' />
                    </View>
                </View>
            </Modal>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0)'
    },
    viewSpinner: {
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: '#ffb400',
        borderRadius: 10,
        elevation: 1,
        zIndex: 1
    }
});


export default withNavigation(LoadingPage);