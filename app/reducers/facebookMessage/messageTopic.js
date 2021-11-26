import { types } from '../../actions/facebookMessage/messageTopic';

const initState = {
    items: [],
    loaded: false,
};
export default (state = initState, action) => {
    let index;
    switch (action.type) {
        case types.GET_LIST_TOPIC_SUCCESS:
            return {
                ...state,
                items: action.data,
                loaded: true,
            }
        case types.CREATE_TOPIC:
            return {
                ...state,
                items: [...state.items, action.data]
            };
        case types.DELETE_SUCCESS:
            state.items = state.items.filter(item => item.id != action.meta);
            return {
                ...state
            };
        case types.UPDATE_SUCCESS:
            index = state.items.findIndex(item => item.id == action.data.id);
            if (index >= 0) {
                state.items[index] = action.data;
            }
        default:
            return state;
    }
}