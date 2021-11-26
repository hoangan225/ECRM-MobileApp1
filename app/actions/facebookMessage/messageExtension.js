export const TYPE_EXTENSIONS = {
    FACEBOOK: 'm.facebook.com',
    GOOGLE: '',
    INSTAGRAM: '',
    AMAZON: '',
    SHOPEE: '',
}

export const FACEBOOK_PARAM = {
    globalUserId: null
}

export const REPORT_EXTENSION_STATUS = {
    connectionStatus: {
        facebook: false
    }
};

let count_check = 0;

window.postMessage({
    type: "CHECK_EXTENSION_VERSION",
    data: {}
}, window.origin)

window.postMessage({
    type: "CHECK_EXTENSION",
    data: {}
}, window.origin)

count_check++;


window.addEventListener('message', function (event) {
    const data = event.data.data;
    if (event.data && data) {
        switch (data.type) {
            case "EXTENSION_VERSION":
                // console.log("EXTENSION_VERSION FROM WEB")
                break;
            case "REPORT_EXTENSION_STATUS":
                // console.log("REPORT_EXTENSION_STATUS FROM WEB")
                REPORT_EXTENSION_STATUS.connectionStatus.facebook = data.connectionStatus[TYPE_EXTENSIONS.FACEBOOK];
                FACEBOOK_PARAM.globalUserId = data.globalUserId;
                break;
            case "SET_ACCESS_TOKEN":
                // console.log("FROM WEB: SET_ACCESS_TOKEN");
                break;
            case "PRELOAD_DOC_IDS":
                // console.log("FROM WEB: PRELOAD_DOC_IDS");
                break;
            case "SEND_TEXT":
                // console.log("FROM WEB: SEND_TEXT");
                break;
            case "SEND_PHOTO":
                // console.log("FROM WEB: SEND_PHOTO");
                break;

            default:
                break;
        }
    }

});

export const checkExtensionFacebookAble = () => {
    return REPORT_EXTENSION_STATUS.connectionStatus.facebook;
}

export const preloadDocIds = (data) => {
    window.postMessage({
        type: "PRELOAD_DOC_IDS",
        data: data
    })
};

export const preInitializePages = (data) => {
    window.postMessage({
        type: "PREINITIALIZE_PAGES",
        data: data
    })
};

export const getProfileInfo = (data) => {
    window.postMessage({
        type: "GET_PROFILE_INFO",
        data: data
    })
};

export const sendText = (data) => {
    // console.log(data, "FROM NOBITA SEND TEXT");
    window.postMessage({
        type: "SEND_TEXT",
        data: data
    })
};

export const getListUId = (data) => {
    window.postMessage({
        type: "GET_LIST_UID",
        data: data
    })
};


export const startSendBulkMessage = (data) => {
    window.postMessage({
        type: "START_SEND_BULK_MESSAGE",
        data
    })
};

export const stopSendBulkMessage = () => {
    window.postMessage({
        type: "STOP_SEND_BULK_MESSAGE"
    })
};

export const cancelSendBulkMessage = () => {
    window.postMessage({
        type: "CANCEL_SEND_BULK_MESSAGE"
    })
};

export const pauseSendBulkMessage = () => {
    window.postMessage({
        type: "PAUSE_SEND_BULK_MESSAGE"
    })
};

export const continueSendBulkMessage = () => {
    window.postMessage({
        type: "CONTINUE_SEND_BULK_MESSAGE"
    })
};

export const sendBulkMessage = (data) => {
    window.postMessage({
        type: "SEND_BULK_MESSAGE",
        data: data
    })
};
