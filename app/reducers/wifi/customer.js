import { types } from '../../actions/wifi/customer';

const initState = {
    items: [],
    total: 0,
    loaded: false,
};

export default (state = initState, action) => {
    let index;
    switch (action.type) {
        case types.GET_LIST_SUCCESS:
            return {
                ...state,
                items: action.data.items,
                total: action.data.total,
                loaded: true,
            }
        case types.CREATE_SUCCESS:
            return {
                ...state,
                items: [...state.items, action.data],
                total: state.total + 1,
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
                ...state,
                total: state.total - 1,
            };
        default:
            return state;
    }
}