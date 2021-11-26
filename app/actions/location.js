export const types = {
    GET_LIST_SUCCESS: 'LOCATION_GET_LIST_SUCCESS',
}

const host = "https://services.ecrm.vn";

export const getList = (filter) => {
    return {
        host,
        url: '/api/locations',
        params: {
            ...filter
        }
    };
};

export const getItem = (id) => {
    return {
        host,
        url: '/api/locations/' + id
    };
};

export const getAddress = (wardId, districtId, provinceId) => {
    return {
        host,
        params: { wardId, districtId, provinceId },
        url: '/api/locations/address'
    };
};

