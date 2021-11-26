export const types = {
    GET_TOKEN_SUCCESS: 'VOIP_GET_TOKEN_SUCCESS',
    SET_PHONE_CALL: 'VOIP_SET_PHONE_CALL',
}

export const getToken = (filter) => {
    return {
        url: '/api/voip/token/client',
        params: {
            ...filter
        },
        types: {
            success: types.GET_TOKEN_SUCCESS,
        }
    };
};

export const setPhone = (phone) => {
    return {
        type: types.SET_PHONE_CALL,
        meta: phone
    }
}