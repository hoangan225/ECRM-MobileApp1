export const types = {
    GET_LIST_SUCCESS: 'OPP_GET_LIST_SUCCESS',
    CREATE_SUCCESS: 'OPP_CREATE_SUCCESS',
    UPDATE_SUCCESS: 'OPP_UPDATE_SUCCESS',
    DELETE_SUCCESS: 'OPP_DELETE_SUCCESS',
    DELETE_MULTIL_SUCCESS: 'OPP_DELETE_MULTIL_SUCCESS',
    UPDATE_STEP_START: 'OPP_UPDATE_STEP_START',
    UPDATE_STEP_ERROR: 'OPP_UPDATE_STEP_ERROR',
    UPDATE_STEP_SUCCESS: 'OPP_UPDATE_STEP_SUCCESS',
    PATCH_SUCCESS: 'OPP_PATCH_SUCCESS',
    BULK_UPDATE_STEP_START: 'OPP_BULK_UPDATE_STEP_START',
    BULK_UPDATE_STEP_ERROR: 'OPP_BULK_UPDATE_STEP_ERROR',
    BULK_UPDATE_STEP_SUCCESS: 'OPP_BULK_UPDATE_STEP_SUCCESS',
    BULK_PATCH_SUCCESS: 'OPP_BULK_PATCH_SUCCESS',
    GET_LOG_SUCCESS: 'OPP_GET_LOG_SUCCESS',
}


export const getList = (filter) => {
    return {
        url: '/api/opportunity',
        params: {
            ...filter
        },
        types: {
            success: types.GET_LIST_SUCCESS,
        }
    };
};

export const getDetail = (id) => {
    return {
        url: '/api/opportunity/' + id,
    };
};

export const create = (data) => {
    return {
        url: '/api/opportunity',
        method: 'post',
        params: {
            ...data
        },
        types: {
            success: types.CREATE_SUCCESS,
        }
    };
};

export const update = (data) => {
    return {
        url: '/api/opportunity/' + data.id,
        method: 'put',
        params: {
            ...data
        },
        types: {
            success: types.UPDATE_SUCCESS,
        }
    };
};

export const updateStep = (target, step) => {
    return {
        url: '/api/opportunity/' + target.id,
        method: 'patch',
        params: {
            stepId: step.id
        },
        meta: {
            opportunity: {
                id: target.id,
                step: target.step,
                stepId: target.stepId,
                probability: target.probability
            },
            step: step
        },
        types: {
            start: types.UPDATE_STEP_START,
            success: types.UPDATE_STEP_SUCCESS,
            error: types.UPDATE_STEP_ERROR
        }
    };
};

export const patch = (id, params) => {
    return {
        url: '/api/opportunity/' + id,
        method: 'patch',
        params: {
            ...params
        },
        meta: id,
        types: {
            success: types.PATCH_SUCCESS,
        }
    }
}

export const remove = (opportunity) => {
    let params = opportunity instanceof Array ? opportunity : [opportunity.id];
    return {
        url: '/api/opportunity',
        method: 'delete',
        meta: { opportunity },
        types: {
            success: types.DELETE_SUCCESS,
        },
        params,
    };
};

export const updateStepBulk = (targets, step) => {
    const meta = {
        opportunities: [],
        step: step
    };
    const ids = [];
    targets.map(target => {
        ids.push(target.id);
        meta.opportunities.push({
            id: target.id,
            step: target.step,
            stepId: target.stepId,
            probability: target.probability
        })
    });
    return {
        url: '/api/opportunity/bulk',
        method: 'patch',
        params: {
            data: {
                stepId: step.id
            },
            ids,
        },
        meta: meta,
        types: {
            start: types.BULK_UPDATE_STEP_START,
            success: types.BULK_UPDATE_STEP_SUCCESS,
            error: types.BULK_UPDATE_STEP_ERROR
        }
    };
};

export const patchBulk = (ids, params) => {
    return {
        url: '/api/opportunity/bulk',
        method: 'patch',
        params: {
            data: { ...params },
            ids,
        },
        meta: ids,
        types: {
            success: types.BULK_PATCH_SUCCESS,
        }
    }
}

export const getLogs = (params) => {
    return {
        url: '/api/log/opportunites',
        params: {
            ...params,
        },
        types: {
            success: types.GET_LOG_SUCCESS,
        }
    }
}