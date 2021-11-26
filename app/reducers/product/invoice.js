import { types } from '../../actions/product/invoice';
const initState = {
    items: [],
    total: 0,
    loaded: false,
    count: []
};

export default function user(state = initState, action) {
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
        case types.GET_DETAILS_SUCCESS:
            index = state.items.findIndex(item => item.id == action.meta);
            if (index >= 0) {
                let details = action.data.map(item => {
                    return {
                        ...item,
                    }
                });
                state.items[index] = {
                    ...state.items[index],
                    details
                }
            }
            return {
                ...state
            }

        default:
            return state;
    }
}