export const types = {
    GET_LIST_SUCCESS: 'KOPO_COUPON_GET_LIST_SUCCESS',
    UPDATE_SUCCESS: 'KOPO_COUPON_UPDATE_SUCESS',
}

export const getItem = (code) => {
    return {
        url: '/api/kopo/coupons/' + code
    };
};

export const checkout = (data) => {
    return {
        url: '/api/kopo/coupons/' + data.id + '/checkout',
        method: 'put',
        params: {
            ...data
        }
    };
};
