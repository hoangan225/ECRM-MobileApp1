import { types } from '../../actions/facebookMessage/autoMessage';
import moment from 'moment';
const initState = {
    options: null,
    template: [],
    messageAuto: null,
    posts: null
};
export default (state = initState, action) => {
    let index = -1;
    switch (action.type) {
        case types.GET_MESSAGE_AUTO:
            state.messageAuto = action.data;
            return {
                ...state,
            }
        case types.ADD_MESSAGE_AUTO:
            if (state.messageAuto) {
                state.messageAuto.items = [action.data, ...state.messageAuto.items];
            } else {
                state.messageAuto = action.data;
            }
            return {
                ...state,
            }
        case types.DELETE_MESSAGE_AUTO:
            state.messageAuto.items = state.messageAuto.items.filter((item) => item.id !== action.data.id);
            return {
                ...state,
            }
        case types.EDIT_MESSAGE_AUTO:
            if (state.messageAuto) {
                index = state.messageAuto.items.findIndex(item => item.id == action.data.id);
                if (index >= 0) {
                    state.messageAuto.items[index] = action.data;
                }
            }
            return {
                ...state,
            }
        case types.GET_LIST_POST_SUCCESS:
            state.posts = action.data;
            return {
                ...state,
            }
        default:
            return state;
    }
}