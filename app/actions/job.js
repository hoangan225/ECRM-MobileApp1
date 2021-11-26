export const types = {
    GET_LIST_SUCCESS: 'JOB_GET_LIST_SUCCESS',
    CREATE_SUCCESS: 'JOB_CREATE_SUCCESS',
    UPDATE_SUCCESS: 'JOB_UPDATE_SUCESS',
    DELETE_SUCCESS: 'JOB_DELETE_SUCCESS',
    CHANGE_VIEW_SUCCESS: 'JOB_CHANGE_VIEW_SUCCESS',
    CHANGE_STATUS_START: 'JOB_CHANGE_STATUS_START',
    CHANGE_STATUS_ERROR: 'JOB_CHANGE_STATUS_ERROR',
    GET_WIDGET_SUCCESS: 'JOB_GET_WIDGET_SUCCESS',
}


export const getList = (filter) => {
    // // console.log('filter', filter)
    return {
        url: '/api/jobs',
        types: {
            success: types.GET_LIST_SUCCESS,
        },
        params: {
            ...filter,
            viewId: 5
        }
    };
};

export const getListCalendar = (filter) => {
    return {
        url: '/api/jobs/calendar',
        params: {
            ...filter
        }
    };
};

export const search = (filter) => {
    return {
        url: '/api/jobs',
        params: {
            ...filter
        },
    };
};

export const create = (data) => {
    // // console.log('data: ', data)
    return {
        url: '/api/jobs',
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
        url: '/api/jobs/' + data.id,
        method: 'put',
        params: {
            ...data
        },
        types: {
            success: types.UPDATE_SUCCESS,
        }
    };
};

export const updateFinish = (id) => {
    return {
        url: '/api/jobs/updateFinish?id=' + id,
        method: 'put',
        params: {
            id
        },
        types: {
            success: types.UPDATE_SUCCESS,
        }
    };
};

export const remove = (id) => {
    return {
        url: '/api/jobs/' + id,
        method: 'delete',
        meta: id,
        types: {
            success: types.DELETE_SUCCESS,
        }
    };
};

export const getDetails = (id) => {
    return {
        url: '/api/jobs/' + id,
        meta: id,
    };
}

export const getReports = (id) => {
    return {
        url: '/api/jobs/' + id + '/reports',
    };
}

export const report = (id, report) => {
    // // console.log('actjob', id);
    // // console.log('actjobreport', report);

    return {
        url: '/api/jobs/' + id + '/reports',
        params: {
            ...report
        },
        method: 'post'
    };
}

export const removeReport = (id, reportId) => {
    return {
        url: '/api/jobs/' + id + '/reports/' + reportId,
        method: 'delete'
    };
}


export const changeView = id => {
    return {
        type: types.CHANGE_VIEW_SUCCESS,
        id
    }
}

export const updateStatus = (job, status) => {
    return {
        url: '/api/jobs/' + job.id + '/status',
        method: 'put',
        params: {
            statusId: status.id
        },
        meta: {
            job: { id: job.id, statusId: job.statusId, statusName: job.statusName },
            status
        },
        types: {
            start: types.CHANGE_STATUS_START,
            error: types.CHANGE_STATUS_ERROR
        }
    };
}