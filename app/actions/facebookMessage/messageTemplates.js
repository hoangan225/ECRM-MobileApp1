export const types = {
    GET_LIST_SUCCESS: 'GET_LIST_SUCCESS',
    CREATE_SUCCESS: 'FACEBOOK_MESSAGE_TEMPLATE_CREATE_SUCCESS',
    UPDATE_SUCCESS: 'FACEBOOK_MESSAGE_TEMPLATE_UPDATE_SUCESS',
    DELETE_SUCCESS: 'DELETE_SUCCESS',
    CREATE_IMG_SUCCESS: 'CREATE_IMG_SUCCESS',
    GET_LIST_TEMPLATE_SUCCESS: 'GET_LIST_TEMPLATE_SUCCESS',
    GET_LIST_SEARCH_TEMPLATE_TOPIC_SUCCESS: 'GET_LIST_SEARCH_TEMPLATE_TOPIC_SUCCESS',
    GET_LIST_SCROLL_SUCCESS: "GET_LIST_TEMPLATE_SCROLL_SUCCESS"
}


export const getList = (paramPageId, page, pageSize, search) => {
    return {
        url: `/api/template?${paramPageId}&page=${page}&pagesize=${pageSize ? pageSize : 100}&search=${search || ""}`,
        types: {
            success: types.GET_LIST_SUCCESS,
        }
    };
};

export const getTemplateSearchTopic = (id) => {
    return {
        url: `/api/template/topic?id=${id}`,
        types: {
            success: types.GET_LIST_SEARCH_TEMPLATE_TOPIC_SUCCESS,
        }
    };

};

export const created = (data, pageId) => {
    return {
        url: `/api/template?pageId=${pageId}`,
        method: 'post',
        params: {
            ...data
        },
        types: {
            success: types.CREATE_SUCCESS,
        }
    };
};

export const createImg = (id, project) => {
    return {
        url: '/api/template/image/' + id,
        method: 'post',
        params: project,
    };
};


export const update = (data) => {
    return {
        url: '/api/template/' + data.id,
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
        url: '/api/template/' + id,
        method: 'delete',
        meta: id,
        // types: {
        //     success: types.DELETE_SUCCESS,
        // }
    };
};



export const getListTemplate = (pageId) => {
    return {
        url: `/api/template?pageId=${pageId}`,
        types: {
            success: types.GET_LIST_TEMPLATE_SUCCESS,
        }
    };
};

export const synTemplate = (id, idPages) => {
    return {
        url: `/api/conversations/syn/template?id=${id}&pageIds=${idPages}`,
        method: 'post',
    };

};

export const getTemplate = (params) => {
    return {
        url: `/api/template`,
        params,
        types: {
            success: types.GET_LIST_SUCCESS,
        }
    };
};
export const getTemplateScroll = (params) => {
    return {
        url: `/api/template`,
        params,
        types: {
            success: types.GET_LIST_SCROLL_SUCCESS,
        }
    };
};

export const exportExcel = (params) => ({
    url: '/excel/export/customer',
    method: 'get',
    useView: true,
    params,
});

export const downloadTemplate = (template) => ({
    url: '/excel/template/' + template,
});

export const startImport = (params) => ({
    method: "post",
    url: "/api/template/actions/import",
    params
});

export const startImportPancake = (params) => ({
    method: "post",
    url: "/api/template/actions/import-pancake",
    params
});

export const getError = (params) => ({
    method: "post",
    url: "/excel/error",
    params
});

export const cancel = (id) => ({
    url: "/excel/cancel/" + id,
});

export const startImportAuto = (params) => ({
    method: "post",
    url: "/api/template/actions/import-auto",
    params
});

export const getTemplateSync = (params) => {
    return {
        url: `/api/template`,
        params,
    };
};

export const removeBulk = (params) => {
    return {
        url: '/api/template/bulk/delete',
        method: 'post',
        params
    };
};

export const getAllMessageTemplate = (params) => {
    return {
        url: `/api/template`,
        params,
    };
};