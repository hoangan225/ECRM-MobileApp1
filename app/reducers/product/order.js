import { types } from '../../actions/product/order';
import { types as invoiceTypes } from '../../actions/product/invoice';

import moment from 'moment';
const initState = {
    items: [],
    total: 0,
    loaded: false,
    count: [],
    rememberStatus: null,
    rememberStatusHour: null,
    idOrder: null
};

export default function user(state = initState, action) {

    let afterHour = state.rememberStatusHour;
    if (afterHour) {
        let currentHour = moment().format("HH:mm");
        let endHour = moment(afterHour).add(20, 'minute').format("HH:mm");
        if (currentHour == endHour) {
            state.rememberStatus = null;
        }
    }

    let item;
    let index;
    let countIndex;
    switch (action.type) {
        case types.GET_LIST_SUCCESS:
            return {
                ...state,
                items: action.data.items,
                total: action.data.total,
                loaded: true
            }
        case types.UPDATE_SUCCESS:
            index = state.items.findIndex(item => item.id == action.data.id);
            if (index >= 0) {
                item = state.items[index];
                state.items[index] = {
                    ...action.data,
                    invoice: {
                        ...state.items[index].invoice,
                        ...action.data.invoice
                    }
                }
            }
            return {
                ...state,
                idOrder: action.data.id
            };
        case types.REMEMBER_STATUS_ORDER:
            let startHour = moment();
            return {
                ...state,
                rememberStatus: action.status,
                rememberStatusHour: startHour
            }
        case invoiceTypes.GET_DETAILS_SUCCESS:
            index = state.items.findIndex(item => item.invoiceId == action.meta);
            if (index >= 0) {
                let details = action.data.map(item => {
                    let total = item.price * item.quantity;
                    let totalAmount = total - (item.isDiscountPrice ? item.discount : (item.discount * total / 100))
                    return {
                        ...item,
                        weight: item.weight || 100,
                        totalAmount
                    }
                });
                state.items[index] = {
                    ...state.items[index],
                    invoice: {
                        ...state.items[index].invoice,
                        details
                    }
                }
            }
            return {
                ...state
            }
        default:
            return state;
    }
}