import moment, { isDate } from 'moment';
import React, { Component } from 'react';
import { Platform, StyleSheet, View, RefreshControl, Text } from 'react-native';
import { Icon } from 'native-base';
import DatePicker from '../controls/datepicker';
import Calendar from '../controls/calendar';
import RsTouchableNativeFeedback from '../controls/touchable-native-feedback';

import { connect } from '../../lib/connect';
import * as actions from '../../actions/job';
import Loading from '../controls/loading';

// import JobListItem from './jobPartListItem';

class JobCalendar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            refreshing: false,
            date: moment().startOf('month'),
            ready: false
        }
    }

    componentDidMount() {
        this.setState({ ready: true });
    }

    previous = () => {

        this.changeDate(this.state.date.add(-1, 'months'));
    }

    next = () => {
        this.changeDate(this.state.date.add(1, 'months'));
    }

    today = () => {
        this.changeDate(moment().startOf('month'));
    }

    changeDate = date => {
        // console.log(date.toISOString())
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

    onSelectDate = (date) => {
        this.props.onCalendarSelectDate(date);
    }

    render() {
        const start = this.state.date.clone().day(-7);
        const end = start.clone().add(42, 'days');


        let events = [];

        if (this.state.ready) {
            // const filter = this.props.job.filter;

            events = this.props.job.items && this.props.job.items
                .filter(item =>
                    end.isSameOrAfter(item.startDate) &&
                    start.isSameOrBefore(item.deadline)
                )
                .map(item => ({
                    start: item.startDate,
                    end: item.deadline,
                    text: item.name,
                    color: item.color,
                    // canceled: item.jobStatus.isCancel
                }));

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
                            style={{ height: 35 }}
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
                <Calendar events={events} date={this.state.date} onSelectDate={this.onSelectDate} />
                {this.state.loading && <Loading />}
            </View>
        );
    }

}

export default connect(JobCalendar, state => ({
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
    footer: {
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
    }
});
