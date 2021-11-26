exports.import = (params) => {
    return {
        url: '/api/facebook/import',
        params: params,
        method: 'post'
    };
};
