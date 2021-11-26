import moment from 'moment';
import React, { Component } from 'react';
import { Modal, StyleSheet, View, Text, TextInput, ActivityIndicator } from 'react-native';
import { Icon, Button } from 'native-base';
import Toolbar from '../controls/toolbars';

class Reject extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            reason: null
        }
    }

    onRequestClose = () => {
        this.props.onRequestClose();
    }

    reject = () => {
        if (this.state.reason) {
            this.props.onConfirm(this.state.reason);
        }
        else {
            alert('Bạn cần nhập vào lý do hủy đặt bàn.')
        }
    }

    render() {
        return (
            <Modal
                supportedOrientations={['portrait', 'landscape']}
                transparent
                keyboardShouldPersistTaps='always'
                onRequestClose={this.onRequestClose}>
                <View style={styles.container}>
                    <Toolbar
                        style={{ backgroundColor: '#fff' }}
                        icon={<Icon type='MaterialIcons' style={{ fontSize: 22, color: '#333' }} name='close' />}
                        onIconPress={this.onRequestClose}
                        title={<Text style={styles.textBold}>Từ chối đặt bàn</Text>}
                    />
                    <View style={styles.page}>
                        <View style={styles.item}>
                            <Text style={styles.text}>Vui lòng nhập vào lý do từ chối đặt bàn của bạn</Text>

                            <TextInput
                                style={styles.textbox}
                                underlineColorAndroid='transparent'
                                placeholder="Nhập lý do"
                                value={this.state.reason}
                                autoFocus
                                multiline
                                onChangeText={v => this.setState({ reason: v })} />

                            <View style={styles.row}>
                                <Button style={styles.btn} onPress={this.reject}>
                                    <Text style={styles.btnText}>CẬP NHẬT</Text>
                                </Button>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
}

export default Reject;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 50,
        backgroundColor: 'rgba(0,0,0,.5)',
        justifyContent: 'center'
    },
    page: {
        backgroundColor: '#eee'
    },
    filterText: {
        textAlign: 'center',
        marginTop: 10,
        color: '#aaa'
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 10,
        color: 'red'
    },
    item: {
        padding: 10,
        marginTop: 10,
        marginHorizontal: 10
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    textbox: {
        height: 40,
        padding: 4,
        marginTop: 10,
        backgroundColor: '#fff',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#ccc"
    },
    text: {
        marginTop: 5
    },
    textBold: {
        fontWeight: 'bold'
    },
    btn: {
        backgroundColor: '#FF7601',
        borderRadius: 8,
        marginTop: 10,
        paddingHorizontal: 20,
    },
    btnText: {
        color: '#fff'
    }
});
