export const types = {
    GET_LIST_START: 'CUSTOMVIEWDETAIL_GET_LIST_START',
    GET_LIST_SUCCESS: 'CUSTOMVIEWDETAIL_GET_LIST_SUCCESS',
    CREATE_SUCCESS: 'CUSTOMVIEWDETAIL_CREATE_SUCCESS',
    UPDATE_SUCCESS: 'CUSTOMVIEWDETAIL_UPDATE_SUCESS',
    DELETE_SUCCESS: 'CUSTOMVIEWDETAIL_DELETE_SUCCESS'
}


export const getList = (filter) => {
    return {
        url: '/api/customviewdetails',
        types: {
            success: types.GET_LIST_SUCCESS,
            start: types.GET_LIST_START
        },
        params: {
            ...filter
        }
    };
};

export const create = (data) => {
    return {
        url: '/api/customviewdetails',
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
        url: '/api/customviewdetails/' + data.id,
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
        url: '/api/customviewdetails/' + id,
        method: 'delete',
        meta: id,
        types: {
            success: types.DELETE_SUCCESS,
        }
    };
};

export const removeNotRender = (id) => {
    return {
        url: '/api/customviewdetails/' + id,
        method: 'delete',
        meta: id,
        types: {
            // success: types.DELETE_SUCCESS,
        }
    };
};



