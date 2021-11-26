export const types = {
    GET_LIST_SUCCESS: 'ACTIVITY_GET_LIST_SUCCESS',
    CREATE_SUCCESS: 'ACTIVITY_CREATE_SUCCESS',
    UPDATE_SUCCESS: 'ACTIVITY_UPDATE_SUCESS',
    DELETE_SUCCESS: 'ACTIVITY_DELETE_SUCCESS'
}


export const getList = (filter) => {
    return {
        url: '/api/activities',
        types: {
            success: types.GET_LIST_SUCCESS,
        },
        params: {
            ...filter
        }
    };
};

export const create = (data) => {
    return {
        url: '/api/activities',
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
        url: '/api/activities/' + data.id,
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
        url: '/api/activities/' + id,
        method: 'delete',
        meta: id,
        types: {
            success: types.DELETE_SUCCESS,
        }
    };
};


