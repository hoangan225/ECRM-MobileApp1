import { types } from '../actions/notification';

const accountInitState = {
    messages: [],
    token: null,
    offset: 0,
    total: 0,
    newCount: 0,
    currentNotification: null,
    canLoadMore: false
};

export default function account(state = accountInitState, action) {

    switch (action.type) {
        case types.GET_NEW_COUNT:
            return {
                ...state,
                newCount: action.data
            }
        case types.GET_LIST:
            return {
                ...state,
                messages: action.params.offset == 0 ? action.data.items : [...state.messages, ...action.data.items],
                total: action.data.total,
                offset: action.data.offset,
                canLoadMore: state.total > state.offset ? true : false
            }
        case types.ON_MESSAGE:
            return {
                ...state,
                messages: [action.message, ...state.messages]
            }
        case types.SEND_TOKEN:
            return {
                ...state,
                token: action.params.token,
            };
        case types.REMOVE_TOKEN:
            return {
                ...state,
                token: null
            }
        case types.MARK_ALL_AS_RECEVIED_SUCCESS:
            state.messages.forEach(item => {
                if (item.status == 'New') {
                    item.status = 'Viewed';
                }
            });
            return {
                ...state,
                newCount: 0
            }
        case types.MARK_AS_READ_SUCCESS:
            let index = state.messages.findIndex(item => item.id == action.meta);
            if (index >= 0) {
                state.messages[index].status = 'Clicked';
            }
            return {
                ...state,
                currentNotification: action.params
            }
        case types.CLEAR_NOTIFICATION:
            return {
                ...state,
                currentNotification: null
            }
        case types.MARK_ALL_AS_READ_SUCCESS:
            state.messages.forEach(item => {
                if (item.status == 'New' || item.status == 'Viewed') {
                    item.status = 'Clicked';
                }
            });
            return {
                ...state,
                newCount: 0
            }
        default:
            return state;
    }
}