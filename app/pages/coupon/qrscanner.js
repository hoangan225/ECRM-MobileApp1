import React from 'react';
import { Dimensions, StyleSheet, Text, View, Modal, Platform } from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Ionicons as Icon } from '@expo/vector-icons';
import MyStatusBar from '../statusBar/MyStatusBar';
import Toolbar from '../controls/toolbars';

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            showInfo: false,
            showCamera: false,
            currentInfo: null,
            hasCameraPermission: null,
        }
    }

    async UNSAFE_componentWillMount() {
        const p2 = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: p2.status === 'granted' });
    }

    handleBarCodeRead = result => {
        this.props.onRequestClose();
        this.props.onScannedSuccess(result.data);
    };

    onCloseCamera = () => {
        this.props.onRequestClose();
    }

    render() {
        if (!this.props.open) return null;

        const { hasCameraPermission, scanned } = this.state;

        if (hasCameraPermission === null) {
            return (
                <View style={styles.page}></View>
            )
        }

        if (hasCameraPermission === false) {
            return (
                <View style={styles.page}>
                    <Text style={{ marginTop: 40, textAlign: 'center' }}>No access to camera</Text>
                    <Button transparent dark block
                        onPress={this.onCloseCamera}
                        style={{ backgroundColor: '#fff', marginTop: 15 }} >
                        <Text style={{ paddingLeft: 10, paddingRight: 10, fontWeight: 'bold' }}>Close</Text>
                    </Button>
                </View>
            )
        }

        return (
            <Modal style={styles.page} onRequestClose={this.props.onRequestClose}>
                <BarCodeScanner
                    onBarCodeScanned={this.handleBarCodeRead}
                    style={[StyleSheet.absoluteFill, styles.container]}
                >
                    <View style={styles.layerTop}>
                        <Toolbar
                            noShadow
                            onIconPress={this.props.onRequestClose}
                            titleText={__('Quét mã giảm giá')}
                            style={styles.toolbar}
                        ></Toolbar>
                    </View>
                    <View style={styles.layerCenter}>
                        <View style={styles.layerLeft} />
                        <View style={styles.focused}>
                            <Icon
                                name="scan-outline"
                                size={300}
                                color='#fff'
                                style={{ fontWeight: 100 }}
                            />
                        </View>
                        <View style={styles.layerRight} />
                    </View>
                    <View style={styles.layerBottom} />
                </BarCodeScanner>
            </Modal>
        );
    }
}

const opacity = 'rgba(0, 0, 0, 0)';

export default App;


const styles = StyleSheet.create({
    page: {
        flex: 1
    },
    container: {
        height: Dimensions.get('window').height
    },
    btnqrcode: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4d904ff2'
    },
    layerTop: {
        flex: 2,
        backgroundColor: opacity
    },
    layerCenter: {
        flex: 2,
        flexDirection: 'row'
    },
    layerLeft: {
        flex: 2,
        backgroundColor: opacity
    },
    focused: {
        flex: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    layerRight: {
        flex: 2,
        backgroundColor: opacity
    },
    layerBottom: {
        flex: 2,
        backgroundColor: opacity
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.9)',
        padding: 15,
        flexDirection: 'row',
    },
    urlText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'right',
        marginTop: 23,
        padding: 20
    },
    btnshowqrcode: {
        borderColor: '#fff',
        borderWidth: 1
    }

});