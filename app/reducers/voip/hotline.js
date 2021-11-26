import { types } from '../../actions/voip/hotline';

const initState = {
    items: [],
    loaded: false,
    token: {
        accessToken:null,
        expires: null,
    },
};

export default (state = initState, action) => {
    let index;
    switch (action.type) {
        case types.GET_LIST_SUCCESS:
            return {
                ...state,
                items: action.data,
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
        case types.LOAD_TOKEN_LOAD_SUCCESS:
            return {
                ...state,
                token: {
                    ...action.data
                },
            }
        default:
            return state;
    }
}