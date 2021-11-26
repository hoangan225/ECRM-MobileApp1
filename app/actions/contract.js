export const types = {
    GET_LIST_SUCCESS: 'CONTRACT_GET_LIST_SUCCESS',
    CREATE_SUCCESS: 'CONTRACT_CREATE_SUCCESS',
    UPDATE_SUCCESS: 'CONTRACT_UPDATE_SUCESS',
    DELETE_SUCCESS: 'CONTRACT_DELETE_SUCCESS'
}


export const getList = (filter) => {
    return {
        url: '/api/contracts',
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
        url: '/api/contracts/search',
        types: {
            success: types.GET_LIST_SUCCESS,
        },
        params: {
            ...filter
        },

    };
};

export const create = (data) => {
    // // console.log('actions: ', data)
    return {
        url: '/api/contracts',
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
    // // console.log('data: action: ', data)
    return {
        url: '/api/contracts/' + data.id,
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
        url: '/api/contracts/' + id,
        method: 'delete',
        meta: id,
        types: {
            success: types.DELETE_SUCCESS,
        }
    };
};

export const getDetails = (id) => {
    return {
        url: '/api/contracts/' + id,
        meta: id,
    };
}