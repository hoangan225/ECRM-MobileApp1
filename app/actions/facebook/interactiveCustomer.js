export const types = {
    GET_LIST_SUCCESS: 'FACEBOOK_CUSTOMER_GET_LIST_SUCCESS',
    UPDATE_AVATAR_SUCCESS: 'FACEBOOK_CUSTOMER_AVATAR_UPDATE_SUCCESS',
    UPDATE_CUSTOMER_SUCCESS: 'FACEBOOK_CUSTOMER_UPDATE_SUCCESS'
};

export const getList = (filter) => {
    return {
        url: '/api/facebook/interactivecustomer',
        params: {
            ...filter
        },
        types: {
            success: types.GET_LIST_SUCCESS,
        }
    };
};

export const updateAvatar = (psid) => {
    return {
        url: '/api/facebook/interactivecustomer/' + psid + '/actions/updateAvatar',
        method: 'post',
        types: {
            success: types.UPDATE_AVATAR_SUCCESS,
        }
    };
};


export const updateCustomer = (id) => {
    return {
        url: '/api/facebook/interactivecustomer/' + id + '/actions/update',
        method: 'put',
        types: {
            success: types.UPDATE_CUSTOMER_SUCCESS
        }
    };
};