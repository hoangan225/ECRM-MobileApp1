export const types = {
    GET_ITEM_SUCCESS: 'KOPO_BUSINESS_GET_ITEM_SUCCESS',
    PATCH_SUCCESS: 'KOPO_BUSINESS_PATCH_SUCESS',
}

export const getItem = () => {
    return {
        url: '/api/kopo/business',
        types: {
            success: types.GET_ITEM_SUCCESS,
        }
    };
};

export const patch = (data) => {
    return {
        url: '/api/kopo/business',
        method: 'patch',
        params: {
            ...data
        },
        types: {
            success: types.PATCH_SUCCESS,
        }
    };
};