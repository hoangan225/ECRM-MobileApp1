export const types = {
    GET_LIST_SUCCESS: 'FACEBOOK_ADCAMPAIGN_GET_LIST_SUCCESS',
}

export const getList = (accountId, filter) => {
    return {
        url: '/api/facebook/ad/campaigns' ,
        params: {
            ...filter,
            accountId
        },
        types: {
            success: types.GET_LIST_SUCCESS,
        }
    };
};

export const search = (accountId, filter) => {
    return {
        url: '/api/facebook/ad/campaigns/' + accountId,
        params: {
            ...filter
        },
    };
};
export const sync = (ids) => ({
    url: '/api/facebook/ad/campaigns/sync',
    params: {
        ids,
    },
    method: "put"
})
export const update = id => ({
    url: '/api/facebook/ad/campaigns/' + id,
    method: "put"
})
