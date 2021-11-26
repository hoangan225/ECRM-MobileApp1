import React, { PureComponent } from 'react';
import { StyleSheet, View, Text, FlatList, RefreshControl } from 'react-native';

import ProcessListItem from './proccessPartListItem';

class ProcessList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            reloadData: false,
        }
    }

    UNSAFE_componentWillReceiveProps(props) {
        if (this.props.data != props.data) {
            this.setState({
                reloadData: true,
            })
        }
    }

    onRefresh = () => {
        this.setState({ refreshing: true });
        this.props.onRefresh(() => {
            this.setState({ refreshing: false });
        });
    }

    render() {

        const { data } = this.props;

        if (!data) return null;

        const count = data.length;
        var msgTotal = data.reduce(function (prev, cur) {
            return prev + (cur.revenue || cur.expectedRevenue || 0);
        }, 0);
        // const price = data.sum("expectedRevenue" || 'revenue')
        const price = msgTotal.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");

        return (
            <View style={styles.container}>
                <FlatList
                    data={data}
                    keyExtractor={item => ('ID' + item.id)}
                    renderItem={this.renderItem}
                    refreshControl={
                        <RefreshControl
                            tintColor="#28cc54"
                            title="Loading..."
                            titleColor="#00ff00"
                            colors={['#28cc54', '#00ff00', '#ff0000']}
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh}
                        />
                    }
                    ListHeaderComponent={
                        data.length == 0 && <Text style={styles.empty}>{this.props.loading ? __('Đang tải..') : __('Không có kết quả tìm kiếm')}</Text>
                    }
                />
                <View style={styles.sumary}>
                    <Text style={styles.sumaryText}>
                        <Text style={styles.weight}>{this.props.percent}</Text>{__(' %')}
                    </Text>
                    {
                        !this.props.hidePrice && (
                            <Text style={[styles.sumaryText, { flex: 2 }]}>
                                <Text style={styles.weight}>{price.toLocaleString()}</Text> {__('VNĐ')}
                            </Text>
                        )
                    }
                    <Text style={styles.sumaryText}>
                        <Text style={styles.weight}>{count}</Text> {__('CƠ HỘI')}
                    </Text>
                </View>
            </View>
        );
    }

    renderItem = ({ item }) => {

        return (
            <ProcessListItem
                hidePrice={this.props.hidePrice}
                entryField={this.props.entryField}
                data={item}
                showBox={this.props.showBox}
            />
        )
    }
}

export default ProcessList;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    sumary: {
        backgroundColor: '#f2f2f2',
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#ccc',
        flexDirection: 'row'
    },
    sumaryText: {
        flex: 1,
        textAlign: 'center'
    },
    weight: {
        fontWeight: 'bold'
    },
    empty: {
        color: 'red',
        textAlign: 'center',
        padding: 10
    }
});
