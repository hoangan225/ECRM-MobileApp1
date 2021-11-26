export const types = {
    GET_LIST_TOPIC_SUCCESS: 'GET_LIST_TOPIC_SUCCESS',
    CREATE_TOPIC:'CREATE_TOPIC',
    DELETE_SUCCESS:'DELETE_SUCCESS',
    UPDATE_SUCCESS:'UPDATE_SUCCESS',
}

export const getList = (pageId) => {
    return {
        url: `/api/topic?pageId=${pageId}`,
        types: {
            success: types.GET_LIST_TOPIC_SUCCESS,
        }
    };
};

export const create = (project,pageId) => {
    return {
        url: `/api/topic?pageId=${pageId}`,
        method: 'post',
        params: {
            ...project
        },
        types: {
            success: types.CREATE_TOPIC,
        }
    };
};

export const remove = (id) => {
    return {
        url: '/api/topic/' + id,
        method: 'delete',
        meta: id,
        types: {
            success: types.DELETE_SUCCESS,
        }
    };
};

export const update = (data) => {
    return {
        url: '/api/topic/' + data.id,
        method: 'put',
        params: {
            ...data
        },
        types: {
            success: types.UPDATE_SUCCESS,
        }
    };
};

export const updateShowtopic = (data) => {
    return {
        url: '/api/options',
        method: 'post',
        params: {
            ...data
        },
    };
};

export const updateshowTemplate = (data) => {
    return {
        url: '/api/options',
        method: 'post',
        params: {
            ...data
        },
        
    };
};