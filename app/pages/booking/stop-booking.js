import moment from 'moment';
import React, { Component } from 'react';
import { Modal, StyleSheet, View, Text, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { Icon, Button, ListItem, Radio, Right, Left } from 'native-base';
import Toolbar from '../controls/toolbars';
import Select from '../controls/select';

import { connect } from '../../lib/connect';
import * as actions from '../../actions/kopo/business';

class StopBooking extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            hours: 0.5,
            hoursInput: null
        }
    }

    onRequestClose = () => {
        this.props.onRequestClose();
    }

    submit = () => {
        let hours = this.state.hours || this.state.hoursInput;
        if (hours) {
            this.setState({ loading: true });
            this.props.actions.patch({ disabledUntil: moment().add(parseFloat(hours), 'hours').toISOString() })
                .then(() => {
                    this.setState({ loading: false });
                    this.onRequestClose();
                })
                .catch(e => {
                    this.setState({ loading: false });
                    e.status != 502 && alert(e.message)
                })
        }
        else {
            alert('Vui lòng nhập hoặc chọn thời gian tạm dừng');
        }
    }

    render() {
        const list = [
            { value: 0.5, label: '30 phút' },
            { value: 1, label: '1 giờ' },
            { value: 2, label: '2 giờ' },
            { value: 3, label: '3 giờ' },
            { value: 4, label: '4 giờ' }
        ]
        return (
            <Modal
                supportedOrientations={['portrait', 'landscape']}
                keyboardShouldPersistTaps='always'
                onRequestClose={this.onRequestClose}>
                <Toolbar
                    style={{ backgroundColor: '#fff' }}
                    icon={<Icon type='MaterialIcons' style={{ fontSize: 22, color: '#333' }} name='close' />}
                    onIconPress={this.onRequestClose}
                    title={<Text style={styles.textBold}>Tạm dừng đặt chỗ</Text>}
                />
                <ScrollView
                    contentContainerStyle={styles.page}
                    keyboardShouldPersistTaps='always'>
                    {
                        list.map(item => (
                            <ListItem
                                key={item.value}
                                selected={item.value == this.state.hours}
                                onPress={() => this.setState({ hours: item.value, hoursInput: null })}
                                style={styles.listItem}>
                                <Left>
                                    <Text>{item.label}</Text>
                                </Left>
                                <Right>
                                    <Radio
                                        color={"#f0ad4e"}
                                        selectedColor={"#5cb85c"}
                                        selected={item.value == this.state.hours}
                                    />
                                </Right>
                            </ListItem>
                        ))
                    }

                    <TextInput
                        style={styles.textbox}
                        underlineColorAndroid='transparent'
                        placeholder="Tùy chọn (giờ)"
                        value={this.state.hoursInput}
                        keyboardType='number-pad'
                        onChangeText={v => this.setState({ hoursInput: v, hours: null })} />

                </ScrollView>
                <View style={styles.row}>
                    {
                        this.state.loading ? (
                            <ActivityIndicator size={24} style={{ margin: 15 }} />
                        ) : (
                                <Button style={styles.btn} onPress={this.submit}>
                                    <Text style={styles.btnText}>TẠM DỪNG</Text>
                                </Button>
                            )
                    }

                </View>
            </Modal>
        )
    }
}

export default connect(StopBooking, null, actions);

const styles = StyleSheet.create({
    page: {
        backgroundColor: '#f9f9f9',
        flexGrow: 1
    },
    listItem: {
        marginLeft: 0,
        paddingLeft: 15
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#ccc'
    },
    textbox: {
        height: 40,
        paddingHorizontal: 10,
        margin: 15,
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
        marginVertical: 20,
        paddingHorizontal: 20,
    },
    btnText: {
        color: '#fff'
    }
});
