export const types = {
    GET_LIST_SUCCESS: 'HOTLINE_GET_LIST_SUCCESS',
    CREATE_SUCCESS: 'HOTLINE_CREATE_SUCCESS',
    UPDATE_SUCCESS: 'HOTLINE_UPDATE_SUCESS',
    DELETE_SUCCESS: 'HOTLINE_DELETE_SUCCESS',
    LOAD_TOKEN_LOAD_SUCCESS: 'REST_TOKEN_LOAD_SUCCESS',
}

export const getList = () => {
    return {
        url: '/api/hotline',
        types: {
            success: types.GET_LIST_SUCCESS,
        }
    };
};
export const getRestToken = () => {
    return {
        url: '/api/voip/token/rest',
        types: {
            success: types.LOAD_TOKEN_LOAD_SUCCESS,
        }
    };
};

export const create = (data) => {
    return {
        url: '/api/hotline',
        method: 'post',
        params: {
            ...data
        },
        types: {
            success: types.CREATE_SUCCESS,
        }
    };
};

export const remove = (id) => {
    return {
        url: '/api/hotline/' + id,
        method: 'delete',
        meta: id,
        types: {
            success: types.DELETE_SUCCESS,
        }
    };
};
export const update = (data) => {
    return {
        url: '/api/hotline/' + data.id,
        method: 'put',
        params: {
            ...data
        },
        types: {
            success: types.UPDATE_SUCCESS,
        }
    };
};
