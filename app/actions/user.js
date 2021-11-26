export const types = {
    GET_LIST_SUCCESS: 'USER_GET_LIST_SUCCESS',
    CREATE_SUCCESS: 'USER_CREATE_SUCCESS',
    UPDATE_SUCCESS: 'USER_UPDATE_SUCESS',
    DELETE_SUCCESS: 'USER_DELETE_SUCCESS'
}


export const getList = (filter) => {
    return {
        url: '/api/users',
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
        url: '/api/users',
        params: {
            ...filter
        }
    };
};

export const create = (data) => {
    return {
        url: '/api/users',
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
        url: '/api/users/' + data.id,
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
        url: '/api/users/' + id,
        method: 'delete',
        meta: id,
        types: {
            success: types.DELETE_SUCCESS,
        }
    };
};


export const changePassword = (data) => {
    return {
        url: '/api/users/reset-password/' + data.id,
        method: 'put',
        params: {
            ...data
        },
        param: {
            ...data
        }
    };
};
