import moment from 'moment';
import React, { Component } from 'react';
import { StyleSheet, View, FlatList, Text, RefreshControl, ActivityIndicator } from 'react-native';
import { Icon, Button } from 'native-base';

import { connect } from '../../lib/connect';
import * as actions from '../../actions/kopo/booking';
import Loading from '../controls/loading';

class List extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            loadingMore: false,
            refreshing: false,
            filter: {
                status: (props.status == 'search' || props.status == 'complete') ? null : props.status,
                completed: props.status == 'complete' ? true : null,
                page: 1,
                pagesize: 10
            }
        }
    }

    componentDidMount() {
        const status = this.props.status;
        const data = this.props.booking[status] || {};
        if (data.items && data.items.length > 0) {
            this.silentReload();
        }
        else {
            this.getData();
        }

        this.timer = setInterval(this.silentReload, 30000);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    silentReload = () => {
        this.getData({ page: 1 }, null)
    }

    refresh = () => {
        this.getData({ page: 1 }, 'refreshing')
    }

    getData = (filter, loading = 'loading') => {
        filter = { ...this.state.filter, ...filter };
        this.setState({ [loading]: true, filter })

        this.props.actions.getList(filter)
            .catch(e => {
                e.status != 502 && alert(e.message)
                // console.log('load booking error', e);
                return 0;
            })
            .then(() => {
                this.setState({
                    loading: false,
                    loadingMore: false,
                    refreshing: false
                });
            })
    }

    loadMore = () => {
        const status = this.props.status;
        const data = this.props.booking[status] || {};

        if (data.total > data.items.length) {
            this.getData({ page: this.state.filter.page + 1 }, 'loadingMore');
        }
    };

    render() {
        const status = this.props.status;
        const data = this.props.booking[status] || {};
        const items = data.items;

        if (!items) return null;

        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    contentContainerStyle={styles.flatList}
                    data={items}
                    keyExtractor={item => item.id}
                    renderItem={this.renderItem}
                    refreshControl={
                        <RefreshControl
                            tintColor="#28cc54"
                            title="Loading..."
                            titleColor="#00ff00"
                            colors={['#28cc54', '#00ff00', '#ff0000']}
                            refreshing={this.state.refreshing}
                            onRefresh={this.refresh}
                        />
                    }
                    ListFooterComponent={this.renderFooter(items)}
                    onEndReached={this.loadMore}
                />
                {this.state.loading && <Loading />}
            </View>
        );
    }

    renderItem = ({ item }) => {
        const { call, reject, accept, bookingEvent, status } = this.props.status;
        return (
            <ListItem item={item} {...{ call, reject, accept, bookingEvent, status }} />
        )
    }

    renderFooter = (items) => {
        const status = this.props.status;
        if (this.state.loadingMore) {
            return <ActivityIndicator style={{ margin: 15 }} />
        }
        if (items.length == 0) {
            return <Text style={styles.emptyText}>{this.getEmptyText(status)}</Text>
        }
        return null;
    }

    getEmptyText = status => {
        switch (status) {
            case 'active': return 'Chưa có đặt chỗ nào mới';
            case 'accept': return 'Chưa có đặt chỗ nào được tiếp nhận';
            case 'reject': return 'Không có đặt chỗ nào bị từ chối';
            case 'cancel': return 'Không có đặt chỗ nào bị hủy';
            case 'expiry': return 'Không có đặt chỗ nào quá hạn';
        }
        return "Không có đặt chỗ phù hợp điều kiện tìm kiếm";
    }
}

export default connect(List, state => ({
    booking: state.booking,
    bookingEvent: state.app.enums.bookingEvent
}), actions);


class ListItem extends React.PureComponent {
    render() {
        const { item, status, call, reject, accept, bookingEvent } = this.props;
        return (
            <View key={item.id} style={styles.item}>
                <View style={styles.row}>
                    <Text style={[styles.text, styles.textBold]} numberOfLines={1}>{item.coupon.user.fullName}</Text>
                    <Text style={[styles.text, styles.textBold]} numberOfLines={1} >
                        <Text style={styles.link} onPress={() => call(item.coupon.user.phone)}>{item.coupon.user.phone}</Text>
                    </Text>
                </View>
                <View style={styles.row}>
                    <Text style={[styles.text, styles.time]} numberOfLines={1}>
                        {moment(item.bookingTime).format('DD/MM/YYYY HH:mm')}
                    </Text>
                    <Text style={[styles.text, styles.number]} numberOfLines={1}>
                        Số người: {item.numberOfPerson || 0}
                        {item.event > 0 && <Text style={{ fontStyle: 'italic' }}> ({getEnumLabel(item.event, bookingEvent)})</Text>}
                    </Text>
                </View>
                {
                    status == 'active' && (
                        <View style={styles.row}>
                            <Button small style={[styles.btn, styles.btnCancel]} onPress={() => reject(item)}><Text style={[styles.btnText, { color: '#333' }]}>TỪ CHỐI</Text></Button>
                            <Button small style={styles.btn} onPress={() => accept(item)} ><Text style={styles.btnText}>TIẾP NHẬN</Text></Button>
                        </View>
                    )
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    flatList: {
        flexGrow: 1,
        backgroundColor: '#f9f9f9',
        paddingBottom: 10
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
        flex: 1,
        textAlign: 'center'
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
        borderRadius: 20,
        marginTop: 10,
        marginHorizontal: 10,
        paddingHorizontal: 15,
        flex: 1,
    },
    btnCancel: {
        backgroundColor: '#fff',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#ccc'
    },
    btnText: {
        color: '#fff',
        textAlign: 'center',
        flex: 1,
    }
});
