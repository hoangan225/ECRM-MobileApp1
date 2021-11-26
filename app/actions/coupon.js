export const types = {
    GET_LIST_SUCCESS: 'COUPON_GET_LIST_SUCCESS',
    CREATE_SUCCESS: 'COUPON_CREATE_SUCCESS',
    UPDATE_SUCCESS: 'COUPON_UPDATE_SUCESS',
    DELETE_SUCCESS: 'COUPON_DELETE_SUCCESS',
    COUNT_SUCCESS: 'COUPON_COUNT_SUCCESS',
    GET_BRANDS_SUCCESS: 'SMS_GET_BRANDS_SUCCESS',
    GET_OPERATORS_SUCCESS: 'SMS_GET_OPERATORS_SUCCESS',
    GET_SUMARY_SUCCESS: 'SMS_GET_SUMARY_SUCCESS'
}

export const getList = (filter) => {
    // console.log('getList: ', filter)
    return {
        url: '/api/coupons',
        params: {
            ...filter
        },
        types: {
            success: types.GET_LIST_SUCCESS,
        }
    };
};


export const searchCode = (code) => {
    return {
        url: '/api/coupons/searchCode',
        params: {
            ...code
        },
    };
};

export const getCouponByCustomer = (customerId) => {
    return {
        url: '/api/coupons/getCouponByCustomer/' + customerId
    };
}

export const create = (data) => {
    return {
        url: '/api/coupons',
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
        url: '/api/coupons/' + data.id,
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
        url: '/api/coupons/' + data.id,
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

export const exchange = (data) => {
    return {
        url: '/api/coupons/exchange/' + data.id,
        method: 'post',
        params: {
            ...data
        },
        types: {
            success: types.UPDATE_SUCCESS,
        }
    };
};

export const getReportColums = (filter) => {
    // console.log('getList: ', filter)
    return {
        url: '/api/coupons/reportColums',
        params: {
            ...filter
        },
        // types: {
        //     success: types.GET_LIST_SUCCESS,
        // }
    };
};

export const getReportCircles = (filter) => {
    // console.log('getList: ', filter)
    return {
        url: '/api/coupons/reportCircles',
        params: {
            ...filter
        },
        // types: {
        //     success: types.GET_LIST_SUCCESS,
        // }
    };
};

export const getReportExchange = (filter) => {
    return {
        url: '/api/coupons/reportExchange',
        params: {
            ...filter
        }
    };
};