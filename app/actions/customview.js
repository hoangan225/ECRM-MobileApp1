export const types = {
    GET_LIST_SUCCESS: 'CUSTOMVIEW_GET_LIST_SUCCESS',
    GET_SINGLE_SUCCESS: 'CUSTOMVIEW_GET_SINGLE_SUCCESS',
    CREATE_SUCCESS: 'CUSTOMVIEW_CREATE_SUCCESS',
    CREATEDETAIL_SUCCESS: 'CUSTOMVIEW_CREATEDETAIL_SUCCESS',
    UPDATE_SUCCESS: 'CUSTOMVIEW_UPDATE_SUCESS',
    UPDATERANGE_SUCCESS: 'CUSTOMVIEW_UPDATERANGE_SUCESS',
    UPDATEDETAIL_SUCCESS: 'CUSTOMVIEW_UPDATEDETAIL_SUCESS',
    UPDATE_LISTDETAIL_SUCCESS: 'CUSTOMVIEW_UPDATE_LISTDETAIL_SUCCESS',
    DELETE_SUCCESS: 'CUSTOMVIEW_DELETE_SUCCESS',
    RERESH: 'RERESH'
}


export const getList = (filter) => {
    return {
        url: '/api/customviews',
        params: {
            ...filter
        },
        types: {
            success: types.GET_LIST_SUCCESS,
        }
    };
};

export const refresh = (filter) => {
    return {
        url: '/api/customviews',
        params: {
            ...filter
        },
        types: {
            success: types.RERESH,
        }
    };
};

export const getSingles = (data) => {
    return {
        url: '/api/customviews/singles',
        method: 'post',
        params: data,
        types: {
            success: types.GET_SINGLE_SUCCESS,
        }
    };
};

export const updateListDetail = (data) => {
    return {
        url: '/api/customviews/listDetail',
        method: 'post',
        params: data,
        types: {
            // success: types.UPDATE_LISTDETAIL_SUCCESS,
        }
    };
};

export const search = (filter) => {
    return {
        url: '/api/customviews',
        params: {
            ...filter
        }
    };
};


export const create = (data) => {
    return {
        url: '/api/customviews',
        method: 'post',
        params: {
            ...data
        },
        types: {
            success: types.CREATE_SUCCESS,
        }
    };
};

export const createdetail = (data) => {
    // console.log('createdeaail action view', data);

    return {
        url: '/api/customviews/createDetails',
        method: 'post',
        params: {
            ...data
        },
        types: {
            success: types.CREATEDETAIL_SUCCESS,
        }
    };
};

export const update = (data) => {
    return {
        url: '/api/customviews/' + data.id,
        method: 'put',
        params: {
            ...data
        },
        types: {
            success: types.UPDATE_SUCCESS,
        }
    };
};

export const updateColumn = (data) => {
    // // console.log('data: ', data)
    return {
        url: '/api/customviews/columnDetails',
        method: 'post',
        params: {
            ...data,
        },
        types: {
            success: types.UPDATEDETAIL_SUCCESS,
        }
    };
};



export const updateList = (data) => {
    return {
        url: '/api/customviews/updateList',
        method: 'put',
        params: {
            ...data,
        },
        types: {
            success: types.UPDATEDETAIL_SUCCESS,
        }
    };
}

export const updateRange = (data) => {
    return {
        url: '/api/customviews/range',
        method: 'put',
        params: {
            ...data,
        },
        types: {
            success: types.UPDATERANGE_SUCCESS,
        }
    };
};

export const updateDetail = (data) => {
    // console.log('dataviewud', data);

    return {
        url: '/api/customviews/details',
        method: 'put',
        params: {
            ...data,
        },
        types: {
            success: types.UPDATEDETAIL_SUCCESS,
        }
    };
};

export const remove = (id) => {
    return {
        url: '/api/customviews/' + id,
        method: 'delete',
        meta: id,
        types: {
            success: types.DELETE_SUCCESS,
        }
    };
};


