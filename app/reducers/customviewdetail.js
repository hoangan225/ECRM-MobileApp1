import { types } from '../actions/customviewdetail';

const initialState = {
    items: [],
    loaded: false,
};

export default (state = initialState, action) => {
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
                loaded: true,
            }
        case types.CREATE_SUCCESS:
            return {
                ...state,
                items: [...state.items.items, action.data]
            };
        case types.UPDATE_SUCCESS:
            // console.log('action:', action.data, state.items)
            index = state.items.items.findIndex(item => item.id == action.data.id);
            if (index >= 0) {
                state.items.items[index] = action.data;
            }
            return {
                ...state
            };
        case types.DELETE_SUCCESS:
            state.items.items = state.items.items.filter(item => item.id != action.meta);
            return {
                ...state
            };
        default:
            return state;
    }
}