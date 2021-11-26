import { types } from '../actions/customview';

const initState = {
    items: [],
    loaded: false,
    views: []
};

export default (state = initState, action) => {
    let index;
    switch (action.type) {
        case types.GET_LIST_SUCCESS:

            return {
                ...state,
                items: action.data.items,
                loaded: true,
            }

        case types.CREATE_SUCCESS:
            return {
                ...state,
                items: [...state.items, action.data]
            };
        case types.CREATEDETAIL_SUCCESS:
            // // console.log('action.data', action.data, action.data.items);

            return {
                ...state,
                items: [...state.items, action.data.items],
            };
        case types.UPDATE_SUCCESS:
            index = state.items.findIndex(item => item.id == action.data.id);
            if (index >= 0) {
                state.items[index] = action.data;
            }
            return {
                ...state
            };
        case types.UPDATERANGE_SUCCESS:
            return {
                ...state,
                items: action.data.items,
                loaded: true,
            };
        case types.UPDATE_LISTDETAIL_SUCCESS:
            return {
                ...state,
                items: action.data.items,
                loaded: true,
            };
        case types.UPDATEDETAIL_SUCCESS:
            // console.log('action.dataview', action.data);

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