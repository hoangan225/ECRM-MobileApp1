export const getList = () => {
    return {
        url: '/api/conversations/auto-order/config',
        method: 'get',
    };
}
export const create = (params) => {
    return {
        url: `/api/conversations/auto-order/config?${params}`,
        method: 'post',
    };
}