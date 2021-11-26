export const getReports = (filter) => {
    return {
        url: '/api/facebook/report',
        params: {
            ...filter
        }
    };
};