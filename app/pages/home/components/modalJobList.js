import moment from 'moment';
import React, { Component } from 'react';
import { Platform, StyleSheet, View, FlatList, RefreshControl, Text } from 'react-native';
import { Icon } from 'native-base';
import { connect } from '../../../lib/connect';
import * as actions from '../../../actions/job';
import Loading from '../../controls/loading';
// import DatePicker from '../../controls/datepicker';
import Toolbar from '../../controls/toolbars';
import Menu, { MenuModalContext } from '../../controls/action-menu';
// import RsTouchableNativeFeedback from '../../controls/touchable-native-feedback';

import JobListItem from './../../job/jobPartListItem';

class JobTimeline extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            refreshing: false,
            date: moment(props.date),
            ready: false
        }
    }

    componentDidMount() {
        this.setState({ ready: true });
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        if (newProps.date) {
            this.setState({ date: moment(newProps.date) });
        }
        else {
            this.setState({ date: moment() });
        }
    }

    componentDidUpdate() {
        if (this.state.date.diff(this.props.job.from, 'months') == -1 && !this.state.loading) {
            this.getList(this.props.job.page + 1);
        }
    }

    getList = (page = 1) => {
        this.setState({ loading: true });
        this.props.actions.getList()
            .then(() => {
                this.setState({
                    loading: false,
                    refreshing: false
                });
            })
            .catch(({ error, message }) => {
                this.setState({
                    loading: false,
                    refreshing: false
                });

            })
    }


    previous = () => {
        this.setState({
            date: this.state.date.add(-1, 'days')
        });
    }

    next = () => {
        this.setState({
            date: this.state.date.add(1, 'days')
        });
    }

    today = () => {
        this.setState({
            date: moment()
        });
    }


    render() {
        let data = [];
        let length = 0;

        if (this.state.ready) {
            data = this.props.job.items
                .filter(item =>
                    this.state.date.isBetween(item.startDate, item.deadline, 'day', '[]')
                )

            length = data.length;
        }

        return (
            <MenuModalContext onRequestClose={this.props.onRequestClose}>
                <View style={styles.page}>
                    <Toolbar
                        icon={<Icon type='MaterialIcons' style={{ fontSize: 22, color: '#fff' }} name='arrow-back' size={22} />}
                        onIconPress={this.props.onRequestClose}
                        titleText='Công việc'
                    ></Toolbar>

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
                        ListHeaderComponent={this.renderHeader(length)}
                        renderItem={this.renderItem}
                    />
                    {
                        // this.state.loading && !this.props.loading && !this.state.refreshing &&
                        // <Loading />
                    }
                </View>
            </MenuModalContext>
        );
    }

    renderItem = ({ item }) => {
        return (
            <JobListItem job={item} showBox={this.props.showBox} hideActionButton />
        );
    }

    renderHeader = (length) => {
        if (this.state.date.diff(this.props.job.from, 'months') < -1) {
            return (
                <View style={styles.header}>
                    <Text style={styles.headerText}>
                        Ngày vừa chọn nằm ngoài khoảng thời gian công việc hiện tại
                        (từ {moment(this.props.job.from).format('DD/MM/YYYY')} đến {moment(this.props.job.to || new Date).format('DD/MM/YYYY')})~
                        Vui lòng sử dụng bộ lọc để điều chỉnh khoảng thời gian hiển thị.
                    </Text>
                </View>
            )
        }
        else if (length == 0) {
            return (
                <View style={styles.header}>
                    <Text style={styles.headerText}>{this.state.loading ? 'Đang tải..' : 'Không có công việc trong ngày này'}</Text>
                </View>
            )
        }
    }
}


export default connect(JobTimeline, state => ({
    job: state.job,
}), { ...actions });


const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: '#fff'
    },
    toolbar: {
        flexDirection: 'row',
        padding: 6,
        backgroundColor: '#eee'
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
    textbox: {
        height: 35,
    },
    footer: {
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
    }
});
