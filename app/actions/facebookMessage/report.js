export const types = {
    GET_LIST_GERENA_SUCCESS: "GET_LIST_GERENA_SUCCESS",
    GET_LIST_QUANTITY_SUCCESS: "GET_LIST_QUANTITY_SUCCESS",
    GET_LIST_RANK_SUCCESS: "GET_LIST_RANK_SUCCESS",
    GET_LIST_TAG_SUCCESS: "GET_LIST_TAG_SUCCESS",
    GET_LIST_REACTION_SUCCESS: "GET_LIST_REACTION_SUCCESS",
    GET_LIST_TAG_VIEW_SUCCESS: "GET_LIST_TAG_VIEW_SUCCESS",
    GET_LIST_SEARCH_POST_SUCCESS: "GET_LIST_SEARCH_POST_SUCCESS",
    GET_LIST_SALES_SUCCESS: "GET_LIST_SALES_SUCCESS",
    GET_LIST_VIEW_SALES_SUCCESS: "GET_LIST_VIEW_SALES_SUCCESS",
    GET_LIST_REACTION__POST_SUCCESS: "GET_LIST_REACTION__POST_SUCCESS",
    GET_LIST_USER: "GET_LIST_USER",
    GET_ORDER_SUCCESS: "GET_ORDER_SUCCESS",
    GET_LIST_CUSTOMER_SUCCESS: "GET_LIST_CUSTOMER_SUCCESS",
    GET_DATA_INBOX_LAST_MONTH: 'GET_DATA_INBOX_LAST_MONTH'
};

export const getListGarena = (pageId, filter) => {
    return {
        url: `/api/conversations/report?fromDate=${filter.fromDate}&todate=${filter.toDate}&pageids=${pageId}`,
        types: {
            success: types.GET_LIST_GERENA_SUCCESS,
        },
    };
};

export const getListQuantity = (pageId, filter) => {
    if (pageId) {
        const ad = pageId.id ? pageId.id.join("&pageids=") : null;
        // const IdPage = ad.join("&pageids=");
        return {
            url: `/api/conversations/report/feedback?fromDate=${filter.fromDate}&todate=${filter.toDate}&pageids=${ad}`,
            types: {
                success: types.GET_LIST_QUANTITY_SUCCESS,
            },
        };
    } else {
        return {
            url: `/api/conversations/report/feedback?fromDate=${filter.fromDate}&todate=${filter.toDate}`,
            types: {
                success: types.GET_LIST_QUANTITY_SUCCESS,
            },
        };
    }
};

export const getListRank = (pageId, filter) => {
    return {
        url: `/api/conversations/report/employee/rank?fromDate=${filter.fromDate}&todate=${filter.toDate}&pageids=${pageId}`,
        types: {
            success: types.GET_LIST_RANK_SUCCESS,
        },
    };
};
export const getListTag = (filter) => {
    const pageIds = filter.pageIds?.length > 0 ? filter.pageIds.join("&pageids=") : null;
    return {
        url: `/api/conversations/report/tag?fromDate=${filter.fromDate}&todate=${filter.toDate}&pageids=${pageIds}`,
        types: {
            success: types.GET_LIST_TAG_SUCCESS,
        },
    };
};

export const getListTagView = (filter) => {
    const pageIds = filter.pageIds?.length > 0 ? filter.pageIds.join("&pageids=") : null;
    return {
        url: `/api/conversations/report/tag/day?fromDate=${filter.fromDate}&todate=${filter.toDate}&pageids=${pageIds}`,
        types: {
            success: types.GET_LIST_TAG_VIEW_SUCCESS,
        },
    };
};

export const getListReaction = (page, filter) => {
    return {
        url: `/api/conversations/report/reaction?fromDate=${filter.fromDate}&todate=${filter.toDate}&pageids=${page}`,
        types: {
            success: types.GET_LIST_REACTION_SUCCESS,
        },
    };
};

export const getlistReactionPost = (
    pageId,
    filter,
    checkbox,
    page,
    pageSize
) => {
    return {
        url: `/api/conversations/report/reaction/post?fromDate=${filter.fromDate}&todate=${filter.toDate}&pageids=${pageId}&page=${page}&pageSize=${pageSize}&postHasAds=${checkbox}`,
        types: {
            success: types.GET_LIST_REACTION__POST_SUCCESS,
        },
    };
};

export const getListSalse = (pageSearch, filter) => {
    return {
        url: `/api/conversations/report/revenue?fromDate=${filter.fromDate}&todate=${filter.toDate}&pageids=${pageSearch}`,
        types: {
            success: types.GET_LIST_SALES_SUCCESS,
        },
    };
};

export const getListViewSalse = (pageSearch, filter) => {
    // &userids=${userSearch}
    return {
        url: `/api/conversations/report/revenue/employee?fromDate=${filter.fromDate}&todate=${filter.toDate}&pageids=${pageSearch}`,
        types: {
            success: types.GET_LIST_VIEW_SALES_SUCCESS,
        },
    };
};
export const getListSalsePost = (
    pageSearch,
    filter,
    page,
    pageSize,
    checkbox
) => {
    return {
        url: `/api/conversations/report/revenue/post?fromDate=${filter.fromDate
            }&todate=${filter.toDate
            }&pageids=${pageSearch}&page=${page}&pageSize=${pageSize}&postHasAds=${checkbox ? checkbox : false
            }`,
    };
};

export const search = (target, PageId) => {
    if (PageId) {
        const ad = PageId.id;
        const page = ad.join("&pageId=");
        return {
            url: `/api/conversations/feed?pageId=${page}`,
            types: {
                success: types.GET_LIST_SEARCH_POST_SUCCESS,
            },
        };
    } else {
        return {
            url: `/api/conversations/feed`,
            types: {
                success: types.GET_LIST_SEARCH_POST_SUCCESS,
            },
        };
    }
};

export const getListUser = () => {
    return {
        url: `/api/conversations/report/user`,
        types: {
            success: types.GET_LIST_USER,
        },
    };
};

export const reportByRevenue = (filter) => {
    return {
        url: "/api/conversations/report/revenueT",
        params: {
            ...filter,
        },
    };
};

export const getOrderSuccess = (filter) => {
    return {
        url: "/api/conversations/report/order",
        prams: {
            ...filter,
        },
    };
};

export const getCustomerSuccess = (filter) => {
    return {
        url: "/api/conversations/report/reaction/customer",
        params: {
            ...filter,
        },
    };
};

export const getPhoneSuccess = filter => {
    return {
        url: "/api/conversations/report/phone",
        params: {
            ...filter
        }
    };
}

export const getDataInboxLastMonth = filter => {
    return {
        url: '/api/conversations/report/inbox/v2',
        params: {
            ...filter
        }
    }
}

export const getDataPhoneLastMonth = filter => {
    return {
        url: '/api/conversations/report/phone/v2',
        params: {
            ...filter
        }
    }
}

export const getDataNewPhoneLastMonth = filter => {
    return {
        url: '/api/conversations/report/phone/new/v2',
        params: {
            ...filter
        }
    }
}

export const getDataNewOrderLastMonth = filter => {
    return {
        url: '/api/conversations/report/order/new/v2',
        params: {
            ...filter
        }
    }
}

export const getDataCustomerLastMonth = filter => {
    return {
        url: '/api/conversations/report/customer/v2',
        params: {
            ...filter
        }
    }
}

export const getDataCustomerNewLastMonth = filter => {
    return {
        url: '/api/conversations/report/customer/new/v2',
        params: {
            ...filter
        }
    }
}
export const getDataCustomerReactionToday = filter => {
    return {
        url: '/api/conversations/report/employee/reaction/onday/v2',
        params: {
            ...filter
        }
    }
}

export const getDataMessagePerDay = filter => {
    return {
        url: '/api/conversations/report/message/hour/v2',
        params: {
            ...filter
        }
    }
}

export const getCountMessagePerMonth = filter => {
    return {
        url: '/api/conversations/report/message/permonth/count/v2',
        params: {
            ...filter
        }
    }
}

export const getTagOftenToDay = filter => {
    return {
        url: '/api/conversations/report/tag/often/today',
        params: {
            ...filter
        }
    }
}

export const getTagTopToDay = filter => {
    return {
        url: '/api/conversations/report/tag/top/today',
        params: {
            ...filter
        }
    }
}

export const getTagTopPerMonth = filter => {
    return {
        url: '/api/conversations/report/tag/top/permonth',
        params: {
            ...filter
        }
    }
}

export const getTagToDay = filter => {

    return {
        url: `/api/conversations/report/tag/today`,
        params: {
            ...filter
        }
    }
}

export const getMessagePerHour = filter => {
    return {
        url: '/api/conversations/report/message/hour',
        params: {
            ...filter
        }
    }
}

export const getCustomerPerHour = filter => {
    return {
        url: '/api/conversations/report/customer/hour',
        params: {
            ...filter
        }
    }
}

export const getCustomerPerDay = filter => {
    return {
        url: '/api/conversations/report/customer/day/v2',
        params: {
            ...filter
        }
    }
}

export const getPhonePerHour = filter => {
    return {
        url: '/api/conversations/report/phone/hour',
        params: {
            ...filter
        }
    }
}

export const getOrderPerHour = filter => {
    return {
        url: '/api/conversations/report/order/hour',
        params: {
            ...filter
        }
    }
}

export const getMessagePerEmployees = filter => {
    return {
        url: '/api/conversations/report/employee',
        params: {
            ...filter
        }
    }
}

export const getMessageReactionPerHour = filter => {
    return {
        url: '/api/conversations/report/employee/hour',
        params: {
            ...filter
        }
    }
}



export const getMessageAboutDays = filter => {
    return {
        url: '/api/conversations/report/message/day/v2',
        params: {
            ...filter
        }
    }
}



