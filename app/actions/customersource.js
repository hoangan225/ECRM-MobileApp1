export const types = {
    GET_LIST_SUCCESS: 'CUSTOMERSOURCE_GET_LIST_SUCCESS',
    CREATE_SUCCESS: 'CUSTOMERSOURCE_CREATE_SUCCESS',
    UPDATE_SUCCESS: 'CUSTOMERSOURCE_UPDATE_SUCESS',
    DELETE_SUCCESS: 'CUSTOMERSOURCE_DELETE_SUCCESS'
}


export const getList = () => {
    return {
        url: '/api/customersources',
        types: {
            success: types.GET_LIST_SUCCESS,
        }
    };
};

export const create = (data) => {
    return {
        url: '/api/customersources',
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
        url: '/api/customersources/' + data.id,
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
        url: '/api/customersources/' + id,
        method: 'delete',
        meta: id,
        types: {
            success: types.DELETE_SUCCESS,
        }
    };
};


