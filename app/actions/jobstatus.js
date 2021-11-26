export const types = {
    GET_LIST_SUCCESS: 'JOBSTATUS_GET_LIST_SUCCESS',
    CREATE_SUCCESS: 'JOBSTATUS_CREATE_SUCCESS',
    UPDATE_SUCCESS: 'JOBSTATUS_UPDATE_SUCESS',
    DELETE_SUCCESS: 'JOBSTATUS_DELETE_SUCCESS'
}


export const getList = (filter) => {
    return {
        url: '/api/jobstatus',
        types: {
            success: types.GET_LIST_SUCCESS,
        },
        params: {
            ...filter
        }
    };
};
export const search = (filter) => {
    return {
        url: '/api/jobstatus',
        params: {
            ...filter
        },

    };
};

export const create = (data) => {
    return {
        url: '/api/jobstatus',
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
        url: '/api/jobstatus/' + data.id,
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
        url: '/api/jobstatus/' + id,
        method: 'delete',
        meta: id,
        types: {
            success: types.DELETE_SUCCESS,
        }
    };
};

export const getDetails = (id) => {
    return {
        url: '/api/jobstatus/' + id,
        meta: id,
    };
}