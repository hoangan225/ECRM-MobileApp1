import React, { Component } from 'react';
import moment from 'moment';
import { StyleSheet, Dimensions, View, Text, ScrollView } from 'react-native';
import RsTouchableNativeFeedback from './touchable-native-feedback';

class Calendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: moment().startOf('month'),
            today: moment().startOf('day'),
            width: 0,
            height: 0
        }

        this.data = [];
    }

    componentDidMount() {
        this.parseData(this.props);
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        this.parseData(newProps);
    }

    parseData(props) {
        if (props.events) {
            let date = moment.isMoment(props.date) ? props.date : moment(props.date);

            this.data = props.events
                .map(item => ({
                    ...item,
                    days: moment(item.end).diff(item.start, 'days')
                })).sort((item1, item2) => item2.days - item1.days);

            this.setState({ date: date.startOf('month') });
        }
    }

    getEvents = (date, rowIndex, cellIndex, cellWidth, cellHeight) => {
        const events = this.data.filter(item => date.isBetween(item.start, item.end, 'day', '[]'));
        const day = date.day();
        const eventHeight = cellHeight / 6;
        const offsetTop = rowIndex * cellHeight + 30 + eventHeight;
        const offsetLeft = cellIndex * cellWidth + 6;

        const result = events.map((item, index) => {
            let same = date.isSame(item.start, 'date');
            if (same || day == 1) {
                let start = same ? moment(item.start) : date;
                let nextsun = start.clone().day(7);
                let days = Math.min(Math.abs(start.diff(item.end, 'days')), Math.abs(start.diff(nextsun, 'days'))) + 1;

                return {
                    ...item,
                    event: true,
                    days: days,
                    top: offsetTop + index * eventHeight,
                    left: offsetLeft,
                    width: days * cellWidth - 8,
                    height: eventHeight - 2,
                    index: index
                }
            }
            return {
                event: false
            }

        });

        if (result.length > 5) {
            let more = {
                event: false,
                more: true,
                top: offsetTop + 4 * eventHeight,
                left: offsetLeft
            }
            return [...result.splice(0, 4), more];
        }
        else {
            result.sort((item1, item2) => item1.event ? 1 : -1);
            return result.map((item, index) => ({
                ...item,
                index: index,
                top: offsetTop + index * eventHeight
            }));
        }
    }

    onLayout = (event) => {
        this.setState({
            width: event.nativeEvent.layout.width,
            height: Math.max(30 + 6 * 80, event.nativeEvent.layout.height)
        });
    }

    onPress = (date) => {
        if (this.props.onSelectDate) {
            this.props.onSelectDate(date.toDate());
        }
    }

    render() {

        return (
            <View style={styles.calendar} onLayout={this.onLayout}>
                <ScrollView style={{ flex: 1 }}>
                    <View style={{ minHeight: this.state.height }}>
                        {
                            this.state.width > 0 &&
                            this.renderMonth(this.state.date)
                        }
                    </View>
                </ScrollView>
            </View>

        )
    }

    renderMonth(date) {
        const start = date.day() == 0 ? date.clone().day(-7) : date.clone().day(0);
        const rows = [1, 2, 3, 4, 5, 6];
        const cells = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
        const cellWidth = this.state.width / 7;
        const cellHeight = (this.state.height - 30) / 6;
        const cellData = [];

        rows.forEach((row, rowIndex) => {
            cells.forEach((cell, cellIndex) => {
                let cellDate = start.add(1, 'days').clone();
                let inMonth = cellDate.isSame(date, 'month');
                let today = cellDate.isSame(this.state.today, 'date');

                cellData[rowIndex * 7 + cellIndex] = {
                    date: cellDate,
                    inMonth: inMonth,
                    today: today,
                    events: this.getEvents(cellDate, rowIndex, cellIndex, cellWidth, cellHeight)
                }
            })
        })

        return (
            <View style={styles.month}>
                <View style={styles.events}>
                    {
                        cellData.map(data => {
                            return data.events.map((event, index) => {
                                let { width, height, top, left } = event;
                                if (event.event) {
                                    return (
                                        <View style={[styles.event, { width, height, top, left, backgroundColor: event.color }]} key={index}>
                                            <Text
                                                style={[styles.eventText, event.canceled && styles.cancel]}
                                                numberOfLines={1}>
                                                {event.text}
                                            </Text>
                                        </View>
                                    )
                                }
                                if (event.more) {
                                    return (
                                        <View style={[styles.event, { top, left }]} key={index}>
                                            <Text style={styles.eventMore}>...</Text>
                                        </View>
                                    )
                                }
                            })
                        })
                    }
                </View>
                <View style={styles.grid}>
                    <View style={styles.header}>
                        {
                            cells.map(cell => {
                                return (
                                    <View style={styles.headerCell} key={cell}>
                                        <Text style={styles.headerText}>{cell}</Text>
                                    </View>
                                )
                            })
                        }
                    </View>
                    {
                        rows.map((row, rowIndex) => (
                            <View style={styles.row} key={row}>
                                {
                                    cells.map((cell, cellIndex) => {
                                        let { date, inMonth, today } = cellData[rowIndex * 7 + cellIndex];
                                        return (
                                            <RsTouchableNativeFeedback onPress={() => this.onPress(date)} key={row + cell} style={{ flex: 1 }}>
                                                <View style={[styles.cell, inMonth && styles.cellInMonth]}>
                                                    <Text style={[styles.cellText, inMonth && styles.cellTextInMonth, today && styles.cellTextToday]}>
                                                        {date.date()}
                                                    </Text>
                                                </View>
                                            </RsTouchableNativeFeedback>
                                        )
                                    })
                                }
                            </View>
                        ))
                    }
                </View>
            </View>
        )
    }
}

export default Calendar;


const styles = StyleSheet.create({
    calendar: {
        flex: 1,
    },
    month: {
        flex: 1,
    },
    events: {
        flex: 1,
    },
    grid: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    },
    row: {
        flex: 1,
        flexDirection: 'row',
    },
    cell: {
        flex: 2,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#ccc',
    },
    cellInMonth: {
    },
    header: {
        flexDirection: 'row',
    },
    headerCell: {
        flex: 1,
        height: 30,
        justifyContent: 'center',
        padding: 4
    },
    headerText: {
        color: '#222'
    },
    cellText: {
        color: '#999',
        fontSize: 12,
        lineHeight: 12,
        paddingLeft: 6
    },
    cellTextInMonth: {
        color: '#222'
    },
    cellTextToday: {
        color: 'blue',
    },
    event: {
        position: 'absolute',
        justifyContent: 'center',
        margin: 1,
        overflow: 'hidden',
        borderRadius: 2
    },
    eventText: {
        fontSize: 9,
        lineHeight: 10,
        color: '#fff',
        paddingLeft: 3,
    },
    eventMore: {
        lineHeight: 10,
        fontWeight: 'bold'
    },
    cancel: {
        textDecorationLine: 'line-through'
    }
});
