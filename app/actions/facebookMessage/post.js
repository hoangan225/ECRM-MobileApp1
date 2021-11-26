import { isNull } from "lodash";

export const types = {
    GET_LIST_POST_SUCCESS: 'GET_LIST_POST_SUCCESS',
    DOWNLOAD_NUMBER: 'DOWNLOAD_NUMBER',
    DOWNLOAD_COMMENT: 'DOWNLOAD_COMMENT',
    GET_COMMENT: "GET_COMMENT",
    COUNT_PHONE: 'COUNT_PHONE',
    GET_PHONE:'GET_PHONE',
}


export const getListPost = (pageId, page, pageSize, offSound, hidenComment, filter, checkbox, search,orderBy) => {
    return {
        url: `/api/conversations/feed?pageId=${pageId}&page=${page}&ps=${pageSize}&hide=${hidenComment ? hidenComment : null}&isdel=false&skip=${offSound ? offSound : null}&ads=${checkbox ? checkbox : false}&fromdate=${filter ? filter.fromDate : null}&todate=${filter ? filter.toDate : null}&s=${search ? search :''}&n=${orderBy ? orderBy:''}`,
        types: {
            success: types.GET_LIST_POST_SUCCESS,
        }
    };
};



export const getPhoneNumber = (postId, pageId) => {
    return {
        url: `/api/conversations/feed/comment/phone?pageId=${pageId}&postId=${postId}`,

        types: {
            success: types.GET_PHONE_NUMBER,
        }
    };

};

export const getComment = (pageId, postId,page,pagesize) => {
    return {
        url: `/api/conversations/feed/comment?pageId=${pageId}&postId=${postId}&page=${page}&pagesize=${pagesize}`,

        types: {
            success: types.GET_COMMENT,
        }
    }
}

export const getPhone = (pageId, postId,page,pagesize) => {
    // https://localhost:5001/api/conversations/feed/comment/phone?pageId=8&postId=108887630884763_138069607966565
    return {
        url: `/api/conversations/feed/comment/phone?pageId=${pageId}&postId=${postId}&page=${page}&pagesize=${pagesize}`,

        types: {
            success: types.GET_PHONE,
        }
    }
}

export const downloadComment = (postId, pageId) => {
    return {
        url: `/api/excel/comment?postId=${postId}&pageId=${pageId}`,
        types: {
            success: types.DOWNLOAD_COMMENT,
        }
    }
}
export const downloadPhone = (postId, pageId) => {
    return {

        url: `/api/excel/phone?postId=${postId}&pageId=${pageId}`,
        types: {
            success: types.DOWNLOAD_NUMBER,
        },


    }
}


export const hideComment = (postId, pageId, data) => {

    return {
        url: `/api/conversations/feed/hide-comment/${postId}?pageId=${pageId}`,
        method: 'post',
        params: {
            ...data
        },
    };
};
export const skipComment = (postId, pageId, data) => {

    return {
        url: `/api/conversations/feed/skip-comment/${postId}?pageId=${pageId}`
        ,
        method: 'post',
        params: {
            ...data
        },

    };
};
export const UnSkipComment = (postId, pageId) => {
    return {
        url: `/api/conversations/feed/skip-comment/${postId}?pageId=${pageId}`,
        method: 'delete'
    };
};

export const UnHidenComment = (postId, pageId) => {
    return {
        url: `/api/conversations/feed/hide-comment/${postId}?pageId=${pageId}`,
        method: 'delete'
    };
};
