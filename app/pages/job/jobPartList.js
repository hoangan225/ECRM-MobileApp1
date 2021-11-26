import moment from 'moment';
import React, { Component } from 'react';
import { Platform, StyleSheet, View, FlatList, RefreshControl, Text, ActivityIndicator, ScrollView } from 'react-native';
import { connect } from '../../lib/connect';
import * as actions from '../../actions/job';
import Loading from '../controls/loading';

import JobListItem from './jobPartListItem';

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
            viewId: 5,
            from: moment().startOf('month').subtract(1, 'months').toISOString(),
            to: null,
        }
    }

    componentDidUpdate() {
        this.rowDate = null;
    }

    componentDidMount() {
        this.setState({ ready: true, loading: this.props.job.items.length == 0 });
        this.props.actions.getList({ from: this.state.from, to: null }).then(() => {
            this.setState({ loading: false })
        }).catch(() => {
            this.setState({ loading: false })
        });
    }


    loadMore = () => {
        var { total } = this.props.job;

        if ((this.props.job.items.length < total)) {
            // if (this.props.job.canLoadMore) {
            let dateFrom = moment(this.state.from).subtract(1, 'months').toISOString();
            let dateTo = moment(this.state.from).subtract(1, 'days').endOf('day').toISOString();
            this.setState({
                ...this.state,
                canLoadMore: true,
                from: dateFrom,
                to: dateTo,
            }, () => {
                this.props.actions.getList({ from: dateFrom, to: dateTo })
            })

        } else {
            this.setState({
                canLoadMore: false,
                loading: false,
            })
        }

    };

    onRefresh = () => {
        var newFrom = moment().startOf('month').subtract(1, 'months').toISOString();
        var newTo = null;
        this.setState({ refreshing: true });
        this.props.actions.getList({ from: newFrom, to: newTo, refresh: true })
            .then(() => {
                this.setState({ refreshing: false });
            })
            .catch(({ error, message }) => {
                this.setState({ refreshing: false });

            })
    }

    render() {
        let data = [];
        if (this.state.ready) {
            data = this.props.job.items
        }
        // if (data.length == 0) {
        //     return <View style={{ alignItems: 'center' }}>
        //         <Text style={{ color: 'red', paddingTop: 20 }}>{__('Không có công việc nào')}</Text>
        //     </View>
        // }
        return (
            <View style={styles.page}>
                <FlatList
                    style={styles.listView}
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
                    onEndReached={this.loadMore}
                    ListFooterComponent={this.renderFooter()}
                />
                {
                    this.state.loading && !this.props.loading && !this.state.loadingMore && !this.state.refreshing &&
                    <Loading />
                }
            </View>
        );
    }

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

    renderFooter = () => {
        return (
            <View style={styles.footer}>
                {
                    this.state.canLoadMore &&
                    <ActivityIndicator />
                }
                {
                    !this.state.canLoadMore && (
                        this.props.job.items.length == 0 ?
                            <Text style={styles.headerText}>{'Hiện không có công việc nào'}</Text> :
                            <Text>{'Đã tải hết dữ liệu'}</Text>
                    )
                }
            </View>
        )
    }
}

export default connect(JobList, state => ({
    // jobCount: state.job.items.length,
    job: state.job,
    customer: state.customer,
    user: state.user,
    jobStatus: state.jobstatus,
}), { ...actions });

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: '#fff'
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
