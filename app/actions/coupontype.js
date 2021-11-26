export const types = {
    GET_LIST_SUCCESS: 'COUPONTYPE_GET_LIST_SUCCESS',
    CREATE_SUCCESS: 'COUPONTYPE_CREATE_SUCCESS',
    UPDATE_SUCCESS: 'COUPONTYPE_UPDATE_SUCESS',
    DELETE_SUCCESS: 'COUPONTYPE_DELETE_SUCCESS',
    COUNT_SUCCESS: 'COUPONTYPE_COUNT_SUCCESS',
    GET_BRANDS_SUCCESS: 'SMS_GET_BRANDS_SUCCESS',
    GET_OPERATORS_SUCCESS: 'SMS_GET_OPERATORS_SUCCESS',
    GET_SUMARY_SUCCESS: 'SMS_GET_SUMARY_SUCCESS'
}

export const getList = (filter) => {
    // console.log('getList: ', filter)
    return {
        url: '/api/couponTypes',
        params: {
            ...filter
        },
        types: {
            success: types.GET_LIST_SUCCESS,
        }
    };
};

export const search = (filter) => {
    return {
        url: '/api/couponTypes/search',
        params: {
            ...filter
        },

    };
};

export const create = (data) => {
    return {
        url: '/api/couponTypes',
        method: 'post',
        params: {
            ...data
        },
        types: {
            success: types.CREATE_SUCCESS,
        }
    };
};

export const update = (data) => {
    return {
        url: '/api/couponTypes/' + data.id,
        method: 'put',
        params: {
            ...data
        },
        types: {
            success: types.UPDATE_SUCCESS,
        }
    };
};

export const remove = (data) => {
    return {
        url: '/api/couponTypes/' + data.id,
        method: 'delete',
        meta: {
            id: data.id,
            type: data.type
        },
        types: {
            success: types.DELETE_SUCCESS,
        }
    };
};

export const count = (id) => {
    return {
        url: '/api/couponTypes/count/' + id,
        method: 'get',
        meta: id,
        types: {
            success: types.COUNT_SUCCESS,
        }
    };
};

export const getSmsList = (id, type, page = 1, pagesize = 20) => {
    return {
        url: '/api/couponTypes/' + id + '/smses',
        params: {
            type,
            page,
            pagesize
        },
        method: 'get'
    };
};

export const resend = (id) => {
    return {
        url: '/api/couponTypes/resend/' + id,
        method: 'post'
    };
};


export const getBrandnames = () => {
    return {
        url: '/api/sms/brandnames',
        method: 'get',
        types: {
            success: types.GET_BRANDS_SUCCESS,
        }
    };
};


export const registerBrandname = (data) => {
    return {
        url: '/api/sms/brandnames',
        params: data,
        method: 'post'
    };
};

export const getOperators = () => {
    return {
        url: '/api/sms/operators',
        method: 'get',
        types: {
            success: types.GET_OPERATORS_SUCCESS,
        }
    };
};

export const getSumary = () => {
    return {
        url: '/api/sms/sumary',
        method: 'get',
        types: {
            success: types.GET_SUMARY_SUCCESS,
        }
    };
};