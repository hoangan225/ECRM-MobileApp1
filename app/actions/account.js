import { AsyncStorage } from 'react-native';

export const types = {
    LOGOUT: 'ACCOUNT_LOGOUT',
    LOGIN: 'ACCOUNT_LOGIN',
    RESET_DATA: 'ACCOUNT_RESET_DATA',
    SET_PROFILE: 'ACCOUNT_SET_PROFILE',
    GET_TOKEN: 'ACCOUNT_GET_TOKEN',
    UPDATE_AVATAR_SUCCESS: 'ACCOUNT_UPDATE_AVATAR_SUCCESS',
    UPDATE_PROFILE_SUCCESS: 'ACCOUNT_UPDATE_PROFILE_SUCCESS',
    CHANGE_PASSWORD_SUCCESS: 'ACCOUNT_CHANGE_PASSWORD_SUCCESS',
    CHOOSE_IMAGE: 'ACCOUNT_CHOOSE_IMAGE'
}

export const getImg = (reason) => {
    return {
        type: types.CHOOSE_IMAGE,
        reason
    }
}

export const getProfile = () => {
    return {
        url: '/api/account',
        method: 'get',
        types: {
            success: types.SET_PROFILE
        }
    };
};

export const login = (domain, username, password) => {
    // // console.log('loginactioon', domain, username, password);

    return {
        url: '/token',
        method: 'post',
        host: domain,
        params: {
            username,
            password,
            mobile: true
        },
        meta: {
            domain
        },
        types: {
            success: types.LOGIN,
        }
    }
}

export const getToken = () => {
    return function (dispatch) {
        AsyncStorage.getItem('access_token').then(token => {
            AsyncStorage.getItem('host').then(host => {
                dispatch({
                    type: types.GET_TOKEN,
                    token,
                    host
                })
            })
        })
    }
}

export const logout = (reason) => {
    return {
        type: types.LOGOUT,
        reason
    }
}

export const reset = (reason) => {
    return {
        type: types.RESET_DATA,
        reason
    }
}

export const updateAvatar = (id, url) => {
    return {
        url: '/api/account/avatar/' + id,
        method: 'post',
        params: {
            url
        },
        types: {
            success: types.UPDATE_AVATAR_SUCCESS
        }
    };
};


export const updateProfile = (data) => {
    return {
        url: '/api/account',
        method: 'put',
        params: {
            ...data
        },
        types: {
            success: types.SET_PROFILE,
            error: types.SET_PROFILE_ERROR
        }
    }
}

export const changePassword = (data) => {
    return {
        url: '/api/account/password',
        method: 'post',
        params: {
            ...data
        },
        types: {
            type: types.LOGOUT
        }
    }
}

export const resetPassword = (email, code, newPassword) => {
    return {
        url: '/api/account/resetPassword',
        method: 'post',
        params: {
            email,
            code,
            newPassword
        }
    }
}

export const changeMetas = (data) => {
    return {
        url: '/api/account/metas/' + data.id,
        method: 'put',
        params: {
            ...data
        },
        types: {
            success: types.SET_PROFILE,
            error: types.SET_PROFILE_ERROR
        }
    };
};