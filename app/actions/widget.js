export const types = {
    GET_LIST_JOB_SUCCESS: 'WIDGET_GET_LIST_JOB',
    GET_CONVERSION_SUCCESS: 'WIDGET_GET_CONVERSION',
    GET_CUSTOMER_SUCCESS: 'WIDGET_GET_CUSTOMER',
}

export const getListJob = (filter) => {
    return {
        url: '/api/jobs/widget',
        types: {
            success: types.GET_LIST_JOB_SUCCESS,
        },
        params: {
            ...filter,
        }
    };
};

export const getConversion = (filter) => {
    return {
        url: '/api/customers/conversion',
        types: {
            success: types.GET_CONVERSION_SUCCESS,
        },
        params: {
            ...filter,
        }
    };
}
export const getCustomer = (filter) => {
    return {
        url: '/api/customers/widget',
        types: {
            success: types.GET_CUSTOMER_SUCCESS,
        },
        params: {
            ...filter,
        }
    };
}