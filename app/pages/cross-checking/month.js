import moment from 'moment';
import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, View, ScrollView, Text, RefreshControl } from 'react-native';
import { Icon } from 'native-base';
import RsTouchableNativeFeedback from '../controls/touchable-native-feedback';
import chroma from 'chroma-js';

import { connect } from '../../lib/connect';
import * as actions from '../../actions/kopo/cross-checking';
import Loading from '../controls/loading';

const columns = [
    { label: 'T2', name: 't2' },
    { label: 'T3', name: 't3' },
    { label: 'T4', name: 't4' },
    { label: 'T5', name: 't5' },
    { label: 'T6', name: 't6' },
    { label: 'T7', name: 't7' },
    { label: 'CN', name: 'cn' },
]

const scale = chroma.scale(['#f2d391', '#d30404']);

class Month extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            refreshing: false,
            data: [],
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
        this.props.actions.getList('month', { fromDate: from.toISOString(), toDate: to.toISOString() })
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
        const from = this.state.from.clone().add(-1, 'month');
        const to = from.clone().endOf('month');
        this.getData(from, to);
    }

    next = () => {
        const from = this.state.from.clone().add(1, 'month');
        const to = from.clone().endOf('month');
        this.getData(from, to);
    }

    today = () => {
        const from = moment().startOf('month');
        const to = from.clone().endOf('month');
        this.getData(from, to);
    }

    render() {
        const { from, to } = this.state;
        const monthData = this.props.crossChecking.month || {};
        const data = monthData.data || [];
        const today = moment();
        var dates = [];

        if (from && to) {
            const month = from.month();
            const start = from.clone().isoWeekday(1);
            const end = to.clone().isoWeekday(7);
            const days = end.diff(start, 'days') + 1;

            dates = Array(days).fill(0).map((v, i) => {
                let date = start.clone().add(i, 'days');
                return {
                    date: date.format('DD/MM/YYYY'),
                    day: date.date(),
                    outside: date.month() != month,
                    today: today.isSame(date, 'day')
                }
            }).chunk(7);
        }


        return (
            <ScrollView style={styles.page}
                contentContainerStyle={{ flexGrow: 1 }}
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
                <View style={styles.toolbar}>
                    <RsTouchableNativeFeedback onPress={this.previous}>
                        <View style={styles.iconWrap}>
                            <Icon type='MaterialIcons' name='chevron-left' style={{ fontSize: 20, color: '#111' }} />
                        </View>
                    </RsTouchableNativeFeedback>
                    <View style={styles.date}>
                        {
                            this.state.from && this.state.to ? (
                                <Text>{this.state.from.format('DD/MM/YYYY')} - {this.state.to.format('DD/MM/YYYY')}</Text>
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

                <View style={styles.table}>
                    <View style={[styles.row, styles.header]}>
                        {
                            columns.map(item => (
                                <View style={styles.cell} key={item.name}>
                                    <Text style={styles.headerText}>{item.label}</Text>
                                </View>
                            ))
                        }
                    </View>
                    {
                        dates.map((group, index) => (
                            <View style={styles.row} key={index}>
                                {
                                    group.map(({ date, day, outside, today }) => {
                                        let item = data.find(item => item.date == date);
                                        let { backgroundColor, color } = this.getColors(item ? item.numberOfPerson : 0);
                                        return item ? (
                                            <View style={[styles.cell, { backgroundColor }]} key={index + day}>
                                                <TouchableOpacity onPress={() => this.props.viewList('month', date)} style={{ flex: 1 }}>
                                                    <Text style={[styles.dayText, { color }, today && styles.today]}>{day}</Text>
                                                    <Text style={[styles.cellText, { color }]}>
                                                        {
                                                            item.numberOfPerson == item.numberOfPersonFromUser ?
                                                                (item.numberOfPerson == 0 ? "" : item.numberOfPerson) :
                                                                (item.numberOfPerson + '/' + item.numberOfPersonFromUser)
                                                        }
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        ) : (
                                            <View style={styles.cell} key={index + day}>
                                                <TouchableOpacity
                                                    onPress={() => this.props.viewList('month', date)}
                                                    disabled={outside}
                                                    style={{ flex: 1 }}>
                                                    <Text style={[styles.dayText, today && styles.today, outside && styles.textHidden]}>{day}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    })
                                }
                            </View>
                        ))
                    }
                </View>

                {this.state.loading && <Loading />}

            </ScrollView>
        );
    }
    getColors = (number) => {
        if (!number) {
            return {
                backgroundColor: '#fff',
                color: '#666'
            }
        }
        const monthData = this.props.crossChecking.month || {};
        const max = monthData.maxNumber || 30;
        let delta = 0;
        if (number > max) {
            delta = 1;
        }
        else {
            delta = number / max;
        }
        var bgColor = scale(delta).hex();
        var textColor = chroma.distance('#fff', bgColor, 'rgb') < 128 ? '#000' : '#fff';

        return {
            backgroundColor: bgColor,
            color: textColor
        }
    }
}

export default connect(Month, state => ({
    crossChecking: state.crossChecking,
}), actions);


const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: '#eee'
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
    table: {
        flexGrow: 1,
        backgroundColor: '#fff',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#cccc',
    },
    header: {
        flex: 0
    },
    row: {
        flexDirection: 'row',
        flex: 1
    },
    cell: {
        flex: 1,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#ccc',
        padding: 2
    },
    today: {
        backgroundColor: 'rgba(0,0,0,.3)',
        color: '#fff'
    },
    cellLabel: {

    },
    labelText: {
        fontWeight: 'bold',
        textAlign: 'center'
    },
    headerText: {
        fontWeight: 'bold',
        textAlign: 'center'
    },
    cellText: {
        textAlign: 'center',
        flex: 1,
        textAlignVertical: 'center'
    },
    dayText: {
        paddingHorizontal: 2,
        paddingVertical: 0
    },
    textHidden: {
        color: '#ccc'
    }
});
