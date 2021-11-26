export const types = {
    GET_LIST_SUCCESS: 'CUSTOMER_GET_LIST_SUCCESS',
    GET_SINGLE_SUCCESS: 'CUSTOMER_GET_SINGLE_SUCCESS',
    CREATE_SUCCESS: 'CUSTOMER_CREATE_SUCCESS',
    UPDATE_SUCCESS: 'CUSTOMER_UPDATE_SUCESS',
    UPDATES_SUCCESS: 'CUSTOMER_UPDATES_SUCESS',
    DELETE_SUCCESS: 'CUSTOMER_DELETE_SUCCESS',
    DELETE_MULTI_SUCCESS: 'CUSTOMER_DELETE_MULTI_SUCCESS',
    CREATENOTE_SUCCESS: 'CUSTOMER_CREATENOTE_SUCCESS',
    ACTIVITY_CREATE_SUCCESS: 'ACTIVITY_CREATE_SUCCESS',
    ACTIVITY_DELETE_SUCCESS: 'ACTIVITY_DELETE_SUCCESS',
    COUNTBIRTHDATE_SUCCESS: 'CUSTOMER_COUNTBIRTHDATE_SUCCESS',
    COUNTEVENT_SUCCESS: 'CUSTOMER_COUNTEVENT_SUCCESS',
    UPDATE_AVATAR_SUCCESS: 'CUSTOMER_UPDATE_AVATAR_SUCCESS',
    DELETE_VIEW_SUCCESS: 'CUSTOMER_VIEW_DELETE_SUCCESS',
    GET_LIST_RECOMMENDER_SUCCESS: 'CUSTOMER_GET_RECOMMENDER_LIST_SUCCESS',
    CUSTOMERAMOUNT_SUCCESS: 'CUSTOMER_AMOUNT_SUCCESS',
    LIST_EVALUATION_SUCCESS: 'LIST_EVALUATION_SUCCESS',
    UPDATE_EVALUATION_SUCCESS: 'UPDATE_EVALUATION_SUCCESS',
    CREATE_EVALUATION_SUCCESS: 'CREATE_EVALUATION_SUCCESS',
}

export const getlist = (filter) => {
    // // console.log('actioncus', filter);
    return {
        url: '/api/customers',
        params: {
            ...filter
        },
        types: {
            success: types.GET_LIST_SUCCESS
        }
    }
}

export const search = (filter) => {
    return {
        url: '/api/customers/search',
        params: {
            ...filter
        },
    };
};

export const single = (filter) => {
    return {
        url: '/api/customers/single',
        params: {
            ...filter
        },
        types: {
            success: types.GET_SINGLE_SUCCESS,
        }
    };
};

export const create = (data) => {
    // console.log('create customer action" ', data)
    return {
        url: '/api/customers',
        method: 'post',
        params: {
            ...data
        },
        types: {
            success: types.CREATE_SUCCESS,
        }
    };
};
export const createByOptinForm = (data) => {
    return {
        url: '/api/customers/optinform/' + data.formid,
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
    // console.log('data', data);

    return {
        url: '/api/customers/' + data.id,
        method: 'put',
        params: {
            ...data
        },
        types: {
            success: types.UPDATE_SUCCESS,
        }
    };
};

export const remove = (id) => {
    return {
        url: '/api/customers/' + id,
        method: 'delete',
        meta: id,
        types: {
            success: types.DELETE_SUCCESS,
        }
    };
};

export const getDetails = (id) => {
    return {
        url: '/api/customers/' + id,
        meta: id,
    };
}

export const createNote = (data) => {
    return {
        url: '/api/customers/createNote',
        method: 'post',
        params: {
            ...data
        },
        types: {
            success: types.ACTIVITY_CREATE_SUCCESS,
        }
    };
};


export const removeNote = (id) => {
    return {
        url: '/api/customers/' + id + '/deleteNote',
        method: 'delete',
        meta: id,
        types: {
            success: types.ACTIVITY_DELETE_SUCCESS,
        }
    };
};

export const customerImport = (filter) => {
    return {
        url: '/api/customerImports/import',
        params: {
            ...filter
        },
        types: {
            success: types.GET_SINGLE_SUCCESS,
        }
    };
};

export const cancelImport = (id) => {
    return {
        url: '/api/customerimports/cancel/' + id
    };
};


export const updateAvatar = (id, url) => {
    return {
        url: '/api/customers/avatar/' + id,
        method: 'post',
        params: {
            url
        },
        meta: id,
        types: {
            success: types.UPDATE_AVATAR_SUCCESS
        }
    };
};

export const customerAmount = (id) => {
    return {
        url: '/api/customers/customerAmount?customerId=' + id,
        types: {
            success: types.CUSTOMERAMOUNT_SUCCESS,
        }
    };
};