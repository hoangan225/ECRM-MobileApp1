import { types } from '../actions/customercategory';

const initState = {
    items: [],
    loaded: false,
};

export default function user(state = initState, action) {
    let index;
    switch (action.type) {
        case types.GET_LIST_SUCCESS:
            return {
                ...state,
                items: action.params.page == 1 ? action.data.items : [...state.items, ...action.data.items],
                page: action.params.page,
                total: action.data.total,
                loaded: true,
            }
        case types.CREATE_SUCCESS:
            return {
                ...state,
                items: [...state.items, action.data]
            };
        case types.UPDATE_SUCCESS:
            index = state.items.findIndex(item => item.id == action.data.id);
            if (index >= 0) {
                state.items[index] = action.data;
            }
            return {
                ...state
            };
        case types.DELETE_SUCCESS:
            state.items = state.items.filter(item => item.id != action.meta);
            return {
                ...state
            };
        default:
            return state;
    }
}