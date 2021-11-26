import { types } from '../actions/customfield';

const initState = {
    items: [],
    fields: [],
    loaded: false,
};

export default (state = initState, action) => {
    let index;
    switch (action.type) {
        case types.GET_LIST_START:
            return {
                ...state,
                loaded: true
            }
        case types.GET_LIST_SUCCESS:
            return {
                ...state,
                items: action.data.items,
                fields: action.data.items,
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