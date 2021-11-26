import { types } from '../../actions/voip/call';
import { REHYDRATE, PURGE } from 'redux-persist';

const initState = {
    token: {
        accessToken: null,
        expires: null,
    },
    loaded: false,
    callPhone: null,
};

export default (state = initState, action) => {
    switch (action.type) {
        case REHYDRATE:
            return {
                ...state,
                callPhone: null
            };
        case types.GET_TOKEN_SUCCESS:
            return {
                ...state,
                token: {
                    ...action.data
                },
                loaded: true,
            }
        case types.SET_PHONE_CALL:
            return {
                ...state,
                callPhone: action.meta,
                loaded: true,
            }
        default:
            return state;
    }
}