import { types } from '../actions/kopo/cross-checking';
import moment from 'moment';

const initState = {
    view: 'day',
    day: {
        items: [],
        from: null,
        to: null,
        data: null,
        maxNumber: 0
    },
    week: {
        items: [],
        from: null,
        to: null,
        data: {},
        maxNumber: 0
    },
    month: {
        items: [],
        from: null,
        to: null,
        data: {},
        maxNumber: 0
    }
};

export default (state = initState, action) => {
    let index;
    switch (action.type) {
        case types.GET_LIST_SUCCESS:
            let data = action.meta == 'week' ?
                parseWeekData(action.data.items, action.params.fromDate) :
                action.meta == 'month' ?
                    parseMonthData(action.data.items) : {};
            return {
                ...state,
                view: action.meta,
                [action.meta]: {
                    from: action.params.fromDate,
                    to: action.params.toDate,
                    items: action.data.items,
                    total: action.data.total,
                    ...data
                }
            }
        case types.UPDATE_SUCCESS:
            index = state.week.items.findIndex(item => item.id == action.params.id);
            index = state.day.items.findIndex(item => item.id == action.params.id);
            if (index >= 0) {
                state.day.items[index].numberOfPerson = action.params.numberOfPerson;
            }
            if (index >= 0) {
                state.week.items[index].numberOfPerson = action.params.numberOfPerson;
                state.week = {
                    ...state.week,
                    ...parseWeekData(state.week.items, state.week.from)
                }
            }
            index = state.month.items.findIndex(item => item.id == action.params.id);
            if (index >= 0) {
                state.month.items[index].numberOfPerson = action.params.numberOfPerson;
                state.month = {
                    ...state.month,
                    ...parseMonthData(state.month.items)
                }
            }

            return {
                ...state
            }
        default:
            return state;
    }
}

const parseWeekData = (list, from) => {
    from = moment(from);

    var items = list.map(item => ({
        ...item,
        date: moment(item.useDate).format('DD/MM/YYYY'),
        time: moment(item.useDate).hour()
    }));

    var times = items.map(item => item.useTime).distinct();
    var minTime = Math.min(times.min() || 7, 7);
    var maxTime = Math.max(times.max() || 22, 22);

    var checkingData = [];
    var maxNumber = 0;

    for (let time = minTime; time <= maxTime; time++) {
        let rowData = [];
        for (let day = 0; day < 7; day++) {
            let date = from.clone().add(day, 'days').format('DD/MM/YYYY');
            let list = items.filter(item => item.date == date && item.time == time);
            let numberOfPerson = list.sum(item => item.numberOfPerson)
            let numberOfPersonFromUser = list.sum(item => item.numberOfPersonFromUser)
            rowData.push({
                numberOfPerson,
                numberOfPersonFromUser,
                items: list,
                date: date,
                time: time
            })

            if (maxNumber < numberOfPerson) maxNumber = numberOfPerson;
        }
        checkingData.push({
            time: time,
            items: rowData
        });
    }

    return {
        data: checkingData,
        maxNumber
    }
}

const parseMonthData = items => {

    var checkingData = items
        .map(item => ({
            ...item,
            date: moment(item.useDate).format('DD/MM/YYYY')
        }))
        .groupBy(item => item.date).map(g => ({
            items: g.items,
            date: g.key,
            numberOfPerson: g.items.sum(item => item.numberOfPerson),
            numberOfPersonFromUser: g.items.sum(item => item.numberOfPersonFromUser)
        }));

    var maxNumber = checkingData.max(item => item.numberOfPerson);

    return {
        data: checkingData,
        maxNumber
    }
}