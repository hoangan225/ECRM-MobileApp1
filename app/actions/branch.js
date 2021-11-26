export const types = {
    GET_LIST_SUCCESS: 'BRANCH_GET_LIST_SUCCESS',
    CREATE_SUCCESS: 'BRANCH_CREATE_SUCCESS',
    UPDATE_SUCCESS: 'BRANCH_UPDATE_SUCESS',
    DELETE_SUCCESS: 'BRANCH_DELETE_SUCCESS',
    SET_BRANCH: 'BRANCH_SWITCH_CURRENT'
}


export const getList = () => {
    return {
        url: '/api/branches',
        types: {
            success: types.GET_LIST_SUCCESS,
        }
    };
};

export const create = (data) => {
    return {
        url: '/api/branches',
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
        url: '/api/branches/' + data.id,
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
        url: '/api/branches/' + id,
        method: 'delete',
        meta: id,
        types: {
            success: types.DELETE_SUCCESS,
        }
    };
};

export const setBranch = branch => {
    return {
        type: types.SET_BRANCH,
        branch
    }
}


