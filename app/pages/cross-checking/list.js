import moment from 'moment';
import React, { Component } from 'react';
import { Modal, StyleSheet, View, Text, ScrollView } from 'react-native';
import { Icon, Button } from 'native-base';
import Toolbar from '../controls/toolbars';

import { connect } from '../../lib/connect';
import * as actions from '../../actions/kopo/cross-checking';

import Edit from './edit';

class List extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            refreshing: false
        }
    }

    onRequestClose = () => {
        this.props.onRequestClose();
    }

    edit = (item) => {
        this.setState({ currentItem: item })
    }

    render() {
        const { view, date, time } = this.props.filter || {};
        if (!view) return null;

        const data = this.props.crossChecking[view].data;
        var items = [];

        if (view == 'week') {
            let group = data.find(item => item.time == time);
            if (group) {
                let dateData = group.items.find(item => item.date == date);
                items = dateData.items;
            }
        }
        else if (view == 'month') {
            let group = data.find(item => item.date == date);
            if (group) {
                items = group.items;
            }
        }

        let today = moment();

        return (
            <Modal
                supportedOrientations={['portrait', 'landscape']}
                keyboardShouldPersistTaps='always'
                onRequestClose={this.onRequestClose}>
                <Toolbar
                    style={{ backgroundColor: '#FF7601' }}
                    icon={<Icon type='MaterialIcons' style={{ fontSize: 22, color: '#fff' }} name='arrow-back' />}
                    onIconPress={this.onRequestClose}
                    titleText='Danh sách sử dụng mã giảm giá'
                />
                <ScrollView
                    contentContainerStyle={{ paddingBottom: 10, flexGrow: 1 }}>
                    <View style={styles.page}>
                        {
                            date && (
                                <View style={styles.filter}>
                                    {
                                        time ?
                                            <Text style={styles.filterText}>{time} giờ ngày {date}</Text> :
                                            <Text style={styles.filterText}>Ngày {date}</Text>
                                    }
                                </View>
                            )
                        }
                        {
                            items.length == 0 && <Text style={styles.emptyText}>Không có mã giảm giá được sử dụng trong thời gian này</Text>
                        }

                        {
                            items.map(item => (
                                <View key={item.id} style={styles.item}>
                                    <View style={styles.row}>
                                        <Text style={[styles.text, styles.textBold]} numberOfLines={1}>{item.user.fullName}</Text>
                                        <Text style={[styles.text, styles.textBold]} numberOfLines={1}>{item.user.phone}</Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={[styles.text, styles.time]} numberOfLines={1}>Coupon: {item.code}</Text>
                                        <Text style={[styles.text, styles.number]} numberOfLines={1}>
                                            Số người: {item.numberOfPerson || 0}/{item.numberOfPersonFromUser || 0}
                                            {
                                                today.diff(item.useDate, 'days') == 0 && (
                                                    <Text onPress={() => this.edit(item)} style={styles.link}> (thay đổi)</Text>
                                                )
                                            }
                                        </Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={[styles.text, styles.voucher]} numberOfLines={1}>{item.voucher.title}</Text>
                                        <Text style={[styles.text, styles.time]} numberOfLines={1}>{moment(item.useDate).format('DD/MM/YYYY HH:mm')}</Text>
                                    </View>
                                </View>
                            ))
                        }
                    </View>
                </ScrollView>

                <Edit
                    item={this.state.currentItem}
                    key={this.state.currentItem}
                    onRequestClose={() => this.setState({ currentItem: null })} />
            </Modal>
        )
    }
}

export default connect(List, state => ({
    crossChecking: state.crossChecking,
}), actions);


const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: '#f9f9f9'
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
        backgroundColor: '#ffff',
        padding: 10,
        marginTop: 10,
        marginHorizontal: 10,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#ccc'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        flex: 1
    },
    link: {
        color: '#009cf9',
        fontStyle: 'italic'
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
