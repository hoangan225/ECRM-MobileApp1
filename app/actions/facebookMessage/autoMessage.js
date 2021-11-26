export const types = {
    GET_PAGE_OPTIONS: 'GET_PAGE_OPTIONS_MESSAGE',
    ADD_MESSAGE_AUTO: 'ADD_MESSAGE_AUTO',
    GET_MESSAGE_AUTO: 'GET_MESSAGE_AUTO',
    DELETE_MESSAGE_AUTO: "DELETE_MESSAGE_AUTO",
    EDIT_MESSAGE_AUTO: "EDIT_MESSAGE_AUTO",
    GET_LIST_POST_SUCCESS: "GET_LIST_MESSAGE_AUTO_POST_SUCCESS"
};
export const getconfig = (pageId) => {
    return {
        url: `/api/conversations/option/${pageId}`,
    };
};
export const editConfigs = (pageId, data) => {
    return {
        url: `/api/conversations/option/${pageId}`,
        method: 'post',
        params: data,
    };
};
export const getListMessageAuto = (params) => {
    return {
        url: `/api/conversations/auto/message/template`,
        method: 'get',
        params: {
            ...params,
        },
        types: {
            success: types.GET_MESSAGE_AUTO,
        }
    };
};
export const add = (data) => {
    return {
        url: `/api/conversations/auto/message/template`,
        method: 'post',
        params: data,
        types: {
            success: types.ADD_MESSAGE_AUTO,
        }
    };
};
export const removeMessageAuto = (id) => {
    return {
        url: `/api/conversations/auto/message/template/${id}`,
        method: 'delete',
        types: {
            success: types.DELETE_MESSAGE_AUTO,
        }
    };
};
export const edit = (data, id) => {
    return {
        url: `/api/conversations/auto/message/template/${id}`,
        method: 'put',
        params: data,
        types: {
            success: types.EDIT_MESSAGE_AUTO,
        }
    };
};
export const getPost = (filter) => {
    return {
        url: `/api/conversations/feed`,
        params: filter,
        types: {
            success: types.GET_LIST_POST_SUCCESS,
        }
    };
};
export const synTemplateAuto = (id, idPages) => {
    return {
        url: `/api/conversations/syn/template-auto?id=${id}&pageIds=${idPages}`,
        method: 'post',
    };

};
export const getListMessageAutoNoAction = (params) => {
    return {
        url: `/api/conversations/auto/message/template`,
        method: 'get',
        params: {
            ...params,
        },
    };
};
export const removeBulk = (params) => {
    return {
        url: '/api/conversations/auto/bulk/delete',
        method: 'post',
        params
    };
};