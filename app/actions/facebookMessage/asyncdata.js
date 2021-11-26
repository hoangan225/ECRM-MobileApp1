export const types = {

};

export const startImportTag = (pageId,data) => {
    return {
        url: '/api/tags/actions/import/' + pageId,
        method: 'post',
        params: data
    }
};

export const startAsyncTagPancake = (pageId,data) => {
    return {
        url: '/api/tags/actions/async/tag-pancake/' + pageId,
        method: 'post',
        params: data
    }
};


export const cancelImportTag = (key) => {
    return {
        url: '/api/tags/actions/cancel-import',
        method: 'post',
        params: { importKey: key }
    };
};

