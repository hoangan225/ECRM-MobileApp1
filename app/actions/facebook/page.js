export const types = {
    GET_LIST_SUCCESS: 'FACEBOOK_PAGE_GET_LIST_SUCCESS',
    ADD_LIST_SUCCESS: 'FACEBOOK_PAGE_ADD_LIST_SUCCESS',
    UPDATE_SUCCESS: 'FACEBOOK_PAGE_UPDATE_SUCESS',
    DELETE_SUCCESS: 'FACEBOOK_PAGE_DELETE_SUCCESS',
    CREATE_SUCCESS: 'FACEBOOK_PAGE_CTM_CREATE_SUCCESS',
    SEARCH_SUCCESS: 'FACEBOOK_PAGE_SEARCH_SUCCESS',
    UPDATE_CONNECTED_SUCCESS: 'FACEBOOK_UPDATE_CONNECTED_SUCCESS',
    GET_VALIDATED_LIST_SUCCESS: 'FACEBOOK_GET_VALIDATED_LIST_SUCCESS',
    CLOSE_WARNING_ITEMS: 'FACEBOOK_CLOSE_WARNING_ITEMS',
}

export const getList = (filter) => {
    return {
        url: '/api/facebook/page',
        params: filter,
        types: {
            success: types.GET_LIST_SUCCESS,
        }
    };
};

export const getValidatedPages = () => {
    return {
        url: '/api/facebook/page/validatedPages',
        types: {
            success: types.GET_VALIDATED_LIST_SUCCESS,
        }
    };
};

export const closeNotValidItems = (ids) => {
    return {
        type: types.CLOSE_WARNING_ITEMS,
        closedWarningItemIds: ids
    };
}

export const getConnectedPages = (data) => {
    return {
        url: '/api/facebook/page/connectedPages',
        params: data
    };
};
export const updateConnectedPages = (data) => {
    return {
        url: '/api/facebook/page/connectedPages',
        method: 'post',
        params: data,
        types: {
            success: types.UPDATE_CONNECTED_SUCCESS,
        }
    };
};

export const search = (filter) => {
    return {
        url: '/api/facebook/page',
        params: filter
        // types: {
        //     success: types.SEARCH_SUCCESS,
        // }
    };
};

export const createToken = (userAccessToken) => {
    return {
        url: '/api/facebook/page',
        method: "post",
        params: {
            ...userAccessToken
        },
        types: {
            success: types.ADD_LIST_SUCCESS
        }
    };
};

export const update = (data) => {
    return {
        url: '/api/facebook/page/' + data.id,
        method: 'put',
        params: {
            ...data
        },
        types: {
            success: types.UPDATE_SUCCESS,
        }
    };
};

export const getCtmList = (id, url) => {
    return {
        url: '/api/facebook/page/' + id + '/invitationcustomers',
        params: { url },
        method: 'get'
    };
};

export const remove = (id) => {
    return {
        url: '/api/facebook/page/' + id,
        method: 'delete',
        meta: id,
        types: {
            success: types.DELETE_SUCCESS,
        }
    };
};

export const importCtm = (data, importHistory) => {
    return {
        url: '/api/facebook/page/import',
        method: 'post',
        params: {
            ...data,
            importHistory
        }
    };
};


export const cancelCtm = (id) => {
    return {
        url: '/api/facebook/page/cancel/' + id,
    };
};

export const addGettingStarted = (id) => ({
    url: "/api/facebook/page/getting-stated/" + id,
    method:"POST"
});
