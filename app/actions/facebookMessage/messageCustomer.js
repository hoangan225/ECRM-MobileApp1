
export const getListConversations = (page, customerId) => {
    return {
        url: `/api/conversations/customer/${customerId}?page=${page}`,
    };
};
export const getListConversationsSibling = (page, customerId) => {
    return {
        url: `/api/conversations/customer-sibling/${customerId}?page=${page}`,
    };
};
export const getConversationInbox = (conversationId, pageId, page, pageSize) => {
    return {
        url: `/api/conversations/${conversationId}/message?pageId=${pageId}&page=${page}&pageSize=${pageSize}`,
    };
}
export const getConversationComment = (conversationId, pageId, page, pageSize) => {
    return {
        url: `/api/conversations/${conversationId}/comment?pageId=${pageId}&page=${page}&pageSize=${pageSize}`,
    };
}
export const removeConversation = (id) => {
    return {
        id
    }
}
export const getConversationInboxScroll = (conversationId, pageId, page) => {
    return {
        url: `/api/conversations/${conversationId}/message?pageId=${pageId}&page=${page}`,
    };
}
export const getConversationCommentScroll = (conversationId, pageId, page) => {
    return {
        url: `/api/conversations/${conversationId}/comment?pageId=${pageId}}&page=${page}`,
    };
}
export const getCustomerSources = (id) => {
    return {
        url: `/api/conversations/customer/sources/${id}`,
    }
}