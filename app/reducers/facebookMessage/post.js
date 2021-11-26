
import { types } from '../../actions/facebookMessage/post';

const initState = {
    posts: null,
    getphone: null,
    getcomment: null,
    actPost: { background: '#d9d9d9' },
    actPhone: null,
    actComment: null,
    subComment: { display: 'none' },
    subComment1: { display: 'none' },

}


const listPhone = [];

export default (state = initState, action) => {
    let index;
    switch (action.type) {
        case types.GET_LIST_POST_SUCCESS:
            return {
                ...state,
                posts: action.data,
            }
        case types.GET_COMMENT:
            return {
                ...state,
                getcomment: action.data
            }
        case types.GET_PHONE:
            return {
                ...state,
                getphone: action.data
            }
        default:
            return state;
    }
}
