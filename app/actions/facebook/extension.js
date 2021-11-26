export const types = {
    SYNC_BULK_UID_SUCCESS: 'FACEBOOK_SYNC_BULK_UID_SUCCESS',
    GET_TOTAL_CUSTOMER_WITHOUT_UID_SUCCESS: 'GET_TOTAL_CUSTOMER_WITHOUT_UID_SUCCESS',
    SET_PROCESS_SEND_MSG_EXTENSION: 'SET_PROCESS_SEND_MSG_EXTENSION',
    STOP_PROCESS_SEND_MSG_EXTENSION: 'STOP_PROCESS_SEND_MSG_EXTENSION',
    SET_START_SENDING_MSG_EXTENSION: 'SET_START_SENDING_MSG_EXTENSION ',
    SET_STOP_SENDING_MSG_EXTENSION: 'SET_STOP_SENDING_MSG_EXTENSION ',
    GET_CUSTOMERS_CAMPAIGN_FROM_EXTENSION_SUCCESS: 'GET_CUSTOMERS_CAMPAIGN_FROM_EXTENSION_SUCCESS',
    REMOVE_CUSTOMER_SENT_SUCCESS: 'REMOVE_CUSTOMER_SENT_SUCCESS',
    UPDATE_STATUS_CAMPAIGN_SUCCESS: 'UPDATE_STATUS_CAMPAIGN_SUCCESS',
}

export const getList = (filter) => {
    return {
        url: '/api/facebook/extension/uid/bulk',
        params: filter,
        types: {
            success: types.GET_LIST_SUCCESS,
        }
    };
};

export const syncBulkUId = (pageId, next = false, data) => {
    return {
        url: `/api/facebook/extension/uid/bulk/${pageId}?next=${next}`,
        method: 'post',
        params: data,
        types: {
            success: types.SYNC_BULK_UID_SUCCESS,
        }
    };
};

export const getTotalCustomerWithoutUId = (pageId) => {
    return {
        url: `/api/facebook/extension/uid/total/widthout/${pageId}`,
        method: 'get',
        types: {
            success: types.GET_TOTAL_CUSTOMER_WITHOUT_UID_SUCCESS,
        }
    };
};


export const setStartProcessSendMsgExtension = (timeStart) => {
    return {
        type: types.SET_PROCESS_SEND_MSG_EXTENSION,
        timeStart
    };
};

export const setStopProcessSendMsgExtension = () => {
    return {
        type: types.STOP_PROCESS_SEND_MSG_EXTENSION,
    };
};



export const setStartSendingMsgExtension = () => {
    return {
        type: types.SET_START_SENDING_MSG_EXTENSION
    };
};


export const setStopSendingMsgExtension = () => {
    return {
        type: types.SET_STOP_SENDING_MSG_EXTENSION
    };
};

export const getCustomersCampaignFromExtension = (id,offset = 1) => {
    return {
        url: `/api/facebook/extension/send/${id}?offset=${offset}`,
        method: 'post',
        types: {
            success: types.GET_CUSTOMERS_CAMPAIGN_FROM_EXTENSION_SUCCESS
        }
    };
};

export const fillStatusMessage = (campaignId,data) => {
    return {
        url: `/api/facebook/extension/fill-status/${campaignId}`,
        method: 'post',
        params: data
    };
};

export const updateStatusCampaign = (campaignId,data) => {
    return {
        url: `/api/facebook/extension/campaign/${campaignId}`,
        method: 'put',
        params: data,
        types: {
            success: types.UPDATE_STATUS_CAMPAIGN_SUCCESS
        }
    };
};

export const removeCustomerSent = (customerId) => {
    return {
        type: types.REMOVE_CUSTOMER_SENT_SUCCESS,
        customerId
    };
};


export const cancelSyncUId = (key) => {
    return {
        url: `/api/facebook/extension/uid/cancel/${key}`
    };
};