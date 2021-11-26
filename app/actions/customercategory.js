export const types = {
    GET_LIST_SUCCESS: 'CUSTOMERCATEGORY_GET_LIST_SUCCESS',
    GET_LIST_BY_NAME_SUCCESS: 'CUSTOMERCATEGORY_GET_LIST_BY_NAME_SUCCESS',
    CREATE_SUCCESS: 'CUSTOMERCATEGORY_CREATE_SUCCESS',
    UPDATE_SUCCESS: 'CUSTOMERCATEGORY_UPDATE_SUCESS',
    DELETE_SUCCESS: 'CUSTOMERCATEGORY_DELETE_SUCCESS'
}


export const getList = (filter={page:1,pagesize:1000}) => {
    return {
        url: '/api/customercategories',
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
        url: '/api/customercategories',
        params: {
            ...filter
        },
   
    };
};

export const create = (data) => {
    return {
        url: '/api/customercategories',
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
        url: '/api/customercategories/' + data.id,
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
        url: '/api/customercategories/' + id,
        method: 'delete',
        meta: id,
        types: {
            success: types.DELETE_SUCCESS,
        }
    };
};