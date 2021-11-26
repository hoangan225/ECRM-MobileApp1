export const types = {
    GET_LIST_START: 'CUSTOMFIELD_GET_LIST_START',
    GET_LIST_SUCCESS: 'CUSTOMFIELD_GET_LIST_SUCCESS',
    CREATE_SUCCESS: 'CUSTOMFIELD_CREATE_SUCCESS',
    UPDATE_SUCCESS: 'CUSTOMFIELD_UPDATE_SUCESS',
    DELETE_SUCCESS: 'CUSTOMFIELD_DELETE_SUCCESS'
}


export const getList = () => {
    return {
        url: '/api/customfields',
        types: {
            start: types.GET_LIST_START,
            success: types.GET_LIST_SUCCESS,
        }
    };
};

export const getFields = (applyfor) => {
    return {
        url: '/api/customfields/' + applyfor,
        types: {
            success: types.GET_LIST_SUCCESS,
        }
    };
};
export const create = (data) => {
    return {
        url: '/api/customfields',
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
        url: '/api/customfields/' + data.id,
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
        url: '/api/customfields/' + id,
        method: 'delete',
        meta: id,
        types: {
            success: types.DELETE_SUCCESS,
        }
    };
};


