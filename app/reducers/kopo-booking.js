import { types } from '../actions/kopo/booking';

const defaultData = {
    items: [],
    total: 0
}

const initState = {
    loaded: false,
    active: defaultData,
    accept: defaultData,
    reject: defaultData,
    cancel: defaultData,
    expired: defaultData,
    search: defaultData,
    complete: defaultData,
};

export default (state = initState, action) => {
    let index, status;
    switch (action.type) {
        case types.GET_LIST_SUCCESS:
            status = action.params.status ? action.params.status.toLowerCase() :
                action.params.completed ? 'complete' : 'search';
            return {
                ...state,
                [status]: {
                    items: action.params.page == 1 ? action.data.items : [...state[status].items, ...action.data.items],
                    total: action.data.total,
                },
                loaded: true,
            }

        case types.UPDATE_SUCCESS:
            status = ["", "active", "cancel", "reject", "accept", "expiry"][action.data.status];

            state.active.items = state.active.items.filter(item => item.id != action.data.id);

            state[status].items = [action.data, ...state[status].items]

            index = state.search.items.findIndex(item => item.id == action.data.id);
            if (index >= 0) {
                state.search.items[index] = action.data;
            }

            return {
                ...state
            };
        default:
            return state;
    }
}
