export const types = {
    GET_LIST: 'MESSAGE_GET_LIST',
    SEND_TOKEN: 'MESSAGE_SEND_TOKEN',
    REMOVE_TOKEN: 'MESSAGE_REMOVE_TOKEN',
    ON_MESSAGE: 'MESSAGE_ON_MESSAGE',
    GET_NEW_COUNT: 'MESSAGE_GET_NEW_COUNT',
    MARK_ALL_AS_RECEVIED_SUCCESS: 'MESSAGE_MARK_ALL_AS_RECEVIED_SUCCESS',
    MARK_AS_READ_SUCCESS: 'MESSAGE_MARK_AS_READ_SUCCESS',
    MARK_ALL_AS_READ_SUCCESS: 'MESSAGE_MARK_ALL_AS_READ_SUCCESS',
    CLEAR_NOTIFICATION: 'NOTIFICATION_CLEAR_NOTIFICATION'
}

export const getList = (offset = 0) => {
    return {
        url: '/api/notifications',
        params: {
            offset
        },
        method: 'get',
        types: {
            success: types.GET_LIST,
        }
    };
};

export const getNewCount = () => {
    return {
        url: '/api/notifications/newcount',
        method: 'get',
        types: {
            success: types.GET_NEW_COUNT,
        }
    };
};

export const sendToken = (token, data) => {
    return {
        url: '/api/notifications/token',
        method: 'post',
        params: {
            token,
            ...data
        },
        types: {
            success: types.SEND_TOKEN,
        }
    }
}

export const removeToken = (token) => {
    return {
        url: '/api/notifications/token',
        params: {
            token
        },
        method: 'delete',
        types: {
            success: types.REMOVE_TOKEN,
        }
    }
}

export const onMessage = (msg) => {
    return {
        type: types.ON_MESSAGE,
        message: msg
    }
}

export const markAllAsReceived = () => {
    return {
        url: '/api/notifications/mark/received/all',
        method: 'post',
        types: {
            success: types.MARK_ALL_AS_RECEVIED_SUCCESS,
        }
    }
}

export const markAsRead = (id, format) => {
    return {
        url: '/api/notifications/mark/read/' + id,
        method: 'post',
        meta: id,
        params: format,
        types: {
            success: types.MARK_AS_READ_SUCCESS,
        }
    }
}

export const closeNotification = () => {
    return {
        type: types.CLEAR_NOTIFICATION
    }
}

export const markAllAsRead = () => {
    return {
        url: '/api/notifications/mark/read/all',
        method: 'post',
        types: {
            success: types.MARK_ALL_AS_READ_SUCCESS,
        }
    }
}