export const types = {
    GET_LIST_SUCCESS: 'FACEBOOK_ADSET_GET_LIST_SUCCESS',
}

export const getList = (accountId, filter) => {
    return {
        url: '/api/facebook/ad/adset/' + accountId,
        params: {
            ...filter
        },
        types: {
            success: types.GET_LIST_SUCCESS,
        }
    };
};

export const search = (accountId, filter) => {
    return {
        url: '/api/facebook/ad/adset/' + accountId,
        params: {
            ...filter
        },
    };
};
export const update = id => ({
    url: '/api/facebook/ad/adset/' + id,
    method: "put"
})
