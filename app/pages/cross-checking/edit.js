import moment from 'moment';
import React, { Component } from 'react';
import { Modal, StyleSheet, View, Text, TextInput, ActivityIndicator } from 'react-native';
import { Icon, Button } from 'native-base';
import Toolbar from '../controls/toolbars';

import { connect } from '../../lib/connect';
import * as actions from '../../actions/kopo/cross-checking';

class EditForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            number: props.item ? (props.item.numberOfPerson + '') : null
        }
    }

    onRequestClose = () => {
        this.props.onRequestClose();
    }

    update = () => {
        const { item } = this.props;
        this.setState({ loading: true })
        this.props.actions.updateNumber(item.id, this.state.number)
            .then(data => {
                this.setState({ loading: false })
                this.onRequestClose();
            })
            .catch(error => {
                this.setState({ loading: false })
                alert(error.message)
            })
    }

    render() {
        const { item } = this.props;

        if (!item) return null;

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
                        title={<Text style={styles.textBold}>Cập nhật số người sử dụng mã</Text>}
                    />
                    <View style={styles.page}>
                        <View key={item.id} style={styles.item}>
                            <Text style={[styles.text, styles.textBold]} numberOfLines={1}>{item.user.fullName} {item.user.phone && ' - '} {item.user.phone}</Text>
                            <Text style={[styles.text, styles.time]} numberOfLines={1}>Coupon: {item.code}</Text>
                            <Text style={[styles.text, styles.voucher]} numberOfLines={1}>{item.voucher.title}</Text>
                            <Text style={[styles.text, styles.time]} numberOfLines={1}>Sử dụng ngày: {moment(item.useDate).format('DD/MM/YYYY HH:mm')}</Text>

                            <TextInput style={styles.textbox}
                                underlineColorAndroid='transparent'
                                placeholder="Nhập số người"
                                value={this.state.number}
                                keyboardType='number-pad'
                                autoFocus
                                onChangeText={v => this.setState({ number: v })} />

                            <View style={styles.row}>
                                {
                                    this.state.loading ? (
                                        <ActivityIndicator size={24} style={{ marginTop: 15 }} />
                                    ) : (
                                            <Button style={styles.btn} onPress={this.update}>
                                                <Text style={styles.btnText}>CẬP NHẬT</Text>
                                            </Button>
                                        )
                                }
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
}

export default connect(EditForm, state => ({
    crossChecking: state.crossChecking,
}), actions);


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
