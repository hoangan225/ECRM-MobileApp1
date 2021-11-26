export const types = {
    GET_LIST_SUCCESS: 'FACEBOOK_REF_GET_LIST_SUCCESS',
    CREATE_SUCCESS: 'FACEBOOK_REF_CREATE_SUCCESS',
    UPDATE_SUCCESS: 'FACEBOOK_REF_UPDATE_SUCESS',
    DELETE_SUCCESS: 'FACEBOOK_REF_DELETE_SUCCESS'
}


export const getList = (filter) => {
    return {
        url: '/api/facebook/refs',
        params: {
            ...filter
        },
        types: {
            success: types.GET_LIST_SUCCESS,
        }
    };
};

export const create = (data) => {
    return {
        url: '/api/facebook/refs',
        method: 'post',
        params: {
            ...data
        },
        types: {
            success: types.CREATE_SUCCESS,
        }
    };
};


export const update = (id,data) => {
    return {
        url: '/api/facebook/refs/' + id,
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
        url: '/api/facebook/refs/' + id,
        method: 'delete',
        meta: id,
        types: {
            success: types.DELETE_SUCCESS,
        }
    };
};


