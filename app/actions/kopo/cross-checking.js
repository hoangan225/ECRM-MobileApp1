export const types = {
    GET_LIST_SUCCESS: 'KOPO_CROSS_CHECKING_GET_LIST_SUCCESS',
    UPDATE_SUCCESS: 'KOPO_CROSS_CHECKING_UPDATE_SUCCESS',
}

export const getList = (view, filter) => {
    return {
        url: '/api/kopo/cross-checking/',
        params: filter,
        meta: view,
        types: {
            success: types.GET_LIST_SUCCESS
        }
    };
};

export const search = (filter) => {
    return {
        url: '/api/kopo/cross-checking/',
        params: filter,
    };
};

export const updateNumber = (id, number) => {
    return {
        url: '/api/kopo/coupons/' + id,
        method: 'patch',
        params: {
            id,
            numberOfPerson: number
        },
        types: {
            success: types.UPDATE_SUCCESS
        }
    };
}
