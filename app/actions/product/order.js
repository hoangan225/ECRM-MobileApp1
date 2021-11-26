export const types = {
    GET_LIST_SUCCESS: 'ORDER_GET_LIST_SUCCESS',
    UPDATE_SUCCESS: 'ORDER_UPDATE_SUCESS',
    REMEMBER_STATUS_ORDER: 'ORDER_REMEMBER_STATUS_ORDER'
}


export const getList = (filter) => {
    return {
        url: '/api/orders',
        params: {
            ...filter
        },
        types: {
            success: types.GET_LIST_SUCCESS,
        }
    };
};

export const confirmReturn = (id, data) => {
    return {
        url: '/api/orders/' + id + '/confirm-return',
        params: data,
        method: 'post',
        types: {
            success: types.UPDATE_SUCCESS,
        }
    };
};

export const update = (data) => {
    return {
        url: '/api/orders/' + data.id,
        method: 'put',
        params: {
            ...data
        },
        types: {
            success: types.UPDATE_SUCCESS,
        }
    };
};

export const rememberStatusOrder = (status) => {
    return {
        type: types.REMEMBER_STATUS_ORDER,
        status: status
    }
}