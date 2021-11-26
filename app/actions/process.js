export const types = {
    GET_LIST_SUCCESS: 'PROCESS_GET_LIST_SUCCESS',
    CREATE_SUCCESS: 'PROCESS_CREATE_SUCCESS',
    UPDATE_SUCCESS: 'PROCESS_UPDATE_SUCESS',
    DELETE_SUCCESS: 'PROCESS_DELETE_SUCCESS',
    SWITCH_PROCESS: 'PROCESS_SWITCH_PROCESS',
    SWITCH_VIEW: 'PROCESS_SWITCH_VIEW'
}


export const getList = (filter) => {
    // console.log('getList act process');

    return {
        url: '/api/process',
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
        url: '/api/process',
        params: {
            ...filter
        },
    };
};

export const create = (data, step) => {
    return {
        url: '/api/process',
        method: 'post',
        params: {
            ...data
        },
        meta: {
            step
        },
        types: {
            success: types.CREATE_SUCCESS,
        }
    };
};

export const update = (data) => {
    return {
        url: '/api/process/' + data.id,
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
        url: '/api/process/' + id,
        method: 'delete',
        meta: id,
        types: {
            success: types.DELETE_SUCCESS,
        }
    };
};

export const swithProcess = (id) => {
    return {
        type: types.SWITCH_PROCESS,
        id
    }
}

export const swithView = (id) => {
    return {
        type: types.SWITCH_VIEW,
        id
    }
}
