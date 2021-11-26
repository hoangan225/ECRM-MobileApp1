import moment from 'moment';
import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, RefreshControl, TouchableOpacity } from 'react-native';
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

const defaultData = Array(15).fill(0).map((e, i) => ({
    time: i + 7,
    items: Array(7).fill(0).map(() => ({ numberOfPerson: 0, numberOfPersonFromUser: 0 }))
}));

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
        this.props.actions.getList('week', { fromDate: from.toISOString(), toDate: to.toISOString() })
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
        const from = this.state.from.clone().add(-1, 'weeks');
        const to = from.clone().endOf('isoWeek');
        this.getData(from, to);
    }

    next = () => {
        const from = this.state.from.clone().add(1, 'weeks');
        const to = from.clone().endOf('isoWeek');
        this.getData(from, to);
    }

    today = () => {
        const from = moment().startOf('isoWeek');
        const to = from.clone().endOf('isoWeek');
        this.getData(from, to);
    }

    render() {
        const weekData = this.props.crossChecking.week || {};
        const data = weekData.data && weekData.data.length > 0 ? weekData.data : defaultData;

        var total = 0;
        var columnTotals = Array(7).fill(0);

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

                    <View style={styles.table}>
                        <View style={[styles.row, styles.header]}>
                            <View style={[styles.cell, styles.cellLabel]}>
                                <Text style={styles.headerText}>Giờ</Text>
                            </View>

                            {
                                columns.map(item => (
                                    <View style={styles.cell} key={item.name}>
                                        <Text style={styles.headerText}>{item.label}</Text>
                                    </View>
                                ))
                            }
                            <View style={styles.cell}>
                                <Text style={styles.headerText}>Tổng</Text>
                            </View>

                        </View>
                        {
                            data.map(row => {
                                let rowTotal = row.items.sum(item => item.numberOfPerson);
                                total += rowTotal;
                                return (
                                    <View style={styles.row} key={row.time}>
                                        <View style={[styles.cell, styles.cellLabel]}>
                                            <Text style={styles.labelText}>{row.time.toString().padStart(2, '0')}</Text>
                                        </View>
                                        {
                                            row.items.map((item, index) => {
                                                let { backgroundColor, color } = this.getColors(item.numberOfPerson);
                                                columnTotals[index] += item.numberOfPerson;
                                                return (
                                                    <View style={[styles.cell, { backgroundColor }]} key={item.date}>
                                                        <TouchableOpacity onPress={() => this.props.viewList('week', item.date, item.time)}>
                                                            <Text style={[styles.cellText, { color }]}>
                                                                {
                                                                    item.numberOfPerson == item.numberOfPersonFromUser ?
                                                                        (item.numberOfPerson == 0 ? "" : item.numberOfPerson) :
                                                                        (item.numberOfPerson + '/' + item.numberOfPersonFromUser)
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                )
                                            })
                                        }
                                        <View style={[styles.cell]}>
                                            <Text style={[styles.cellText]}>
                                                {rowTotal}
                                            </Text>
                                        </View>
                                    </View>
                                )
                            })
                        }
                        <View style={styles.row}>
                            <View style={[styles.cell, styles.cellLabel]}>
                                <Text style={styles.labelText}>Tổng</Text>
                            </View>
                            {
                                columns.map((item, index) => (
                                    <View style={styles.cell} key={index}>
                                        <Text style={styles.cellText}>{columnTotals[index]}</Text>
                                    </View>
                                ))
                            }
                            <View style={styles.cell}>
                                <Text style={styles.cellText}>{total}</Text>
                            </View>

                        </View>
                    </View>

                    {this.state.loading && <Loading />}

                </ScrollView>
            </View>
        );
    }

    getColors = (number) => {
        if (!number) {
            return {
                backgroundColor: '#fff',
                color: '#666'
            }
        }
        const weekData = this.props.crossChecking.week || {};
        const max = weekData.maxNumber || 30;
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

export default connect(Week, state => ({
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
    table: {
        backgroundColor: '#fff',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#cccc',
        flexGrow: 1
    },
    row: {
        flexDirection: 'row',
        flex: 1
    },
    header: {
        flex: 0
    },
    cell: {
        flex: 1,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#ccc',
        padding: 2
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
        textAlign: 'center'
    }
});
