export const types = {
    GET_LIST_SUCCESS: 'CUSTOMVIEWSORT_GET_LIST_SUCCESS',
    CREATE_SUCCESS: 'CUSTOMVIEWSORT_CREATE_SUCCESS',
    UPDATE_SUCCESS: 'CUSTOMVIEWSORT_UPDATE_SUCESS',
    DELETE_SUCCESS: 'CUSTOMVIEWSORT_DELETE_SUCCESS'
}


export const getList = () => {
    return {
        url: '/api/customviewsorts',
        types: {
            success: types.GET_LIST_SUCCESS,
        }
    };
};

export const create = (data) => {
    return {
        url: '/api/customviewsorts',
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
        url: '/api/customviewsorts/' + data.id,
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
        url: '/api/customviewsorts/' + id,
        method: 'delete',
        meta: id,
        types: {
            success: types.DELETE_SUCCESS,
        }
    };
};


export const updateSort = (data) => {
    return {
        url: '/api/customviewsorts/updateSort',
        method: 'post',
        params: data,
        types: {
            // success: types.UPDATE_LISTDETAIL_SUCCESS,
        }
    };
};

