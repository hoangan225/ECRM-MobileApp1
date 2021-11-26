export const types = {
    GET_LIST_SUCCESS: 'COMPANY_GET_LIST_SUCCESS',
    GET_SINGLE_SUCCESS: 'COMPANY_GET_SINGLE_SUCCESS',
    CREATE_SUCCESS: 'COMPANY_CREATE_SUCCESS',
    UPDATE_SUCCESS: 'COMPANY_UPDATE_SUCESS',
    DELETE_SUCCESS: 'COMPANY_DELETE_SUCCESS',

}


export const getList = (filter) => {
    return {
        url: '/api/companies',
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
        url: '/api/companies/search',
        params: {
            ...filter
        },

    };
};

export const single = (filter) => {
    return {
        url: '/api/companies/single',
        params: {
            ...filter
        },
        types: {
            success: types.GET_SINGLE_SUCCESS,
        }
    };
};

export const create = (data) => {
    return {
        url: '/api/companies',
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
        url: '/api/companies/' + data.id,
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
        url: '/api/companies/' + id,
        method: 'delete',
        meta: id,
        types: {
            success: types.DELETE_SUCCESS,
        }
    };
};

export const getDetails = (id) => {
    return {
        url: '/api/companies/' + id,
        meta: id,
    };
}