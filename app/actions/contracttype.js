export const types = {
    GET_LIST_SUCCESS: 'CONTRACTTYPE_GET_LIST_SUCCESS',
    CREATE_SUCCESS: 'CONTRACTTYPE_CREATE_SUCCESS',
    UPDATE_SUCCESS: 'CONTRACTTYPE_UPDATE_SUCESS',
    DELETE_SUCCESS: 'CONTRACTTYPE_DELETE_SUCCESS'
}


export const getList = () => {
    return {
        url: '/api/contracttypes',
        types: {
            success: types.GET_LIST_SUCCESS,
        }
    };
};

export const create = (data) => {
    return {
        url: '/api/contracttypes',
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
        url: '/api/contracttypes/' + data.id,
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
        url: '/api/contracttypes/' + id,
        method: 'delete',
        meta: id,
        types: {
            success: types.DELETE_SUCCESS,
        }
    };
};


