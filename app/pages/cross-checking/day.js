import moment from 'moment';
import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, RefreshControl, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';
import RsTouchableNativeFeedback from '../controls/touchable-native-feedback';
import chroma from 'chroma-js';

import { connect } from '../../lib/connect';
import * as actions from '../../actions/kopo/cross-checking';
import Loading from '../controls/loading';

import Edit from './edit';

class Week extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            refreshing: false
        }
    }

    componentDidMount() {
        this.today();

        this.timer = setInterval(this.silentReload, 30000);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    silentReload = () => {
        const { from, to } = this.state;
        if (from && to) {
            this.getData(from, to, true);
        }
    }

    refresh = () => {
        this.setState({ refreshing: true });
        this.silentReload();
    }

    getData = (from, to, silent) => {
        this.setState({ loading: !silent })
        this.props.actions.getList('day', { fromDate: from.toISOString(), toDate: to.toISOString() })
            .then(() => {
                this.setState({
                    loading: false,
                    refreshing: false,
                    from,
                    to
                });
            })
            .catch(e => {
                this.setState({ loading: false, refreshing: false })
                // console.log(e);
            });
    }

    previous = () => {
        const from = this.state.from.clone().add(-1, 'days');
        const to = from.clone().endOf('day');
        this.getData(from, to);
    }

    next = () => {
        const from = this.state.from.clone().add(1, 'days');
        const to = from.clone().endOf('day');
        this.getData(from, to);
    }

    today = () => {
        const from = moment().startOf('day');
        const to = from.clone().endOf('day');
        this.getData(from, to);
    }

    edit = (item) => {
        this.setState({ currentItem: item })
    }

    render() {
        const dayData = this.props.crossChecking.day || {};
        const items = dayData.items;

        if (!items) return null;

        const okList = items.filter(item => item.numberOfPerson == item.numberOfPersonFromUser);
        const notOkList = items.filter(item => item.numberOfPerson != item.numberOfPersonFromUser);

        let today = moment();

        return (
            <View style={{ flex: 1 }}>
                <View style={styles.toolbar}>
                    <RsTouchableNativeFeedback onPress={this.previous}>
                        <View style={styles.iconWrap}>
                            <Icon type='MaterialIcons' name='chevron-left' style={{ fontSize: 20, color: '#111' }} />
                        </View>
                    </RsTouchableNativeFeedback>
                    <View style={styles.date}>
                        {
                            this.state.from ? (
                                <Text>{this.state.from.format('DD/MM/YYYY')}</Text>
                            ) : (
                                <Text>Loading..</Text>
                            )
                        }
                    </View>
                    <RsTouchableNativeFeedback onPress={this.next}>
                        <View style={styles.iconWrap}>
                            <Icon type='MaterialIcons' name='chevron-right' style={{ fontSize: 20, color: '#111' }} />
                        </View>
                    </RsTouchableNativeFeedback>
                    <RsTouchableNativeFeedback onPress={this.today}>
                        <View style={styles.iconWrap}>
                            <Icon type='MaterialIcons' name='today' style={{ fontSize: 20, color: '#111' }} />
                        </View>
                    </RsTouchableNativeFeedback>
                </View>
                <ScrollView style={styles.page}
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 10 }}
                    refreshControl={
                        <RefreshControl
                            tintColor="#28cc54"
                            title="Loading..."
                            titleColor="#00ff00"
                            colors={['#28cc54', '#00ff00', '#ff0000']}
                            refreshing={this.state.refreshing}
                            onRefresh={this.refresh}
                        />
                    }>
                    <View style={styles.page}>
                        {
                            items.length == 0 && <Text style={styles.emptyText}>Không có mã giảm giá được sử dụng trong ngày này</Text>
                        }

                        {
                            notOkList.length > 0 && <Text style={styles.listLabel}>Danh sách không khớp</Text>
                        }
                        {
                            notOkList.map(item => (
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

                        {
                            okList.length > 0 && <Text style={styles.listLabel}>Danh sách đã khớp</Text>
                        }
                        {
                            okList.map(item => (
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
                {this.state.loading && <Loading />}

                <Edit
                    item={this.state.currentItem}
                    key={this.state.currentItem}
                    onRequestClose={() => this.setState({ currentItem: null })} />
            </View>
        );
    }
}

export default connect(Week, state => ({
    crossChecking: state.crossChecking,
}), actions);


const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: '#f9f9f9'
    },
    toolbar: {
        flexDirection: 'row',
        padding: 6,
        backgroundColor: '#eee',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc'
    },
    iconWrap: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#cccc',
        backgroundColor: '#fff',
        padding: 8,
        margin: 1
    },
    date: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 10,
        color: 'red'
    },
    listLabel: {
        textTransform: 'uppercase',
        marginHorizontal: 10,
        marginTop: 15,
        color: '#aaa',
        fontWeight: '500'
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
