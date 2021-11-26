export const types = {
    GET_FILE_SUCCES: 'FACEBOOK_FILE_IMAGE_GET_FILE_SUCCES',
    GET_FILE_IMAGE_SUCCES: "FACEBOOK_SHOW_FILE_IMG_SUCCES",
    GET_FILE_IMAGE_RECEN: "GET_FILE_IMAGE_RECEN",
    CREATE_FILE_IMAGE_SUCCES: "CREATE_FILE_IMAGE_SUCCES",
    DELETE_FILE_IMAGE_SUCCES: "DELETE_FILE_IMAGE_SUCCES",
    UPDATE_FILE_IMAGE_SUCCES: "UPDATE_FILE_IMAGE_SUCCES",
    GET_FILE_IMAGE_OFTEN: "GET_FILE_IMAGE_OFTEN",
    ADD_IMAGE_OFTEN: "ADD_IMAGE_OTEN",
    DELETE_IMAGES_FOLDER: "DELETE_IMAGES_FOLDER",
    REMOVE_IMAGE_OFTEN: "REMOVE_IMAGE_OFTEN",
    GET_LIST_IMG_SYNC_SUCCESS: "GET_LIST_IMG_SYNC_SUCCESS",
}

export const getfile = (pageId) => {
    return {
        url: `/api/collection?pageId=${pageId}`,
        types: {
            success: types.GET_FILE_SUCCES,
        }
    };

};
export const getfileimg = (id) => {
    return {
        url: `/api/collection/${id}`,
        types: {
            success: types.GET_FILE_IMAGE_SUCCES,
        },
    };

};

export const addOften = (item, data) => {
    return {
        url: '/api/conversation/attachment/favorite/' + item.id,
        method: 'put',
        params: {
            ...data
        },
    };
};


export const getfileOften = (pageId) => {
    return {
        url: '/api/conversation/attachment/favorite?pageId=' + pageId,
    };

};


export const createfileImg = (pageId, project) => {
    return {
        url: `/api/collection?pageId=${pageId}`,
        method: 'post',
        params: {
            ...project
        },
        types: {
            success: types.CREATE_FILE_IMAGE_SUCCES,
        }
    };
};



export const removefileImg = (id) => {
    return {
        url: '/api/collection/' + id,
        method: 'delete',
        meta: id,
        types: {
            success: types.DELETE_FILE_IMAGE_SUCCES,
        }
    };
};

export const removeImageFolder = (id, listId) => {
    const ad = listId.join("&ida=");
    return {
        url: `/api/collection/images/${id}?ida=${ad}`,
        meta: listId,
        method: 'delete',
    };

};
export const updatefileImg = (filesImg) => {
    return {
        url: '/api/collection/' + filesImg.id,
        method: 'put',
        params: {
            ...filesImg
        },
        types: {
            success: types.UPDATE_FILE_IMAGE_SUCCES,
        }
    };
};

export const remove = (id, url) => {
    return {
        url: '/api/attachments/' + (id ? id : ''),
        params: {
            url
        },
        method: 'delete'
    };
}

export const getList = (path, accept, offset, pagesize, pageId) => {
    return {
        url: `/api/conversation/attachment`,
        method: 'get',
        params: {
            path, accept, offset, pagesize, pageId
        }
    };
};
export const addImgFolder = (project, id) => {
    return {
        url: '/api/collection/' + id,
        method: 'post',
        params: [{
            ...project
        }],
    };
};
export const addImagePage = (project, options) => {
    return {
        url: '/api/conversation/attachment/' + options,
        method: 'post',
        params: {
            ...project
        },
    };
};

export const movetoImgFolder = (options, project) => {
    return {
        url: '/api/collection/' + options,
        method: 'post',
        params: project,
    };
};

export const RemoveImgTemplate = (id, listId) => {
    return {
        url: `/api/template/image/${id}?ida=${listId.id}`,
        method: 'delete',
    };

};

export const syncImg = (id, pageId, pageSearch) => {
    return {
        url: `/api/conversations/syn/file/${pageSearch.id}?pageId=${pageId}`,
        method: 'post',
        params: id
    };

};
