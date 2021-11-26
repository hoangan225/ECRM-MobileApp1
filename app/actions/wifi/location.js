export const types = {
    GET_LIST_SUCCESS: 'WIFI_LOCATION_GET_LIST_SUCCESS',
}

export const getList = () => {
    return {
        url: '/api/wifi/location',
        types: {
            success: types.GET_LIST_SUCCESS,
        }
    };
};
