import moment from 'moment';
import React, { Component } from 'react';
import { Platform, StyleSheet, View, FlatList, RefreshControl, Text, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { connect } from '../../../lib/connect';
import * as actions from '../../../actions/job';
import Loading from '../../controls/loading';

import JobListItem from './../../job/jobPartListItem';

class JobList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            refreshing: false,
            loadingMore: false,
            ready: false,
            page: 1,
            pagesize: 20,
            enableScrollViewScroll: true,
            from: moment().startOf('month').subtract(1, 'months').toISOString(),
            to: null,
        }
    }

    componentDidUpdate() {
        this.rowDate = null;
    }

    componentDidMount() {
        this.setState({ ready: true, loading: true });
        this.props.actions.getList({ from: this.state.from, to: null }).then(() => {
            this.setState({ loading: false })
        }).catch(() => {
            this.setState({ loading: false })
        });
    }




    onRefresh = () => {
        this.setState({ refreshing: true });
        this.props.actions.getList({ from: this.state.date, to: this.props.job.from })
            .then(() => {
                this.setState({ refreshing: false });
            })
            .catch(({ error, message }) => {
                this.setState({ refreshing: false });

            })
    }
    onEnableScroll = (value) => {
        this.setState({
            enableScrollViewScroll: value,
        });
    };

    render() {
        let data = [];
        let length = 0;

        if (this.state.ready) {
            var today = moment();
            data = this.props.job.items
                .filter(item =>
                    today.isBetween(item.startDate, item.deadline, 'day', '[]')
                )

            length = data.length;
        }
        if (data.length == 0) {
            return <View style={{ alignItems: 'center' }}>
                <Text style={{ color: 'red', padding: 20 }}>{__('Không có công việc trong ngày hôm nay')}</Text>
            </View>
        }
        return (
            <View style={styles.page}>
                <FlatList
                    nestedScrollEnabled={true}
                    // maxHeight={300}

                    // style={styles.listView}
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
                    data={data}
                    keyExtractor={item => 'ID' + item.id}
                    renderItem={this.renderItem}
                    // onEndReached={this.loadMore}
                    // ListHeaderComponent={this.renderHeader(data.length)}
                    ListFooterComponent={this.renderFooter()}
                />
                {
                    // this.state.loading && !this.props.loading && !this.state.loadingMore && !this.state.refreshing &&
                    // <Loading />
                }
            </View>
        );
    }
    renderFooter = () => {
        return (
            <View style={styles.flatlistfooter}>
                {
                    this.state.canLoadMore &&
                    <ActivityIndicator color='green' />
                }
                {
                    (!this.state.canLoadMore && this.props.job.items.length > 0) ?
                        <Text>{__('Đã load hết dữ liệu')}</Text> :
                        <Text style={{ color: 'red' }}>{__('Đang tải..')}</Text>
                }
            </View>
        )
    };

    renderItem = ({ item }) => {
        if (this.rowDate == null || !this.rowDate.isSame(item.startDate, 'day')) {
            this.rowDate = moment(item.startDate);
            return (
                <View>
                    <Text style={styles.dateRow}>{this.rowDate.format('DD/MM/YYYY')}</Text>
                    <JobListItem job={item} showBox={this.props.showBox} />
                </View>
            )
        }
        return (
            <JobListItem job={item} showBox={this.props.showBox} />
        );
    }

    renderHeader = (length) => {
        if (length == 0) {
            return (
                <View style={styles.header}>
                    <Text style={styles.headerText}>{(this.state.loading || this.props.loading) ? 'Đang tải..' : 'Không có dữ liệu'}</Text>
                </View>
            )

        }
    }

    linkTo = () => {
        this.props.linkTo();
    }

    renderFooter = () => {
        return (
            <View style={styles.footer}>
                {
                    this.state.canLoadMore &&
                    <ActivityIndicator />
                }
                {
                    !this.state.canLoadMore &&
                    <TouchableOpacity onPress={this.linkTo}>
                        <Text style={{ color: 'green' }}>Xem tất cả công việc</Text>
                    </TouchableOpacity>
                }
            </View>
        )
    }
}

export default connect(JobList, state => ({
    jobCount: state.job.items.length,
    job: state.job,
    customer: state.customer,
    user: state.user,
    jobStatus: state.jobstatus,
}), { ...actions });

const styles = StyleSheet.create({
    page: {
        flex: 1,
        // height: 280,
        backgroundColor: '#fff',
    },
    listView: {
        flex: 1,
    },
    header: {
        flex: 1
    },
    headerText: {
        color: 'red',
        textAlign: 'center',
        padding: 20
    },
    footer: {
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dateRow: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: '#f2f2f2'
    }
});
