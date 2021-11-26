import { types } from '../../actions/wifi/location';

const initState = {
    items: [],
    total: 0,
    loaded: false,
};

export default (state = initState, action) => {
    switch (action.type) {
        case types.GET_LIST_SUCCESS:
            return {
                ...state,
                items: action.data.items,
                total: action.data.total,
                loaded: true,
            }
        default:
            return state;
    }
}