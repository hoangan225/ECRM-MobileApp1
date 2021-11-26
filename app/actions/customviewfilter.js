export const types = {
    GET_LIST_SUCCESS: 'CUSTOMVIEWFILTER_GET_LIST_SUCCESS',
    CREATE_SUCCESS: 'CUSTOMVIEWFILTER_CREATE_SUCCESS',
    UPDATE_SUCCESS: 'CUSTOMVIEWFILTER_UPDATE_SUCESS',
    DELETE_SUCCESS: 'CUSTOMVIEWFILTER_DELETE_SUCCESS'
}


export const getList = () => {
    return {
        url: '/api/customviewfilters',
        types: {
            success: types.GET_LIST_SUCCESS,
        }
    };
};

export const create = (data) => {
    return {
        url: '/api/customviewfilters',
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
        url: '/api/customviewfilters/' + data.id,
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
        url: '/api/customviewfilters/' + id,
        method: 'delete',
        meta: id,
        types: {
            success: types.DELETE_SUCCESS,
        }
    };
};


