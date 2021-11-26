export const types = {
    GET_LIST_PAGES_SUCCESS: 'MESSAGE_PAGE_GET_LIST_SUCCESS',
    ADD_LIST_SUCCESS: 'MESSAGE_PAGE_ADD_LIST_SUCCESS',
    CREATE_SUCCESS: 'MESSAGE_PAGE_CTM_CREATE_SUCCESS',
    UPDATE_CONNECTED_PAGES_SUCCESS: 'MESSAGE_UPDATE_CONNECTED_SUCCESS',
    GET_VALIDATED_LIST_PAGES_SUCCESS: 'MESSAGE_GET_VALIDATED_LIST_SUCCESS',
    FACEBOOK_SELECT_PAGE: "MESSAGE_SELECT_PAGE",
    FACEBOOK_USER: "MESSAGE_USER",
    CHANGE_PAGE_FACEBOOK: "CHANGE_PAGE_FACEBOOK",
    DELETE_PAGE_SUCCESS: "FACEBOOK_DELETE_PAGE_SUCCESS",
    CREATE_FAVORITE_PAGES_SUCCESS: "FACEBOOK_CREATE_FAVORITE_PAGES_SUCCESS",
    REMOVE_FAVORITE_PAGES_SUCCESS: "FACEBOOK_REMOVE_FAVORITE_PAGES_SUCCESS",
    CONNECT_FBCHAT_SUCCESS: "CONNECT_FBCHAT_SUCCESS",
    REMOVE_CONNECT_FBCHAT_SUCCESS: "REMOVE_CONNECT_FBCHAT_SUCCESS",
    RESET_PAGE_PROFILE:"RESET_PAGE_PROFILE"
}
export const getList = () => {
    return {
        url: '/api/conversations/pages',
        types: {
            success: types.GET_LIST_PAGES_SUCCESS,
        }
    };
};

export const getValidatedPages = () => {
    return {
        url: '/api/facebook/page/validatedPages',
        types: {
            success: types.GET_VALIDATED_LIST_PAGES_SUCCESS,
        }
    };
};
export const updateConnectedPages = (data) => {
    return {
        url: '/api/conversations/pages/connectedPages',
        method: 'post',
        params: data,
        types: {
            success: types.UPDATE_CONNECTED_PAGES_SUCCESS,
        }
    };
};
export const getConnectedPages = (data) => {
    return {
        url: '/api/facebook/page/connectedPages',
        params: data
    };
};

export const selectPage = (id, pageIdFb, item) => {
    return {
        data: { id, pageIdFb, item },
        type: types.FACEBOOK_SELECT_PAGE
    }
}

export const getFbUser = (fbUserId) => {
    return {
        data: fbUserId,
        type: types.FACEBOOK_USER
    }
}

export const changePage = (ecrmPageId, pageIdFb, item) => {
    return {
        data: { ecrmPageId, pageIdFb, item },
        type: types.CHANGE_PAGE_FACEBOOK
    }
}

export const removePage = (id) => {
    return {
        url: '/api/conversations/pages/' + id,
        method: 'delete',
        meta: id,
        types: {
            success: types.DELETE_PAGE_SUCCESS,
        }
    };
};
export const favoritePage = (id) => {
    return {
        url: '/api/conversations/pages/favorite/' + id,
        method: 'post',
        meta: id,
        types: {
            success: types.CREATE_FAVORITE_PAGES_SUCCESS,
        }
    };
};
export const removeFavoritePage = (id) => {
    return {
        url: '/api/conversations/pages/favorite/' + id,
        method: 'post',
        meta: id,
        types: {
            success: types.REMOVE_FAVORITE_PAGES_SUCCESS,
        }
    };
};
// export const removePageFbchat = (id) => {
//     return {
//         url: '/api/conversations/pages/' + id,
//         method: 'delete',
//         meta: id,
//         types: {
//             success: types.DELETE_PAGE_SUCCESS,
//         }
//     };
// };
export const connectFbchat = (id) => {
    return {
        url: '/api/conversations/pages/fbchatable/' + id,
        method: 'post',
        meta: id,
        types: {
            success: types.CONNECT_FBCHAT_SUCCESS,
        }
    };
};
export const removeConnectFbchat = (id) => {
    return {
        url: '/api/conversations/pages/fbchatable/' + id,
        method: 'post',
        meta: id,
        types: {
            success: types.REMOVE_CONNECT_FBCHAT_SUCCESS,
        }
    };
};


// reset page profile

export const resetPageProfile = () => {
    return {
        type: types.RESET_PAGE_PROFILE,
    }
}

