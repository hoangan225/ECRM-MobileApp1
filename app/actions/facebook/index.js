export const types = {
    GET_LIST_SUCCESS: 'FACEBOOK_CAMPAIGN_GET_LIST_SUCCESS',
    CREATE_SUCCESS: 'FACEBOOK_CAMPAIGN_CREATE_SUCCESS',
    CREATE_ERROR: 'FACEBOOK_CAMPAIGN_CREATE_ERROR',
    UPDATE_SUCCESS: 'FACEBOOK_CAMPAIGN_UPDATE_SUCCESS',
    UPDATE_ERROR: 'FACEBOOK_CAMPAIGN_UPDATE_ERROR',
    DELETE_SUCCESS: 'FACEBOOK_CAMPAIGN_DELETE_SUCCESS',
    COUNT_SUCCESS: 'FACEBOOK_CAMPAIGN_COUNT_SUCCESS',
    GET_CUSTOMER_NUMBER: 'FACEBOOK_CAMPAIGN_GET_CUSTOMER_NUMBER',
    UPDATE_STATUS_CAMPAIGN_SUCCESS: 'UPDATE_STATUS_CAMPAIGN_SUCCESS'
}
import { types as orderTypes } from '@/actions/product/order'

export const get = (id) => {
    return {
        url: '/api/facebook/campaign/' + id,
        types: {
            success: types.UPDATE_SUCCESS,
        }
    };
};

export const getList = (type, filter) => {
    return {
        url: '/api/facebook/campaign',
        params: {
            type,
            ...filter
        },
        types: {
            success: types.GET_LIST_SUCCESS,
        }
    };
};

export const create = (data) => {
    return {
        url: '/api/facebook/campaign',
        method: 'post',
        params: {
            ...data
        },
        types: {
            success: types.CREATE_SUCCESS,
            error: types.CREATE_ERROR
        }
    };
};

export const update = (data) => {
    return {
        url: '/api/facebook/campaign/' + data.id,
        method: 'put',
        params: {
            ...data
        },
        types: {
            success: types.UPDATE_SUCCESS,
            error: types.UPDATE_ERROR
        }
    };
};

export const remove = (data) => {
    return {
        url: '/api/facebook/campaign/' + data.id,
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
        url: '/api/facebook/campaign/count/' + id,
        method: 'get',
        meta: id,
        types: {
            success: types.COUNT_SUCCESS,
        }
    };
};

export const getFbList = (id, type, page = 1, pagesize = 20) => {
    return {
        url: '/api/facebook/campaign/' + id + '/facebooks',
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
        url: '/api/facebook/campaign/resend/' + id,
        method: 'post'
    };
};
export const getOrders = (id, params) => {
    return {
        url: '/api/facebook/campaign/' + id + '/orders',
        params,
        types: {
            success: orderTypes.GET_LIST_SUCCESS,
        },
    };
}
export const getErrorLists = id => {
    return {
        url: '/api/facebook/campaign/errorlists/' + id,
    };
}

export const search = (filter) => {
    return {
        url: '/api/facebook/campaign/search',
        params: {
            ...filter
        },

    };
};

export const getCustomerCount = (model, abortController) => {
    return {
        url: '/api/facebook/campaign/count',
        params: {
            ...model
        },
        types: {
            success: types.GET_CUSTOMER_NUMBER,
        },
        abortController
    };
};
