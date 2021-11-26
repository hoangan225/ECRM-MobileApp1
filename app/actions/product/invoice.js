export const types = {
    GET_DETAILS_SUCCESS: 'INVOICE_GET_DETAILS_SUCCESS',
    GET_LIST_SUCCESS: 'INVOICE_GET_LIST_SUCCESS',
}


export const getDetails = (id) => {
    return {
        url: '/api/invoices/' + id + '/details',
        meta: id,
        types: {
            success: types.GET_DETAILS_SUCCESS,
        }
    };
};



export const getList = (filter) => {
    return {
        url: '/api/invoices',
        params: {
            ...filter
        },
        types: {
            success: types.GET_LIST_SUCCESS,
        }
    };
};

