export const types = {
    GET_LIST_SUCCESS: 'WIFI_CUSTOMER_GET_LIST_SUCCESS',
}

export const getList = (filter) => {
    return {
        url: '/api/wifi/customer',
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
        url: '/api/wifi/customer/' + id,
    };
};
