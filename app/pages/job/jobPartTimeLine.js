import moment, { isDate } from 'moment';
import React, { Component } from 'react';
import { Platform, StyleSheet, View, FlatList, RefreshControl, Text } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
import { Icon } from 'native-base';
import { connect } from '../../lib/connect';
import * as actions from '../../actions/job';
import Loading from '../controls/loading';
import DatePicker from '../controls/datepicker';
import RsTouchableNativeFeedback from '../controls/touchable-native-feedback';

import JobListItem from './jobPartListItem';

class JobTimeline extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            refreshing: false,
            date: moment(),
            ready: false
        }
    }


    // componentDidUpdate() {
    //     // var isdate = this.state.date.isBetween(dateFrom, dateTo, 'day', '[]');
    //     if (this.state.date.diff(this.props.job.from) < 0) {
    //         let dateFrom = moment(this.state.date).startOf('month').toISOString();
    //         let dateTo = moment(this.props.job.from).subtract(1, 'days').endOf('day').toISOString();
    //         // console.log(dateFrom, dateTo);
    //         this.setState({ loading: true });
    //         this.props.actions.getList({ from: dateFrom, to: dateTo }).then(() => {
    //             this.setState({ loading: false });
    //         })
    //             .catch((e) => {
    //                 // console.log(e);
    //                 this.setState({ loading: false });
    //             })
    //     }
    // }

    componentDidMount() {
        this.setState({ ready: true });
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        if (newProps.date) {
            this.setState({ date: moment(newProps.date) });
        }
    }

    previous = () => {
        this.changeDate(this.state.date.add(-1, 'days'))
    }

    next = () => {
        this.changeDate(this.state.date.add(1, 'days'))
    }

    today = () => {
        this.changeDate(moment())
    }

    changeDate = date => {
        this.setState({ date });

        if (date.diff(this.props.job.from) < 0) {
            let dateFrom = moment(date).startOf('month').toISOString();
            let dateTo = moment(this.props.job.from).subtract(1, 'days').endOf('day').toISOString();
            // // console.log(dateFrom, dateTo);
            this.setState({ loading: true });
            this.props.actions.getList({ from: dateFrom, to: dateTo }).then(() => {
                this.setState({ loading: false });
            })
                .catch((e) => {
                    // console.log(e);
                    this.setState({ loading: false });
                })
        }
    }


    render() {
        let data = [];
        let length = 0;
        // // console.log(this.props.job.from, '----');

        if (this.state.ready) {
            // const filter = this.props.job.filter;

            data = this.props.job.items && this.props.job.items
                .filter(item =>
                    this.state.date.isBetween(item.startDate, item.deadline, 'day', '[]') ||
                    this.state.date.isBetween(item.deadline, item.startDate, 'day', '[]')
                )

            length = data && data.length;
        }

        return (
            <View style={styles.page}>
                <View style={styles.toolbar}>
                    <RsTouchableNativeFeedback onPress={this.previous}>
                        <View style={styles.iconWrap}>
                            <Icon type='MaterialIcons' name='chevron-left' style={{ fontSize: 20, color: '#111' }} />
                        </View>
                    </RsTouchableNativeFeedback>
                    <View style={styles.date}>
                        <DatePicker
                            style={styles.textbox}
                            date={this.state.date}
                            customInputStyle={{ alignItems: 'center' }}
                            onDateChange={(date) => this.changeDate(moment(date))}
                        />
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
                    this.state.loading &&
                    <Loading />
                }
            </View>
        );
    }

    renderItem = ({ item }) => {
        return (
            <JobListItem job={item} showBox={this.props.showBox} />
        );
    }

    renderHeader = (length) => {
        // if (this.state.date.diff(this.props.job.from, 'months') < -1) {
        //     // console.log(this.state.date.diff(this.props.job.from, 'months'));
        //     return (
        //         <View style={styles.header}>
        //             <Text style={styles.headerText}>
        //                 Ng??y v???a ch???n n???m ngo??i kho???ng th???i gian c??ng vi???c hi???n t???i
        //                 (t??? {moment(this.props.job.from).format('DD/MM/YYYY')} ?????n {moment(this.props.job.to || new Date).format('DD/MM/YYYY')})~
        //                 Vui l??ng s??? d???ng b??? l???c ????? ??i???u ch???nh kho???ng th???i gian hi???n th???.
        //             </Text>
        //         </View>
        //     )
        // }
        // else 
        if (length == 0) {
            return (
                <View style={styles.header}>
                    <Text style={styles.headerText}>{this.state.loading ? '??ang t???i..' : 'Kh??ng c?? c??ng vi???c trong ng??y n??y'}</Text>
                </View>
            )
        }
    }
}


export default connect(JobTimeline, state => ({
    job: state.job,
    // jobStatus: state.jobstatus,
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
