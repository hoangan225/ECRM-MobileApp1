export const types = {
    GET_LIST_SUCCESS: 'FACEBOOK_TEMPLATE_GET_LIST_SUCCESS',
    CREATE_SUCCESS: 'FACEBOOK_TEMPLATE_CREATE_SUCCESS',
    UPDATE_SUCCESS: 'FACEBOOK_TEMPLATE_UPDATE_SUCESS',
    DELETE_SUCCESS: 'FACEBOOK_TEMPLATE_DELETE_SUCCESS'
}


export const getList = () => {
    return {
        url: '/api/facebook/template',
        types: {
            success: types.GET_LIST_SUCCESS,
        }
    };
};

export const create = (data) => {
    return {
        url: '/api/facebook/template',
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
        url: '/api/facebook/template/' + data.id,
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
        url: '/api/facebook/template/' + id,
        method: 'delete',
        meta: id,
        types: {
            success: types.DELETE_SUCCESS,
        }
    };
};


