export const realTime = () => {
    return {
        url: '/api/wifi/realtime',
    };
};

export const getReport = (filter) => {
    return {
        url: '/api/wifi/report',
        params: {
            ...filter
        },
    };
};

export const getDashboard = () => {
    return {
        url: '/api/wifi/dashboard',
    };
};
export const getUserRange = (filter) => {
    return {
        url: '/api/wifi/usersrange',
        params: {
            ...filter
        },
    };
};
