export const getInboxs = (filter) => ({
    url: '/api/facebook/noad/inboxs',
    params:{
        ...filter
    }
})

export const getComments = (filter) => ({
    url: '/api/facebook/noad/comments',
    params:{
        ...filter
    }
})
