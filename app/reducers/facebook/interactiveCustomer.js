import { types } from '../../actions/facebook/interactiveCustomer';

const initState = {
    items: [],
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
        case types.UPDATE_AVATAR_SUCCESS:
            index = state.items.findIndex(item => item.id == action.data.id);
            if (index >= 0) {
                state.items[index].avatar = action.avatar;
            }
            return {
                ...state
            };
        case types.UPDATE_CUSTOMER_SUCCESS:
            index = state.items.findIndex(item => item.id == action.data.id);
            if (index >= 0) {
                state.items[index].avatar = action.data.avatar;
                state.items[index].fullName = action.data.fullName;
                state.items[index].firstName = action.data.firstName;
                state.items[index].lastName = action.data.lastName;
            }
            return {
                ...state
            };
        default:
            return state;
    }
}