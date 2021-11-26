import { types } from '../actions/account';
import { REHYDRATE, PURGE } from 'redux-persist';
import { AsyncStorage } from 'react-native';
import translator from '../lib/translator';

const accountInitState = {
    getImg: false,
    user: null,
    token: null,
    host: null,
    loaded: false, // đánh dấu lấy token từ storage ra chưa
    loggedIn: false, // đánh dấu đã login hay chưa
    logoutMessage: null // thông báo khi logout
};

export default (state = accountInitState, action) => {
    switch (action.type) {
        case REHYDRATE:
            return {
                ...state,
                logoutMessage: null
            }
        case types.CHOOSE_IMAGE:
            return {
                ...state,
                getImg: action.reason
            }
        case types.LOGIN:
            // // console.log('login', action.data);
            // // console.log(' action.params', action.params);
            // // console.log(' action.meta', action.meta);

            AsyncStorage.setItem('access_token', action.data.access_token);
            AsyncStorage.setItem('host', action.meta.domain);


            return {
                ...state,
                host: action.meta.domain,
                token: action.data.access_token,
                loggedIn: true,
            };
        case types.GET_TOKEN:
            return {
                ...state,
                loaded: true,
                token: action.token,
                host: action.host
            };
        case types.SET_PROFILE:
            action.data.metas = JSON.parse(action.data.metas) || {};
            translator.setLocale(action.data.metas.locale);
            return {
                ...state,
                user: action.data,
                loggedIn: true,
            }
        case types.LOGOUT:
            AsyncStorage.removeItem('access_token');
            AsyncStorage.removeItem('host');
            return {
                ...state,
                token: null,
                loggedIn: false
            }
        default:
            return state;
    }
}