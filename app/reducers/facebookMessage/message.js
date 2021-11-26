// import item from '@/pages/automation/components/actions/item';
// import message from '@/pages/customer/detail/tabs/message/message';
import moment from 'moment';
import { types } from '../../actions/facebookMessage/message';
const initState = {
    conversations: null,
    conversation: null,
    conversationTags: [],
    message: null,
    messageCustumer: null,
    fbUserId: null,
    fbLogin: false,
    fbPosts: null,
    fbUser: null,
    customerAutoOrder: null,
    conversationassigned: null,
    user: [],
    profilePage: null,
    configPage: null,
    configConversation: null,
    mergePages: [],
    checkMerge: false,
    thumbtackTags: false,
    optionPhones: [],
    listPages: [],
    firstLoad: false,
    goBack: false,
    ableRefreshMessage: true
};

export default (state = initState, action) => {
    var index;
    var result;
    var splice;
    var newMessage;
    var checkFilter;
    var size = 500;
    var checkHandle = false;
    var checkNotHandle = false;
    var checkTags = false;
    var unRead = false;
    var listConversationId = [];
    var listId = [];
    switch (action.type) {
        case types.SET_PAGE_ID:
            return {
                ...state,
                profilePage: action.data
            }
        case types.GET_LIST_PAGE:
            state.listPages = action.data;
            return {
                ...state,
            }
        case types.GET_LIST_CONVERSATIONS_SUCCESS:
            state.checkMerge = false;
            state.goBack = false;
            return {
                ...state,
                conversations: action.data,
                fbUser: action.data.users
            }
        case types.GET_LIST_SCROLL_CONVERSATIONS_SUCCESS:
            listConversationId = state.conversations.items.map(item => { return item.conversationId });
            newMessage = action.data.items.filter(item => !listConversationId.includes(item.conversationId));
            state.conversations.items = [...state.conversations.items, ...newMessage];
            return {
                ...state
            }
        case types.GET_CONVERSATION_INBOX_SUCCESS:
            state.firstLoad = true;
            checkHandle = action.meta ? action.meta.some(item => item['isHandle'] == true) : false;
            checkNotHandle = action.meta ? action.meta.some(item => item['isHandle'] == false) : false;
            checkFilter = action.meta ? action.meta.some(item => item['replied'] == false) : false;
            unRead = action.meta ? action.meta.some(item => item['unRead'] == 2) : false;

            if (checkHandle) {
                state.conversations.items = state.conversations.items.filter(item => item.isHandle);
            }
            // đã xử lý
            if (checkNotHandle) {
                state.conversations.items = state.conversations.items.filter(item => !item.isHandle);
            }
            // chưa xử lý
            if (checkFilter) {
                state.conversations.items = state.conversations.items.filter(item => !item.replied);
            }
            // chưa trả lời
            if (unRead) {
                state.conversations.items = state.conversations.items.filter(item => item.conversationStatus == 2);
            }
            // chưa đọc
            if (state.configPage.FbChatGeneralSetting.UnreadFirst) {
                state.conversations.items = state.conversations.items.orderByDesc(y => moment(y.time))
                    .orderByDesc(x => x.conversationStatus);
            }
            // else {
            //     state.conversations.items = state.conversations.items.orderByDesc(y => moment(y.time));
            // }

            index = state.conversations.items.findIndex(item => item.conversationId == action.data.conversationId);
            if (state.conversations.items[index].tags?.length > 0) {
                checkTags = true;
            }
            if (checkTags && state.conversations.items[index].replied) {
                state.conversations.items[index].isHandle = true;
            }
            if (index != -1) {
                state.conversations.items[index].conversationStatus = action.data.conversationStatus;
                if (state.conversations.items[index].unReadCount > 0) {
                    state.conversations.items[index].unReadCount = 0
                }
            }
            return {
                ...state,
                conversation: action.data
            }
        case types.GET_CONVERSATION_CUSTUMER_SUCCESS:
            return {
                ...state,
                messageCustumer: action.data
            }
        case types.CREATE_CONVERSATION_INBOX_SUCCESS:
            checkFilter = action.meta?.optionFilter?.some(item => item['replied'] == false);
            if (state.conversation && state.conversation.conversationId == action.meta.conversationId) {
                result = state.conversation.messages.findIndex(item => item.id == '123456789');
                state.conversation.messages[result] = action.data;
            }
            index = state.conversations.items.findIndex(item => item.conversationId == action.meta.conversationId);
            if (index >= 0) {
                if (state.conversations.items[index].replied == false) {
                    state.conversations.items[index].replied = true;
                }
                state.conversations.items[index].lastMessageContent = action.data.message;
                state.conversations.items[index].time = action.data.createdTime;

                if (state.conversations.items[index].tags?.length > 0) {
                    state.conversations.items[index].isHandle = true;
                }
                if (!state.configPage.FbChatGeneralSetting.UnreadFirst) {
                    splice = state.conversations.items.splice(index, 1);
                    state.conversations.items = [...splice, ...state.conversations.items];
                    state.conversations.items = state.conversations.items.orderByDesc(y => moment(y.time));
                } else {
                    state.conversations.items = state.conversations.items.orderByDesc(y => moment(y.time))
                        .orderByDesc(x => x.conversationStatus);
                }
            }
            // check filter theo bộ lọc
            return {
                ...state
            }
        case types.CREATE_CONVERSATION_INBOX_ERROR:

            index = state.conversations.items.findIndex(item => item.conversationId === action.meta.conversationId);
            if (index >= 0) {
                state.conversations.items[index].isHandle = true;
            }
            state.conversation.messages.map((item, index) => {
                if (item.id == '123456789') {
                    state.conversation.messages[index] = { ...state.conversation.messages[index], error: true }
                }
            })
            return {
                ...state
            }

        case types.SEND_INBOX_MESSAGE_EXTENSION_ERROR:

            index = state.conversations.items.findIndex(item => item.conversationId === action.conversationId);
            if (index >= 0) {
                state.conversations.items[index].isHandle = true;
            }
            state.conversation.messages.map((item, index) => {
                if (item.id == 'from_extension') {
                    state.conversation.messages[index] = { ...state.conversation.messages[index], error: true }
                }
            })
            return {
                ...state
            }

        case types.CREATE_CONVERSATION_INBOX_ACTTACHMENT_SUCCESS:
            checkFilter = action.meta?.optionFilter?.some(item => item['replied'] == false);
            if (state.conversation && state.conversation.conversationId == action.meta.conversationId) {
                newMessage = state.conversation.messages.filter(it => it.id != '12345678910');
                const listIdConv = state.conversation.messages.map(item => item.id);
                if (!listIdConv.includes(action.data.id)) {
                    state.conversation.messages = [...newMessage, action.data];
                } else {
                    state.conversation.messages = [...newMessage];
                }
            }
            index = state.conversations.items.findIndex(item => item.conversationId == action.meta.conversationId);
            if (index >= 0) {
                if (state.conversations.items[index].replied == false) {
                    state.conversations.items[index].replied = true;
                }
                state.conversations.items[index].lastMessageContent = action.data.lastMessageContent;
                state.conversations.items[index].time = action.data.createdTime;

                if (!state.configPage?.FbChatGeneralSetting?.UnreadFirst) {
                    splice = state.conversations.items.splice(index, 1);
                    state.conversations.items = [...splice, ...state.conversations.items];
                }
                if (state.conversations.items[index].tags?.length > 0) {
                    state.conversations.items[index].isHandle = true;
                }
                if (!state.configPage.FbChatGeneralSetting.UnreadFirst) {
                    splice = state.conversations.items.splice(index, 1);
                    state.conversations.items = [...splice, ...state.conversations.items];
                    state.conversations.items = state.conversations.items.orderByDesc(y => moment(y.time));
                } else {
                    state.conversations.items = state.conversations.items.orderByDesc(y => moment(y.time))
                        .orderByDesc(x => x.conversationStatus);
                }
            }
            return {
                ...state
            }
        case types.CREATE_CONVERSATION_INBOX_ACTTACHMENT_ERROR:
            state.conversation.messages.map((item, index) => {
                if (item.id == '12345678910') {
                    state.conversation.messages[index] = { ...state.conversation.messages[index], error: true }
                }
            })
            return {
                ...state
            }
        case types.CREATE_CONVERSATION_COMMENT_ERROR:
            index = state.conversations.items.findIndex(item => item.conversationId === action.meta.conversationId);
            if (index >= 0) {
                state.conversations.items[index].isHandle = true;
            }
            state.conversation.messages.map((item, index) => {
                if (item.id == '123456789') {
                    state.conversation.messages[index] = { ...state.conversation.messages[index], error: true }
                }
            })
            return {
                ...state
            }
        case types.REPLY_COMMENT_SUCCESS:
            checkFilter = action.meta?.optionFilter?.some(item => item['replied'] == false);
            index = state.conversations.items.findIndex(item => item.conversationId == action.meta.conversationId);
            if (index != -1) {
                state.conversations.items[index].lastMessageContent = action.data.lastMessageContent;
                state.conversations.items[index].time = action.data.results[0].createdTime;
                if (state.conversations.items[index].replied == false) {
                    state.conversations.items[index].replied = true;
                }
                if (state.conversations.items[index].tags?.length > 0) {
                    state.conversations.items[index].isHandle = true;
                }
                if (!state.configPage.FbChatGeneralSetting.UnreadFirst) {
                    splice = state.conversations.items.splice(index, 1);
                    state.conversations.items = [...splice, ...state.conversations.items];
                    state.conversations.items = state.conversations.items.orderByDesc(y => moment(y.time));
                } else {
                    state.conversations.items = state.conversations.items.orderByDesc(y => moment(y.time))
                        .orderByDesc(x => x.conversationStatus);
                }
            }
            action.data.results.map((it) => {
                it.quote = action.meta.quote;
                it.unReadCount = 0;
            })
            if (state.conversation && state.conversation.conversationId == action.meta.conversationId) {
                newMessage = state.conversation.messages.filter(it => it.id != '123456789');
                state.conversation.messages = [...newMessage, ...action.data.results];
            }
            return {
                ...state
            }
        case types.REPLY_COMMENT_ERROR:
            state.conversation.messages.map((item, index) => {
                if (item.id == '123456789') {
                    state.conversation.messages[index] = { ...state.conversation.messages[index], error: true }
                }
            })
            return {
                ...state
            }
        case types.CREATE_CONVERSATION_COMMENT_SUCCESS:
            checkFilter = action.meta?.optionFilter?.some(item => item['replied'] == false);
            result = state.conversations.items.findIndex(item => item.conversationId == action.meta.conversationId);
            if (result >= 0) {
                if (state.conversations.items[result].replied == false) {
                    state.conversations.items[result].replied = true;
                }
                state.conversations.items[result].lastMessageContent = action.data.lastMessageContent;
                state.conversations.items[result].time = action.data.results[0].createdTime;

                if (state.conversations.items[result].tags?.length > 0) {
                    state.conversations.items[result].isHandle = true;
                }
                if (!state.configPage.FbChatGeneralSetting.UnreadFirst) {
                    splice = state.conversations.items.splice(result, 1);
                    state.conversations.items = [...splice, ...state.conversations.items];
                    state.conversations.items = state.conversations.items.orderByDesc(y => moment(y.time));
                } else {
                    state.conversations.items = state.conversations.items.orderByDesc(y => moment(y.time))
                        .orderByDesc(x => x.conversationStatus);
                }
            }
            if (state.conversation && state.conversation.conversationId == action.meta.conversationId) {
                const listIdConv = state.conversation.messages.map(item => item.id);
                const filter = action.data.results.filter(item => !listIdConv.includes(item.id));
                newMessage = state.conversation.messages.filter(it => it.id != '123456789');

                if (filter.length > 0) {
                    const resultsReverse = [...filter].reverse();
                    state.conversation.messages = [...newMessage, ...resultsReverse];
                } else {
                    state.conversation.messages = [...newMessage];
                }
            }
            return {
                ...state,
            }
        case types.GET_ALL_CONVERSATION_SUCCCESS:
            return {
                ...state,
                conversations: action.data
            }
        case types.GET_CONVERSATION_TAGS_SUCCESS:
            state.conversationTags = action.data;
            return {
                ...state,
            }
        case types.CHANGE_STATUS_CONVERSATION_SUCCESS:
            index = state.conversations.items.findIndex(item => item.conversationId == action.data.conversation.conversationId);
            // console.log(index, "indexindex")
            if (state.conversation) {
                state.conversation.conversationStatus = action.data.conversation.conversationStatus;
            }
            if (index != -1) {
                state.conversations.items[index].conversationStatus = action.data.conversation.conversationStatus;
                if (action.data.conversation.conversationStatus == 2) {
                    state.conversations.items[index].unReadCount += 1;
                    state.conversations.items[index].isHandle = false;
                } else {
                    state.conversations.items[index].unReadCount = 0;
                }
            }
            return {
                ...state
            }
        case types.GET_CONVERSATION_COMMENT_SUCCESS:
            state.firstLoad = true;
            checkHandle = action.meta ? action.meta.some(item => item['isHandle'] == true) : false;
            checkNotHandle = action.meta ? action.meta.some(item => item['isHandle'] == false) : false;
            checkFilter = action.meta ? action.meta.some(item => item['replied'] == false) : false;
            unRead = action.meta ? action.meta.some(item => item['unRead'] == 2) : false;
            if (checkHandle) {
                state.conversations.items = state.conversations.items.filter(item => item.isHandle);
            }
            // đã xử lý
            if (checkNotHandle) {
                state.conversations.items = state.conversations.items.filter(item => !item.isHandle);
            }
            // chưa xử lý
            if (checkFilter) {
                state.conversations.items = state.conversations.items.filter(item => !item.replied);
            }
            // chưa trả lời
            if (unRead) {
                state.conversations.items = state.conversations.items.filter(item => item.conversationStatus == 2);
            }
            //đã đọc
            if (state.configPage.FbChatGeneralSetting.UnreadFirst) {
                state.conversations.items = state.conversations.items.orderByDesc(y => moment(y.time))
                    .orderByDesc(x => x.conversationStatus);
            }
            //  else {
            //     state.conversations.items = state.conversations.items.orderByDesc(y => moment(y.time));
            // }
            index = state.conversations.items.findIndex(item => item.conversationId == action.data.conversationId);
            if (state.conversations.items[index].tags?.length > 0) {
                checkTags = true;
            }
            if (checkTags && state.conversations.items[index].replied) {
                state.conversations.items[index].isHandle = true;
            }
            if (index != -1) {
                state.conversations.items[index].conversationStatus = action.data.conversationStatus;
                if (state.conversations.items[index].unReadCount > 0) {
                    state.conversations.items[index].unReadCount = 0
                }
            }
            return {
                ...state,
                conversation: action.data
            }
        case types.DELETE_CONVERSATION_COMMENT_SUCCESS:
            if (action.data.ids.length == 1) {
                index = state.conversation.messages.findIndex(item => item.id === action.data.ids[0]);
                if (index >= 0) {
                    state.conversation.messages[index].isDeleted = true;
                }
            } else {
                state.conversation.messages.map((item) => {
                    if (action.data.ids.includes(item.id)) {
                        item.isDeleted = true;
                    }
                })
            }
            return {
                ...state
            }
        case types.EDIT_CONVERSATION_COMMENT_SUCCESS:

            index = state.conversation.messages.findIndex((item) => item.id === action.data.commentId);
            if (index != -1) {
                state.conversation.messages[index].message = action.data.message;
                state.conversation.messages[index].attachmentUrl = action.data.attachmentUrl;
            }
            return {
                ...state
            }
        case types.GET_FACEBOOK_USER:
            return {
                ...state,
                fbUserId: action.fbUserId,
                fbLogin: true,
            }
        case types.GET_CONVERSATION_INBOX_SCROLL_SUCCESS:
            state.conversation.messages = [...action.data.messages, ...state.conversation.messages];
            return {
                ...state
            }
        case types.GET_CONVERSATION_COMMENT_SCROLL_SUCCESS:
            state.conversation.messages = [...action.data.messages, ...state.conversation.messages];
            return {
                ...state
            }
        case types.CUSTOMER_SEND_MESSAGE_SUCCESS:
            // // console.log(action.data, "action.data---=====2")
            const regex = /(?:\+?84|0|o)[.\-\s]?[1-9][.\-\s]?[0-9][.\-\s]?[0-9][.\-\s]?[0-9][.\-\s]?[0-9][.\-\s]?[0-9][.\-\s]?[0-9][.\-\s]?[0-9][.\-\s]?[0-9]/gi;
            if (state.checkMerge) {
                if (state.mergePages.includes(action.data.pageId)) {
                    if (action.data.message) {
                        if (state.conversation && action.data.conversationId == state.conversation.conversationId) {

                            if (action.data.message.timeStamp && action.data.message.from.id == state.profilePage?.pageId) {
                                result = state.conversation.messages.findIndex(it => it.id == "from_extension");
                            }
                            else {
                                result = state.conversation.messages.findIndex(it => it.id == action.data.message.id);
                            }
                            if (result == -1) {
                                action.data.message.reaction = null;
                                state.conversation.messages = [...state.conversation.messages, action.data.message];
                                if (state.conversation.typeMessage == 2) {
                                    listId = state.conversation.customers.map((it) => { return it.id });
                                    const customer = action.data.customers.filter(x => !listId.contains(x.id));
                                    if (customer.length > 0) {
                                        state.conversation.customers = [
                                            ...state.conversation.customers,
                                            {
                                                ...customer,
                                                customer: {
                                                    fullName: action.data.message.from.name,
                                                    avatar: action.data.message.from.avatar,
                                                },
                                                avatar: action.data.message.from.avatar,
                                                fullName: action.data.message.from.name,
                                                psid: action.data.message.from.id,
                                                avatar: action.data.message.from.avatar,
                                                id: action.data.customerId
                                            }
                                        ];
                                    }
                                }
                                // tạo cấu trúc user (nhiều người trả lời 1 comment)
                                if (state.conversation.typeMessage == 1) {
                                    if (action.data.message) {
                                        if (action.data.message.template) {
                                            const template = JSON.parse(action.data.message.template);
                                            if (template.length > 0 && template[0].payload?.buttons[0]?.title == "Xác nhận") {
                                                const matchPhone = action.data.message.message.match(regex);
                                                if (Array.isArray(matchPhone)) {
                                                    matchPhone.map((item) => {
                                                        state.conversation = {
                                                            ...state.conversation,
                                                            customer: {
                                                                ...state.conversation.customer,
                                                                customer: {
                                                                    ...state.conversation.customer.customer,
                                                                    phone: item
                                                                }
                                                            }
                                                        }
                                                    })
                                                }
                                            }
                                        }
                                    }
                                }
                                // mapping phone ladipage
                            }
                            // nếu chưa tồn tại thì thêm vào (check trường hợp page trả lời ngoài app)
                            index = state.conversations.items.findIndex((item) => item.conversationId == action.data.conversationId);
                            if (index >= 0) {
                                if (action.data.message.attachmentUrls?.length > 0) {
                                    state.conversations.items[index].lastMessageContent = action.data.lastMessageContent;
                                } else if (action.data.message.attachmentUrl) {
                                    state.conversations.items[index].lastMessageContent = action.data.lastMessageContent;
                                } else {
                                    state.conversations.items[index].lastMessageContent = action.data.message.message;
                                }
                                state.conversations.items[index].time = action.data.message.createdTime;
                                state.conversations.items[index].conversationStatus = 1;
                                state.conversations.items[index].unReadCount = 0;
                                const listPagesMerge = state.listPages.filter(item => state.mergePages.includes(item.id)).map(item => item.pageId);
                                if (!listPagesMerge.includes(action.data.message.from.id)) {
                                    state.conversations.items[index].isHandle = false;
                                    state.conversations.items[index].replied = false;
                                } else {
                                    if (state.conversations.items[index].tags?.length > 0) {
                                        state.conversations.items[index].isHandle = true;
                                    }
                                    state.conversations.items[index].replied = true;
                                }

                                // lên đầu list nếu là khách trả lời
                                if (regex.test(action.data.message.message)) {
                                    const matchPhone = action.data.message.message.match(regex);
                                    if (Array.isArray(matchPhone)) {
                                        matchPhone.map((item) => {
                                            if (!state.optionPhones.includes(item)) {
                                                state.conversations.items[index].phone = item;
                                            }
                                        });
                                    }
                                }
                                // nếu tin nhắn có số điện thoại thì gán vào hội thoại sdt (sidebar)

                                if (state.conversations.items[index].typeMessage == 2) {
                                    listId = state.conversations.items[index].customers.map((it) => { return it.id });
                                    const customer = action.data.customers.filter(x => !listId.contains(x.id));
                                    if (customer.length > 0) {
                                        state.conversations.items[index].customers = [
                                            ...state.conversations.items[index].customers,
                                            ...customer
                                        ];
                                    }
                                }
                                // cấu trúc nhiều user một comment
                                splice = state.conversations.items.splice(index, 1);
                                state.conversations.items = [...splice, ...state.conversations.items];
                                // nhảy lên đầu list
                            }
                            // nếu do chính page trả lời sẽ chỉ thay lastmessage
                            // nếu đang ở trong cuộc hội thoại thì thêm vào chi tiết hội thoại
                            // thêm vào sidebar
                        } else {
                            index = state.conversations.items.findIndex((item) => item.conversationId === action.data.conversationId);
                            if (index >= 0) {
                                if (action.data.message.attachmentUrls?.length > 0) {
                                    state.conversations.items[index].lastMessageContent = action.data.lastMessageContent;
                                } else if (action.data.message.attachmentUrl) {
                                    state.conversations.items[index].lastMessageContent = action.data.lastMessageContent;
                                } else {
                                    state.conversations.items[index].lastMessageContent = action.data.message.message;
                                }
                                const listPagesMerge = state.listPages.filter(item => state.mergePages.includes(item.id)).map(item => item.pageId);
                                if (listPagesMerge.includes(action.data.message.from.id) || action.data.message.from.id == "999999999999999") {
                                    // nếu do chính page trả lời.
                                    if (state.configPage?.FbChatAutoSetting != null) {
                                        if (state.configPage.FbChatAutoSetting.SyncStatusConversation) {
                                            // nếu bật sẽ giữ nguyên trạng thái hội thoại
                                        } else {
                                            if (state.conversations.items[index].tags?.length > 0) {
                                                state.conversations.items[index].isHandle = true;
                                            }
                                            state.conversations.items[index].unReadCount = 0;
                                            state.conversations.items[index].conversationStatus = 1;
                                            state.conversations.items[index].replied = true;
                                            // nếu tắt sẽ cho hội thoại về trạng thái đã đọc, xem, xử lý
                                        }
                                    } else {
                                        // nêu không có cài đặt thì vẫn tăng các trạng thái lên
                                        if (state.conversations.items[index].tags?.length > 0) {
                                            state.conversations.items[index].isHandle = true;
                                        }
                                        state.conversations.items[index].unReadCount = 0;
                                        state.conversations.items[index].conversationStatus = 1;
                                        state.conversations.items[index].replied = true;
                                        // nếu cài đặt bị null sẽ cho hội thoại về trạng thái đã đọc, xem, xử lý
                                    }
                                } else {
                                    state.conversations.items[index].isHandle = false;
                                    state.conversations.items[index].unReadCount += 1;
                                    state.conversations.items[index].conversationStatus = 2;
                                    state.conversations.items[index].replied = false;
                                    // nếu là khách
                                }

                                // kiểm tra xem tin nhắn của page hay khách hàng
                                state.conversations.items[index].time = action.data.message.createdTime;

                                if (regex.test(action.data.message.message)) {
                                    const matchPhone = action.data.message.message.match(regex);
                                    if (Array.isArray(matchPhone)) {
                                        matchPhone.map((item) => {
                                            if (!state.optionPhones.includes(item)) {
                                                state.conversations.items[index].phone = item;
                                            }
                                        });
                                    }
                                }
                                // nếu tin nhắn có số điện thoại thì gán vào hội thoại sdt (sidebar)
                                if (state.conversations.items[index].typeMessage == 2) {
                                    listId = state.conversations.items[index].customers.map((it) => { return it.id });
                                    const customer = action.data.customers.filter(x => !listId.contains(x.id));
                                    if (customer.length > 0) {
                                        state.conversations.items[index].customers = [
                                            ...state.conversations.items[index].customers,
                                            ...customer
                                        ];
                                    }
                                }
                                // cấu trúc nhiều user một comment
                                splice = state.conversations.items.splice(index, 1);
                                state.conversations.items = [...splice, ...state.conversations.items];
                                // nhảy lên đầu list
                            }
                            // nếu không chat voi khach hang thì chỉ thêm siderbar
                            // nếu do chính page trả lời sẽ ko tính realtime siderbar
                        }
                    }
                    // nếu là tin nhắn mới từ khách hàng cũ
                    if (action.data.reaction) {
                        if (state.conversation != null) {
                            if (state.conversation.typeMessage == 1) {
                                if (state.conversation.conversationId == action.data.conversationId) {
                                    index = state.conversation.messages.findIndex(item => item.id == action.data.reaction.id);
                                    state.conversation.messages[index].reaction = action.data.reaction.reaction;
                                }
                            }
                        }
                    }
                    // nếu đang trong cuộc hội thoại và có realtime cảm xúc
                }
                if (action.data.conversationId && !action.data.message) {
                    index = state.conversations.items.findIndex((item) => item.conversationId == action.data.conversationId);
                    if (index < 0) {
                        if (state.mergePages.includes(action.data.pageId)) {
                            state.conversations.items = [action.data, ...state.conversations.items];
                        }
                        if (state.conversations.items.length > size) {
                            state.conversations.items = state.conversations.items.slice(0, size - 100);
                        }
                    }
                }
                // nếu hội thoại mới từ khách hàng mới thì thêm vào siderbar - phải đúng cài đặt hoặc có quyền
                // }
                if (state.conversation && action.data.msgCustomerMarkSeen) {
                    state.conversation.msgCustomerMarkSeen = action.data.msgCustomerMarkSeen;
                }
                // avatar đã đọc của inbox
                // kết thúc chế độ gộp pages
            } else {
                if (action.data.pageId == state.profilePage?.id) {
                    if (action.data.message) {
                        if (state.conversation && action.data.conversationId == state.conversation.conversationId) {
                            if (action.data.message.timeStamp && action.data.message.from.id == state.profilePage?.pageId) {
                                result = state.conversation.messages.findIndex(it => it.id == "from_extension");
                            }
                            else {
                                result = state.conversation.messages.findIndex(it => it.id == action.data.message.id);
                            }
                            // check message realtime has timestamp
                            if (result < 0) {
                                action.data.message.reaction = null;
                                state.conversation.messages = [...state.conversation.messages, action.data.message];

                                if (state.conversation.typeMessage == 2) {
                                    listId = state.conversation.customers.map((it) => { return it.id });
                                    const customer = action.data.customers.filter(x => !listId.contains(x.id));

                                    if (customer.length > 0) {
                                        state.conversation.customers = [
                                            ...state.conversation.customers,
                                            {
                                                ...customer,
                                                customer: {
                                                    fullName: action.data.message.from.name,
                                                    avatar: action.data.message.from.avatar,
                                                },
                                                avatar: action.data.message.from.avatar,
                                                fullName: action.data.message.from.name,
                                                psid: action.data.message.from.id,
                                                avatar: action.data.message.from.avatar,
                                                id: action.data.customerId
                                            }
                                        ];
                                    }
                                }
                                // tạo cấu trúc user (nhiều người trả lời 1 comment)
                            }
                            // nếu chưa tồn tại thì thêm vào (check trường hợp page trả lời ngoài app)
                            if (state.conversation.typeMessage == 1) {
                                if (action.data.message) {
                                    if (action.data.message.template) {
                                        const template = JSON.parse(action.data.message.template);
                                        if (template.length > 0 && template[0].payload?.buttons[0]?.title == "Xác nhận") {
                                            const matchPhone = action.data.message.message.match(regex);
                                            if (Array.isArray(matchPhone)) {
                                                matchPhone.map((item) => {
                                                    state.conversation = {
                                                        ...state.conversation,
                                                        customer: {
                                                            ...state.conversation.customer,
                                                            customer: {
                                                                ...state.conversation.customer.customer,
                                                                phone: item
                                                            }
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                    }
                                }
                            }
                            // mapping phone ladipage
                            index = state.conversations.items.findIndex((item) => item.conversationId === action.data.conversationId);
                            if (index >= 0) {
                                if (action.data.message.attachmentUrls?.length > 0) {
                                    state.conversations.items[index].lastMessageContent = action.data.lastMessageContent;
                                } else if (action.data.message.attachmentUrl) {
                                    state.conversations.items[index].lastMessageContent = action.data.lastMessageContent;
                                } else {
                                    state.conversations.items[index].lastMessageContent = action.data.message.message;
                                }
                                state.conversations.items[index].time = action.data.message.createdTime;
                                state.conversations.items[index].conversationStatus = 1;
                                state.conversations.items[index].unReadCount = 0;

                                if (action.data.message.from.id != state.profilePage?.pageId) {
                                    state.conversations.items[index].isHandle = false;
                                    state.conversations.items[index].replied = false;
                                } else {
                                    state.conversations.items[index].replied = true;
                                    if (state.conversations.items[index].tags?.length > 0) {
                                        state.conversations.items[index].isHandle = true;
                                    }
                                }
                                // kiểm tra xem tin nhắn của page hay khách hàng

                                if (regex.test(action.data.message.message)) {
                                    const matchPhone = action.data.message.message.match(regex);
                                    if (Array.isArray(matchPhone)) {
                                        matchPhone.map((item) => {
                                            if (!state.optionPhones.includes(item)) {
                                                state.conversations.items[index].phone = item;
                                            }
                                        });
                                    }
                                }
                                if (state.conversations.items[index].typeMessage == 2) {
                                    listId = state.conversations.items[index].customers.map((it) => { return it.id });
                                    const customer = action.data.customers.filter(x => !listId.contains(x.id));
                                    if (customer.length > 0) {
                                        state.conversations.items[index].customers = [
                                            ...state.conversations.items[index].customers,
                                            ...customer
                                        ];
                                    }
                                }
                                // cấu trúc nhiều user một comment
                                splice = state.conversations.items.splice(index, 1);
                                state.conversations.items = [...splice, ...state.conversations.items];
                                // nhảy lên đầu list
                            }
                            // nếu do chính page trả lời sẽ chỉ thay lastmessage
                            // nếu đang ở trong cuộc hội thoại thì thêm vào chi tiết hội thoại
                            // thêm vào sidebar
                        } else {
                            index = state.conversations.items.findIndex((item) => item.conversationId === action.data.conversationId);
                            if (index >= 0) {
                                if (action.data.message.attachmentUrls?.length > 0) {
                                    state.conversations.items[index].lastMessageContent = action.data.lastMessageContent;
                                } else if (action.data.message.attachmentUrl) {
                                    state.conversations.items[index].lastMessageContent = action.data.lastMessageContent;
                                } else {
                                    state.conversations.items[index].lastMessageContent = action.data.message.message;
                                }
                                state.conversations.items[index].time = action.data.message.createdTime;

                                if (action.data.message.from.id == state.profilePage?.pageId || action.data.message.from.id == "999999999999999") {
                                    // nếu do chính page trả lời.
                                    if (state.configPage?.FbChatAutoSetting != null) {
                                        if (state.configPage.FbChatAutoSetting.SyncStatusConversation) {
                                            // nếu bật sẽ giữ nguyên trạng thái hội thoại
                                        } else {
                                            if (state.conversations.items[index].tags?.length > 0) {
                                                state.conversations.items[index].isHandle = true;
                                            }
                                            state.conversations.items[index].unReadCount = 0;
                                            state.conversations.items[index].conversationStatus = 1;
                                            state.conversations.items[index].replied = true;
                                            // nếu tắt sẽ cho hội thoại về trạng thái đã đọc, xem, xử lý
                                        }
                                    } else {
                                        if (state.conversations.items[index].tags?.length > 0) {
                                            state.conversations.items[index].isHandle = true;
                                        }
                                        state.conversations.items[index].unReadCount = 0;
                                        state.conversations.items[index].conversationStatus = 1;
                                        state.conversations.items[index].replied = true;
                                        // nếu cài đặt bị null sẽ cho hội thoại về trạng thái đã đọc, xem, xử lý
                                    }
                                } else {
                                    state.conversations.items[index].isHandle = false;
                                    state.conversations.items[index].unReadCount += 1;
                                    state.conversations.items[index].conversationStatus = 2;
                                    state.conversations.items[index].replied = false;
                                    // nếu là khách
                                }

                                // kiểm tra xem tin nhắn của page hay khách hàng
                                if (regex.test(action.data.message.message)) {
                                    const matchPhone = action.data.message.message.match(regex);
                                    if (Array.isArray(matchPhone)) {
                                        matchPhone.map((item) => {
                                            if (!state.optionPhones.includes(item)) {
                                                state.conversations.items[index].phone = item;
                                            }
                                        });
                                    }
                                }
                                // nếu tin nhắn có số điện thoại thì gán vào hội thoại sdt (sidebar)
                                if (state.conversations.items[index].typeMessage == 2) {
                                    listId = state.conversations.items[index].customers.map((it) => { return it.id });
                                    const customer = action.data.customers.filter(x => !listId.contains(x.id));
                                    if (customer.length > 0) {
                                        state.conversations.items[index].customers = [
                                            ...state.conversations.items[index].customers,
                                            ...customer
                                        ];
                                    }
                                }
                                // cấu trúc nhiều user một comment
                                splice = state.conversations.items.splice(index, 1);
                                state.conversations.items = [...splice, ...state.conversations.items];
                                // tạo cấu trúc user (nhiều người trả  lời 1 comment)
                            }
                            // nếu không chat voi khach hang thì chỉ thêm siderbar
                            // nếu do chính page trả lời sẽ ko tính realtime siderbar
                        }
                    }
                    if (action.data.reaction) {
                        if (state.conversation != null) {
                            if (state.conversation.typeMessage == 1) {
                                if (state.conversation.conversationId == action.data.conversationId) {
                                    index = state.conversation.messages.findIndex(item => item.id == action.data.reaction.id);
                                    state.conversation.messages[index].reaction = action.data.reaction.reaction;
                                }
                            }
                        }
                    }
                    // nếu đang trong cuộc hội thoại và có realtime cảm xúc
                }
                if (action.data.conversationId && !action.data.message) {
                    index = state.conversations.items.findIndex((item) => item.conversationId == action.data.conversationId);
                    if (index < 0) {
                        if (state.profilePage?.id == action.data.pageId) {
                            state.conversations.items = [action.data, ...state.conversations.items];
                        }
                        if (state.conversations.items.length > size) {
                            state.conversations.items = state.conversations.items.slice(0, size - 100);
                        }
                    }
                }
                // nếu hội thoại mới từ khách hàng mới thì thêm vào siderbar - đúng cài đặt hoặc có quyền
                if (state.conversation && action.data.msgCustomerMarkSeen) {
                    state.conversation.msgCustomerMarkSeen = action.data.msgCustomerMarkSeen;
                }
                // avatar xác định khách hàng đã đọc của inbox
            }
            return {
                ...state
            }
        case types.FILTER_SUCCESS:
            state.conversations = action.data;
            if (state.conversation) {
                index = state.conversations.items.findIndex(item => item.conversationId == state.conversation.conversationId);
                if (index < 0) {
                    state.conversation = null;
                    state.firstLoad = false;
                }
            }
            return {
                ...state
            }
        case types.FILTER_SEARCH_SUCCESS:
            listConversationId = state.conversations.items.map(item => { return item.conversationId });
            newMessage = action.data.items.filter(item => !listConversationId.includes(item.conversationId));
            state.conversations.items = [...state.conversations.items, ...newMessage];
            if (state.conversation) {
                index = state.conversations.items.findIndex(item => item.conversationId == state.conversation.conversationId);
                if (index < 0) {
                    state.conversation = null;
                    state.firstLoad = false;
                }
            }
            return {
                ...state
            }

        case types.ASSIGN_TAG_SUCCESS:
            if (!action.data.conversationId) return { ...state };
            index = state.conversations.items.findIndex(item => item.conversationId == action.data.conversationId);
            // checkHandle = action.meta.some(item => item['isHandle'] == false);
            if (index != -1) {
                if (state.conversations.items[index].tags == null) {
                    state.conversations.items[index].tags = [];
                }
                state.conversations.items[index].tags = [action.data.tag, ...state.conversations.items[index].tags];
                if (state.conversations.items[index].replied) {
                    state.conversations.items[index].isHandle = true;
                }
            }
            state.conversation = { ...state.conversation, tags: [action.data.tag, ...state.conversation.tags] };
            if (state.conversations.items[index].replied) {
                state.conversations.items[index].isHandle = true;
            }
            return {
                ...state
            }

        case types.REMOVE_ASSIGN_TAG_SUCCESS:
            if (!action.data.conversationId) return { ...state };
            index = state.conversations.items.findIndex((item) => item.conversationId == action.data.conversationId);
            if (index >= 0) {
                state.conversations.items[index].tags = state.conversations.items[index].tags.filter((item) => item.id !== action.data.tagId);
                if (state.conversations.items[index].tags?.length <= 0) {
                    state.conversations.items[index].isHandle = false;
                }
            }
            state.conversation = { ...state.conversation, tags: state.conversation.tags.filter((item) => item.id !== action.data.tagId) };
            return {
                ...state,
            }
        case types.GET_LIST_POST_FACEBOOK_SUCCESS:
            return {
                ...state,
                fbPosts: action.data
            }
        case types.GET_LIST_POST_SCROLL_FACEBOOK_SUCCESS:
            state.fbPosts.results = [...state.fbPosts.results, ...action.data.results];
            return {
                ...state
            }
        case types.GET_LIST_CONVERSATIONS_ASSIGNED:
            return {
                ...state,
                conversationassigned: action.data
            }
        case types.CREATE_CONVERSATIONS_VIRTUAL:
            state.conversation.messages = [...state.conversation.messages, action.data];
            return {
                ...state
            }
        case types.LIKE_CONVERSATION_SUCCESS:
            index = state.conversation.messages.findIndex(item => item.id === action.data.id);
            if (index >= 0) {
                state.conversation.messages[index].userLikes = true;
            }
            return {
                ...state
            }
        case types.UNLIKE_CONVERSATION_SUCCESS:
            index = state.conversation.messages.findIndex(item => item.id == action.data.id);
            if (index >= 0) {
                state.conversation.messages[index].userLikes = false;
            }
            return {
                ...state
            }
        case types.REMOVE_PROPS:
            return {
                ...state,
                conversation: null
            }
        case types.GET_USER_SUCCESS:
            return {
                ...state,
                user: action.data
            }
        case types.CREATE_TAG_SUCCESS:

            if (!action.data.id) return { ...state };

            return {
                ...state,
                conversationTags: [...state.conversationTags, action.data]
            }
        case types.REMOVE_CONVERSATION:
            return {
                ...state,
                conversation: null
            }
        case types.BLOCK_SUCCESS:
            if (state.conversation.typeMessage == 1) {
                state.conversation.customer.blocked = true
            } else {
                state.conversation.customers[0].blocked = true
            }
            return {
                ...state
            }
        case types.UN_BLOCK_SUCCESS:
            if (state.conversation.typeMessage == 1) {
                state.conversation.customer.blocked = false
            } else {
                state.conversation.customers[0].blocked = false
            }
            return {
                ...state
            }
        case types.CHANGE_ASSIGNED_STATUS:

            state.conversation.assignedStatus = action.data.assignedStatus;
            index = state.conversations.items.findIndex(item => item.conversationId === action.data.conversationId);
            if (index >= 0) {
                state.conversations.items[index].isHandle = action.data.assignedStatus;
            }
            return {
                ...state
            }

        case types.CHANGE_PAGE_MESSAGE:
            state.checkMerge = false;
            return {
                ...state,
                profilePage: action.item
            }
        case types.TAKE_CONVERSATIONS_SUCCESS:
            state.conversations.items = [...action.data, ...state.conversations.items];
            return {
                ...state
            }
        case types.CHANGE_READ_CONVERSATIONS_SUCCESS:
            index = state.conversations.items.findIndex(item => item.conversationId == action.meta);
            if (index >= 0) {
                state.conversations.items[index].unReadCount = 0;
            }
            return {
                ...state
            }
        case types.GET_CONFIG_PAGE:
            state.configPage = action.data;
            return {
                ...state
            }
        case types.GET_CONFIG_CONVERSATION:
            state.configConversation = action.data;
            return {
                ...state
            }
        case types.MERGE_PAGE_SUCCESS:
            state.mergePages = action.meta;
            state.checkMerge = true;
            return {
                ...state
            }
        case types.GET_CONVERSATIONS_MERGE_PAGE_SUCCESS:
            state.conversations = action.data;
            // // console.log(action.data, "action.data==========")
            state.checkMerge = true;
            state.goBack = false;
            return {
                ...state
            }
        case types.HIDE_CONVERSATION_COMMENT_SUCCESS:
            index = state.conversation.messages.findIndex(item => item.id == action.data.id);
            if (index >= 0) {
                state.conversation.messages[index].isHidden = true;
            }
            return {
                ...state
            }
        case types.SHOW_CONVERSATION_COMMENT_SUCCESS:
            index = state.conversation.messages.findIndex(item => item.id == action.data.id);
            if (index >= 0) {
                state.conversation.messages[index].isHidden = false;
            }
            return {
                ...state
            }
        case types.GET_CONVERSATIONS_MERGE_PAGE_SCROLL_SUCCESS:
            const listCvId = state.conversations.items.map(item => item.conversationId);
            newMessage = action.data.items.filter(item => !listCvId.includes(item.conversationId));
            state.conversations.items = [...state.conversations.items, ...newMessage]
            return {
                ...state
            }
        case types.CREATE_CONVERSATION_INBOX_TO_COMMENT_SUCCESS:
            result = state.conversation.messages.findIndex(item => item.id == action.meta.recipient.comment_id);
            if (result >= 0) {
                state.conversation.messages[result].cmtRepAble = true;
            }
            if (action.data.newConversation) {
                action.data.conversationStatus = 1;
                state.conversations.items = [action.data, ...state.conversations.items];
            } else {
                index = state.conversations.items.findIndex((item) => item.conversationId === action.data.conversationId);
                if (index >= 0) {
                    state.conversations.items[index].lastMessageContent = action.data.message;
                    state.conversations.items[index].createdTime = action.data.createdTime;
                }
            }
            return {
                ...state
            }
        case types.CREATE_ASSIGN_SUCCESS:
            if (state.conversation) {
                state.conversation.userAssigneds = action.data.conversationAssigneds[0];
            }
            return {
                ...state
            }
        case types.DELETE_ASSIGN_SUCCESS:
            state.conversation.userAssigneds = null;
            return {
                ...state
            }
        case types.CREATE_ORDER_SUCCESS:
            return {
                ...state
            }
        case types.THUMBTACK_TAGS_SUCCESS:
            state.thumbtackTags = action.data;
            return {
                ...state
            }
        case types.CHECK_CONNECT_PAGES_FOR_MERGE_PAGES:
            const pageConnect = action.param.filter(item => item.fbChatAble).map(item => item.id);
            state.mergePages = state.mergePages.filter(item => pageConnect.includes(item));
            if (state.profilePage && !pageConnect.includes(state.profilePage?.id)) {
                state.profilePage = null;
            }
            return {
                ...state
            }
        case types.CHECK_REMOVE_MERGE_PAGES:
            state.mergePages = [];
            return {
                ...state
            }
        case types.CHECK_REMOVE_CONNECT_PAGES_FOR_MERGE_PAGES:
            state.mergePages = state.mergePages.filter(item => item != action.id);
            if (state.profilePage && (action.id == state.profilePage?.id)) {
                state.profilePage = null;
            }
            return {
                ...state
            }
        case types.RECIVE_CONVERSATIONS_SUCCESS:
            state.conversations.items = [...state.conversations.items, ...action.data];
            if (!state.configPage.FbChatGeneralSetting.UnreadFirst) {
                state.conversations.items = state.conversations.items.orderByDesc(y => moment(y.time));
            } else {
                state.conversations.items = state.conversations.items.orderByDesc(y => moment(y.time))
                    .orderByDesc(x => x.conversationStatus);
            }
            return {
                ...state
            }
        case types.REVOKE_CONVERSATIONS_SUCCESS:
            if (action.data.permisition.manager || state.configConversation?.assignmentType == '1' || state.configConversation?.assignmentType == '2') {
                const filter = action.data.revoke.map(item => { return item.conversationId });
                if (state.conversation) {
                    if (filter.includes(state.conversation.conversationId)) {
                        state.conversation.userAssigneds = null;
                    }
                }
            } else {
                const filter = action.data.revoke.map(item => { return item.conversationId });
                state.conversations.items = state.conversations.items.filter(item => !filter.includes(item.conversationId));
            }
            return {
                ...state
            }
        case types.UPDATE_GENDER_CUSTOMER_SUCCESS:
            if (state.conversation.typeMessage == 1) {
                state.conversation.customer.customer.gender = action.data.gender;
            } else {
                state.conversation.customers[0].customer.gender = action.data.gender;
            }
            return {
                ...state
            }
        case types.UPDATE_BIRTHDATE_CUSTOMER_SUCCESS:
            if (state.conversation.typeMessage == 1) {
                state.conversation.customer.customer.birthdate = action.data.birthdate;
            } else {
                state.conversation.customers[0].customer.birthdate = action.data.birthdate;
            }
            return {
                ...state
            }
        case types.GET_CONVERSATION_PHONE_SUCCESS:
            if (action.data.phone != null) {
                const regex = /\s*(?:,|$)\s*/;
                const phones = Object.values(action.data);
                state.optionPhones = phones[0].split(regex);
            }
            return {
                ...state
            }
        case types.CREATE_ASSIGN_TAG_REALTIME:
            if (state.conversations != null) {
                let items = state.conversations.items;
                index = items.findIndex(item => item.conversationId == action.data.conversations);
                if (index != -1) {
                    if (state.conversations.items[index].tags == null) {
                        state.conversations.items[index].tags = [];
                    }
                    result = state.conversations.items[index].tags.findIndex(item => item.id == action.data.tag.id);
                    if (result == -1) {
                        state.conversations.items[index].tags = [action.data.tag, ...state.conversations.items[index].tags];
                    }
                    if (state.conversations.items[index].replied) {
                        state.conversations.items[index].isHandle = true;
                    }
                }
            }
            if (state.conversation) {
                if (state.conversation.conversationId == action.data.conversations) {
                    state.conversation = { ...state.conversation, tags: [action.data.tag, ...state.conversation.tags] };
                    if (state.conversations.items[index].replied) {
                        state.conversations.items[index].isHandle = true;
                    }
                }
            }
            return {
                ...state
            }
        case types.REMOVE_ASSIGN_TAG_REALTIME:
            if (state.conversations != null) {
                index = state.conversations.items.findIndex(item => item.conversationId == action.data.conversations);
                if (index != -1) {
                    if (state.conversations.items[index].tags != null) {
                        result = state.conversations.items[index].tags.findIndex(item => item.id == action.data.tagId);
                        if (result != -1) {
                            state.conversations.items[index].tags = state.conversations.items[index].tags.filter((item) => item.id !== action.data.tagId);
                        }
                        if (state.conversations.items[index].tags?.length <= 0) {
                            checkTags = true;
                        }
                        if (checkTags) {
                            state.conversations.items[index].isHandle = false;
                        }
                    }
                }
            }
            if (state.conversation) {
                if (state.conversation.conversationId == action.data.conversations) {
                    state.conversation = { ...state.conversation, tags: state.conversation.tags.filter((item) => item.id != action.data.tagId) };
                }
            }
            return {
                ...state
            }

        case types.REFRESH_CONVERSATION_INBOX_SUCCESS:
            if (state.conversation && state.conversation.conversationId == action.data.conversationId) {
                const listIdConv = state.conversation.messages.map(item => item.id);
                const filter = action.data.messages.filter(item => !listIdConv.includes(item.id));
                if (filter.length > 0) {
                    state.conversation.messages = [...state.conversation.messages, ...filter].orderBy(x => moment(x.createdTime));
                    index = state.conversations.items.findIndex(item => item.conversationId == state.conversation.conversationId);
                    state.conversations.items[index].lastMessageContent = filter.last().message;
                    state.conversations.items[index].time = filter.last().createdTime;
                }
            }
            return {
                ...state
            }

        case types.REFRESH_CONVERSATION_INBOX_SUCCESS_V2:

            if (state.conversation && state.conversation.conversationId == action.data.conversationId) {
                const listIdConv = state.conversation.messages.map(item => item.id);
                const messages = state.conversation.messages.filter(item => item.id != "from_extension")
                const filter = action.data.messages.filter(item => !listIdConv.includes(item.id));
                if (filter.length > 0 || messages.length < state.conversation.messages) {
                    state.conversation.messages = [...messages, ...filter].orderBy(x => moment(x.createdTime));;
                    index = state.conversations.items.findIndex(item => item.conversationId == state.conversation.conversationId);
                    const filterByTime = filter.filter(x => x.createdTime >= state.conversations.items[index].time).orderByDesc(y => moment(y.createdTime));
                    if (filterByTime.length > 0) {
                        state.conversations.items[index].lastMessageContent = filterByTime.first().message;
                        state.conversations.items[index].time = filterByTime.first().createdTime;
                        if (!state.configPage.FbChatGeneralSetting.UnreadFirst) {
                            state.conversations.items = state.conversations.items.orderByDesc(y => moment(y.time));
                        } else {
                            state.conversations.items = state.conversations.items.orderByDesc(y => moment(y.time))
                                .orderByDesc(x => x.conversationStatus);
                        }
                    }

                }
            }
            return {
                ...state
            }

        case types.REFRESH_CONVERSATION_COMMENT_SUCCESS:
            if (state.conversation && state.conversation.conversationId == action.data.conversationId) {
                const listIdConv = state.conversation.messages.map(item => item.id);
                const filter = action.data.messages.filter(item => !listIdConv.includes(item.id));
                if (filter.length > 0) {
                    state.conversation.messages = [...state.conversation.messages, ...filter].orderBy(x => moment(x.createdTime));;
                    index = state.conversations.items.findIndex(item => item.conversationId == state.conversation.conversationId);
                    state.conversations.items[index].lastMessageContent = filter.last().message;
                    state.conversations.items[index].time = filter.last().createdTime;
                }
            }
            return {
                ...state
            }

        case types.REVOKE_CONVERSATION_ASSIGN_SUCCESS:
            state.conversations.items = state.conversations.items.filter(item => item.conversationId != action.data.conversationId);
            return {
                ...state
            }
        case types.RECIVES_CONVERSATION_ASSIGN_SUCCESS:
            index = state.conversations.items.findIndex(item => item.conversationId == action.data.conversationId);
            if (index < 0) {
                state.conversations.items = [action.data, ...state.conversations.items];
            } else {
                state.conversations.items[index] = action.data;
            }
            if (state.conversation) {
                if (state.conversation.conversationId == action.data.conversationId) {
                    state.conversation.userAssigneds = action.data.conversationAssigneds[0];
                }
            }
            if (!state.configPage.FbChatGeneralSetting.UnreadFirst) {
                state.conversations.items = state.conversations.items.orderByDesc(y => moment(y.time));
            } else {
                state.conversations.items = state.conversations.items.orderByDesc(y => moment(y.time))
                    .orderByDesc(x => x.conversationStatus);
            }
            return {
                ...state
            }
        case types.REALTIME_PAGE_REPLY:
            result = state.conversations.items.findIndex(item => item.conversationId == action.data.conversationId);
            if (result >= 0) {
                state.conversations.items[result].lastMessageContent = action.data.lastMessageContent;
                state.conversations.items[result].time = action.data.message.createdTime;
                if (state.conversations.items[result].conversationStatus == 2) {
                    state.conversations.items[result].conversationStatus = 1;
                }
                if (state.conversations.items[result].unReadCount > 0) {
                    state.conversations.items[result].unReadCount = 0;
                }
                if (state.conversations.items[result].replied == false) {
                    state.conversations.items[result].replied = true;
                }

                if (state.conversation && state.conversation.conversationId == action.data.conversationId) {
                    index = state.conversation.messages.findIndex(item => item.id == action.data.message.id);
                    if (index < 0) {
                        state.conversation.messages = [...state.conversation.messages, action.data.message];
                    }
                    if (state.conversations.items[result].tags?.length > 0) {
                        state.conversations.items[result].isHandle = true;
                    }
                } else {
                    if (state.conversations.items[result].tags?.length > 0) {
                        state.conversations.items[result].isHandle = true;
                    }
                }
                splice = state.conversations.items.splice(result, 1);
                state.conversations.items = [...splice, ...state.conversations.items];
            }
            return {
                ...state
            }
        case types.GET_CV_CUSTOMER_SUCCESS:
            index = state.conversations.items.findIndex(x => x.conversationId == action.data.conversation.conversationId);
            if (index < 0) {
                state.conversations.items = [action.data.conversation, ...state.conversations.items];
                if (state.conversations.items.length > size) {
                    state.conversations.items = state.conversations.items.slice(0, size - 100);
                }
            }
            return {
                ...state
            }
        case types.CHANGE_STATUS_CONVERSATION_REALTIME:
            index = state.conversations.items.findIndex(x => x.conversationId == action.data.data);
            if (action.data.action == "recives") {
                if (index >= 0) {
                    if (state.conversations.items[index].conversationStatus == 1) {
                        state.conversations.items[index].conversationStatus = 2;
                        state.conversations.items[index].unReadCount = 1;
                    }
                }
            } else {
                if (index >= 0) {
                    if (state.conversations.items[index].conversationStatus == 2) {
                        state.conversations.items[index].conversationStatus = 1;
                        state.conversations.items[index].unReadCount = 0;
                    }
                }
            }
            return {
                ...state
            }
        case types.SET_GO_BACK:
            state.goBack = action.data;
            return {
                ...state
            }
        case types.ADD_MESSAGE:
            // // console.log(action.data, "ac.dddd")
            index = state.conversations.items.findIndex((item) => item.conversationId == action.data.conversationId);
            if (index < 0) {
                state.conversations.items = [action.data, ...state.conversations.items];
                if (state.conversations.items.length > size) {
                    state.conversations.items = state.conversations.items.slice(0, size - 100);
                }
            }
            return {
                ...state
            }
        case types.UPDATE_STATUS_REFRESH_MESSAGE:
            state.ableRefreshMessage = action.data.status
            return {
                ...state
            }
        case types.FILL_ADMIN_CONVERSATION_INBOX_SUCCESS:
            if (!state.conversation.customer.globalUserId) {
                state.conversation.customer.globalUserId = action.data.globalUserId;
            }
            return {
                ...state
            }
        case types.FILL_PROFILE_CONVERSATION_INBOX_SUCCESS:
            if (!state.conversation.customer.globalUserId) {
                state.conversation.customer.globalUserId = action.data.globalUserId;
            }
            return {
                ...state
            }
        default:
            return state;
    }
}

