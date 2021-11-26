import moment from 'moment';
import React, { PureComponent } from 'react';
import { Platform, StyleSheet, View, FlatList, RefreshControl, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';
import * as actions from '../../../actions/job';
import { connect } from '../../../lib/connect';
import Loading from '../../controls/loading';

import JobListItem from '../../job/jobPartListItem';
import JobBox from '../../job/jobPartBox';

class JobList extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            refreshing: false,
            loadingMore: false,
            currentJob: null
        }
    }

    componentDidMount() {
        this.props.actions.getList()
            .catch(() => 1)
            .then(() => {
                // console.log('success');

            });
    }

    addJob = () => { this.setState({ createJob: {} }) }

    render() {
        var dataProps = this.props.entry;
        if (dataProps) {
            var customerIds = [dataProps.id];
        }
        Array.prototype.contains = function (obj) {
            var i = this.length;
            while (i--) {
                if (this[i].id === obj.id) {
                    return true;
                }
            }
            return false;
        }
        var ob = {
            id: this.props.entry.id
        }
        var d = this.props.job.items.filter(tem => (tem.customers.contains(ob) ? tem : null))

        const data = d;
        if (data.length == 0) {
            return (
                <View>
                    <Text style={styles.msg}>{__('Chưa có công việc.')}</Text>
                    <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity onPress={this.addJob}><Icon type='MaterialIcons' name="add" style={{ fontSize: 38 }} /></TouchableOpacity>
                    </View>
                    <JobBox
                        customerIds={customerIds}
                        entry={this.props.entry}
                        show={this.state.createJob != null}
                        onRequestClose={() => this.setState({ createJob: null })}
                        box='create' />
                </View>
            )
        }

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
                            refreshing={this.props.refreshing}
                            onRefresh={this.props.onRefresh}
                        />
                    }
                    data={data}
                    keyExtractor={item => 'ID' + item.id}
                    renderItem={this.renderItem}
                />

                <JobBox
                    entry={this.state.currentJob}
                    show={this.state.currentJob != null}
                    onRequestClose={() => this.setState({ currentJob: null })}
                    box='details' />
            </View>
        );
    }

    renderItem = ({ item }) => {
        return (
            <JobListItem
                job={item}
                showBox={entry => this.setState({ currentJob: entry })}
                hideActionButton={true} />
        );
    }
}

export default connect(JobList, state => ({
    job: state.job,
}), {
    ...actions,
});


const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: '#fff'
    },
    listView: {
        flex: 1,
    },
    dateRow: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: '#f2f2f2'
    },
    msg: {
        padding: 15,
        color: 'red',
        textAlign: 'center'
    }
});
