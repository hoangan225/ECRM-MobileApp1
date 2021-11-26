// export const types = {
//     GET_LIST_ORDER_SUCCESS: "FACEBOOK_GET_LIST_ORDER_SUCCESS",
//     GET_DETAILT_ORDER_SUCCESS: "FACEBOOK_GET_DETAILT_ORDER_SUCCESS",
//     CREATE_ORDER_SUCCESS: "FACEBOOK_CREATE_ORDER_SUCCESS",
//     UPDATE_ORDER_SUCCESS: "FACEBOOK_UPDATE_ORDER_SUCCESS",
//     GET_LIST_ORDER_PHONE_SUCCESS: "FACEBOOK_GET_LIST_ORDER_PHONE_SUCCESS",
//     GET_ORDER_AUTO_FACEBOOK_SUCCESS: "GET_ORDER_AUTO_FACEBOOK_SUCCESS",
//     DELETE_ORDER_AUTO_FACEBOOK_SUCCESS: "DELETE_ORDER_AUTO_FACEBOOK_SUCCESS",
//     REALTIME_AUTO_ORDER: "FACEBOOK_REALTIME_AUTO_ORDER",
//     DELETE_SUCCESS: "FACEBOOK_ORDER_DELETE_SUCCESS",
//     UPDATE_SUCCESS: "FACEBOOK_ORDER_UPDATE_SUCCESS",
//     DELETE_ORDER_PHONE_SUCCESS: "FACEBOOK_DELETE_ORDER_PHONE_SUCCESS",
//     UPDATE_ORDER_CUSTOMER_SUCCESS: "UPDATE_ORDER_CUSTOMER_SUCCESS"
// }

export const getAutoOrder = (pageId, conversationId) => {
    return {
        url: `/api/conversations/automation-order?pageId=${pageId}&conversationId=${conversationId}`,
    }
}
export const deleteOrder = (orderId, pageId) => {
    return {
        url: `/api/conversations/automation-order/${orderId}?pageId=${pageId}`,
        method: "delete",
    }
}
export const createOrder = (data, conversationId) => {
    return {
        url: '/api/orders?conversationId=' + conversationId,
        method: 'post',
        params: {
            ...data
        },
    };
};

export const updateOrder = (data, conversationId) => {
    return {
        url: '/api/orders/automation/' + data.id,
        method: 'put',
        params: {
            ...data
        },
    };
};
export const getOrders = (params) => ({
    url: "/api/customers/orders",
    params,
});
export const getDetailtOrders = (id) => ({
    url: `/api/invoices/${id}/details`,
});

export const getOrdersPhone = (params) => ({
    url: "/api/customers/orders",
    params,
});
export const realtimeAutoOrder = (data) => ({
    data,
    type: types.REALTIME_AUTO_ORDER,
});
export const remove = (id) => {
    return {
        url: '/api/orders/' + id,
        method: 'delete',
        meta: id,
    };
};
export const removeOrderPhone = (id) => {
    return {
        url: '/api/orders/' + id,
        method: 'delete',
        meta: id,
    };
};
export const update = (data) => {
    return {
        url: '/api/orders/' + data.id,
        method: 'put',
        params: {
            ...data
        },
    };
};
export const updateOrderCustomer = (data) => {
    return {
        url: '/api/orders/' + data.id,
        method: 'put',
        params: {
            ...data
        },
    };
};