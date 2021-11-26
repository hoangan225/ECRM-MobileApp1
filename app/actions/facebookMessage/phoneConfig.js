
export const getList = () => {
    return {
        url: '/api/conversations/phone',
        method: 'get',
    };
}
export const create = (params) => {
    return {
        url: '/api/conversations/phone',
        params: params,
        method: 'post',
    };
}