export const types = {
    GET_LIST_SUCCESS: 'KOPO_BOOKING_GET_LIST_SUCCESS',
    UPDATE_SUCCESS: 'KOPO_BOOKING_UPDATE_SUCESS',
}

export const getList = (filter) => {
    return {
        url: '/api/kopo/bookings',
        params: {
            ...filter
        },
        types: {
            success: types.GET_LIST_SUCCESS,
        }
    };
};

export const reject = (data) => {
    return {
        url: '/api/kopo/bookings/' + data.id + '/reject',
        method: 'post',
        params: {
            ...data
        },
        types: {
            success: types.UPDATE_SUCCESS,
        }
    };
};
export const accept = (data) => {
    return {
        url: '/api/kopo/bookings/' + data.id + '/accept',
        method: 'post',
        params: {
            ...data
        },
        types: {
            success: types.UPDATE_SUCCESS,
        }
    };
};