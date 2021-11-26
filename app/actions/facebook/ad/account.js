export const types = {
    GET_ACCOUNTS_LIST_SUCCESS: 'FACEBOOK_ADACCOUNT_GET_ACCOUNTS_LIST_SUCCESS',
    GET_LIST_SUCCESS: 'FACEBOOK_ADACCOUNT_GET_LIST_SUCCESS',
    CREATE_SUCCESS: 'FACEBOOK_ADACCOUNT_CREATE_SUCCESS',
    UPDATE_SUCCESS: 'FACEBOOK_ADACCOUNT_UPDATE_SUCESS',
    DELETE_SUCCESS: 'FACEBOOK_ADACCOUNT_DELETE_SUCCESS'
}

export const getList = (filter) => {
    return {
        url: '/api/facebook/ad/account',
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
        url: '/api/facebook/ad/account',
        params: {
            ...filter
        },
    };
};
export const getAccounts = (filter) => {
    return {
        url: '/api/facebook/ad/account/all',
        params: {
            ...filter
        },
        types: {
            success: types.GET_ACCOUNTS_LIST_SUCCESS,
        }
    };
};

export const connect = (data) => {
    return {
        url: '/api/facebook/ad/account',
        method: 'post',
        params: {
            ...data
        },
        types: {
            success: types.CREATE_SUCCESS,
        }
    };
};

export const disconnect = (id) => {
    return {
        url: '/api/facebook/ad/account/' + id,
        method: 'delete',
        meta: id,
        types: {
            success: types.DELETE_SUCCESS,
        }
    };
};

export const getCampaigns = (accountId) => {
    return {
        url: '/api/facebook/ad/account/' + accountId + "/campaigns",
    };
};
export const sync = (accountId) => ({
    url: '/api/facebook/ad/account/' + accountId + "/sync",
})