export const types = {
    GET_PAGE_OPTIONS: 'GET_PAGE_OPTIONS',
    SET_PAGE_OPTIONS: 'SET_PAGE_OPTIONS',
    GET_USER_NOBITA: "GET_USER_NOBITA",
    GET_USER_MANAGE_PAGE: "GET_USER_MANAGE_PAGE",
    GET_BRANCH_PAGE: 'GET_BRANCH_PAGE',
    GET_DEPARTMENT: 'GET_DEPARTMENT',
    SET_PRIO_OPTIONS: 'SET_PRIO_OPTIONS',
    GET_PRIO_OPTIONS: 'GET_PRIO_OPTIONS',
    ASYN_SETTING_OFTIONS: "ASYN_SETTING_OFTIONS",
    ASYN_ALL_SETTING_OFTIONS: "ASYN_ALL_SETTING_OFTIONS",
    // GET_PAGE_OPTION_MANAGE: "GET_PAGE_OPTION_MANAGE",
    SET_MANAGE_PAGE: "SET_MANAGE_PAGE"
};


export const getPageOptions = (pageId) => {
    return {
        url: `/api/conversations/option/${pageId}`,
        types: {
            success: types.GET_PAGE_OPTIONS,
        },
    };
};

// export const getPageOptionManages = (pageId) => {
//     return {
//         url: `/api/conversations/option/manage/${pageId}`,
//         types: {
//             success: types.GET_PAGE_OPTION_MANAGE,
//         },
//     };
// };
export const saveSupport = (pageId, data) => {
    return {
        url: `/api/conversations/option/${pageId}`,
        params: data,
        method: "post",
        types: {
            success: types.SET_PAGE_OPTIONS,
        },
    };
};

export const saveGeneral = (pageId, data) => {
    return {
        url: `/api/conversations/option/${pageId}`,
        params: data,
        method: "post",
        types: {
            success: types.SET_PAGE_OPTIONS,
        },
    };
};

export const getUserNobita = (pageId) => {
    return {
        url: '/api/conversations/auto/user?idp=' + pageId,
        types: {
            success: types.GET_USER_NOBITA,
        },
    };
};

export const getUser = (pageId) => {
    return {
        url: `/api/conversations/auto/userfb?idp=${pageId}`,
        types: {
            success: types.GET_USER_MANAGE_PAGE,
        }
    };
};


export const getBranchUser = (id) => {
    return {
        url: `/api/FbConversation/auto/usbra/${id}`,
        types: {
            success: types.GET_USER_BRANCHH,
        },
    };
};
export const searchDepartment = () => {
    return {
        url: `/api/conversations/auto/dep`,
        types: {
            success: types.GET_DEPARTMENT,
        },
    };
};

export const savePrio = (pageId, data) => {
    return {
        url: `/api/conf/${pageId}`,
        params: data,
        method: "post",
        types: {
            success: types.SET_PRIO_OPTIONS,
        },
    };
};

export const getPrio = (pageId) => {
    return {
        url: `/api/conf/${pageId}`,
        types: {
            success: types.GET_PRIO_OPTIONS,
        },
    };
};

// đồng bộ cài đặt chung

export const AsynSettingGeneral = (pageId, data) => {
    return {
        url: `/api/conversations/async-setting/${pageId}?${data}`,
        method: 'post',
    };

};

export const syncAllOption = (id, param, paramOption) => {
    return {
        url: `/api/conversations/async-setting/all/${id}?${param}&${paramOption}`,
        method: 'post',
    };

};


export const moveConversations = (data) => {
    return {
        params: data,
        url: `/api/conversation-assined/move/import`,
        method: 'post',
    };

};

export const cancleMoveConversations = (id) => {
    return {
        url: `/api/conversation-assined/move/cancel/${id}`,
    };

};

export const setManagePage = (pageId, userManageIds) => {
    return {
        params: userManageIds,
        url: `/api/conversations/user/manage/${pageId}`,
        method: 'post',
        types: {
            success: types.SET_MANAGE_PAGE,
        }
    };
};


