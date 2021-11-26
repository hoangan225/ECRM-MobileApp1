export const types = {
    GET_CODE_SUCCESS: 'REFUND_GET_CODE_SUCCESS',
    CONFIRM_SUCCESS: 'REFUND_CONFIRM_SUCCESS',
}

export const searchCode = (code) => {
    // console.log('getList: ', code)
    return {
        url: '/api/orders/' + code,
        types: {
            success: types.GET_CODE_SUCCESS,
        }
    };
};

export const confirm = (code) => {
    return {
        url: '/api/orders/' + code + '/confirm-returned',
        method: 'post',
        types: {
            success: types.CONFIRM_SUCCESS,
        }
    };
};

