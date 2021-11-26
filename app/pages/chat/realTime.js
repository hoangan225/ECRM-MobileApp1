import React, { Component } from 'react';
import { Alert, Dimensions, Platform, StatusBar, StyleSheet } from 'react-native';
// import { getList as getOrderSources } from "../../actions/product/order-source";
// import { getList as getTransporterList, findServices } from "../../actions/product/transporter";
import { getTemplate } from "../../actions/facebookMessage/messageTemplates";
// import * as actions from "../../actions/product/order";
import * as fbactions from "../../actions/facebookMessage/message";
import * as fbTemplateactions from "../../actions/facebookMessage/messageTemplates";
import * as fbPageMessage from "../../actions/facebookMessage/page";
import * as fbOrder from "../../actions/facebookMessage/order";
import { connect } from '../../lib/connect';
import Toolbar from '../controls/toolbars';
import MyStatusBar from '../statusBar/MyStatusBar';
import {
    fbMessageEvent, updateConversationEvent, takeConversationEvent, statusConversationEvent, updateConversationAssignEvent,
    updateConversationTagEvent, updateConversationNewEvent, assignConversationEvent, fbMessageToPageEvent
} from "../../lib/messagehub";
class RealTimeChat extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: false,
            showFilter: null,
            currentConvension: null,
            currentBox: null,
            skipTour: false,
            tourIndex: 0,
            firstLoad: false,
            viewfile: false,
            formSize: 4,
            tabIndex: 0,
            historyTotal: 0,
            hasTax: false,
            showLoadingMessage: false,
            messagesFilter: null,
            conversationId: null,
            arrayFilter: ["Hiển thị tất cả"],
            page: 1,
            pageSearch: 1,
            pageSize: 25,
            showLoadingScroll: false,
            filter: "",
            showTemplateAuto: false,
            modell: { attachments: [] },
            optionFilter: [],
            loadingCv: false,
            customerName: null,
            showPost: false,
            showFilterStaff: false,
            scroll: false,
            listPage: 1,
            isOnline: "dang online",
            showMoreTag: false,
            showTagConversation: false,
            indexTemplateMessage: 0,
            loadingListMessage: false,
            loadingConversation: false,
            isScroll: false,
            loaddingMes: false,
            formTag: false,
            fbLightBox: false,
            search: false,
            showClosePost: false,
            showCloseTime: false,
            showCloseTags: false,
            checkTags: [],
            scrollHeight: 0,
            checkReply: null,
            thumbtackTags: false,
            postFilter: [],
            loaddingSideBar: false,
            shortcutkey: false,
            fbUpload: false,
            fbFileUpload: [],
            dragging: false,
            playAudio: false,
            messsageEdit: false,
            currentIndexConversations: "-1",
            currentIdConversations: "-1",
            showFormGender: false,
            showFormBirthday: false,
            checkAsync: true,
            filterRealtime: {
                posts: [],
                staffs: [],
                tags: []
            },
            isScrollList: true,
            asyncLoading: false,
            typeSearch: "n",
            toLead: false,
            historyAutoTotalById: 0,
            optionPost: {
                search: null,
                checkSearch: false
            },
            modelAssignment: [],
            order: {
                customerPhoneNumber: "",
                shippingAddress: ""
            },
            countFilter: {
                comment: 0,
                dateTime: 0,
                hasPhone: 0,
                inbox: 0,
                isHandle: 0,
                notHandle: 0,
                notPhone: 0,
                posts: 0,
                staffs: 0,
                tags: 0,
                unReply: 0,
                unRead: 0
            },
            responsive: {
                active: false,
                list: false,
                content: false,
                order: false
            }
        }
        this.manager = this.context.user.hasCap('Conversation.Manage');
    }

    componentDidMount() {
        fbMessageEvent.addEventListener(this.onFbMessage);
        fbMessageToPageEvent.addEventListener(this.fbMessageToPageEvent);
        updateConversationEvent.addEventListener(this.updateConversationEvent);
        takeConversationEvent.addEventListener(this.takeConversationEvent);
        updateConversationTagEvent.addEventListener(this.updateConversationTagEvent);
        updateConversationNewEvent.addEventListener(this.updateConversationNewEvent);
        assignConversationEvent.addEventListener(this.assignConversationEvent);
        statusConversationEvent.addEventListener(this.statusConversationEvent);
        updateConversationAssignEvent.addEventListener(this.updateConversationAssignEvent);

        const { mergePages } = this.props.message;
        this.props.actions.getListPages()
        // // console.log(mergePages, "mergePages--")
        if (mergePages.length > 0) {
            const fbPage = this.props.fbPage.items.filter(item => item.id == mergePages[0]);
            this.props.actions.getConfigPage(mergePages[0]);
            this.props.actions.setPageId(...fbPage);
            this.props.actions.getConfigConversation(mergePages[0]);
        }
    }

    componentWillUnmount() {
        fbMessageEvent.removeEventListener(this.onFbMessage);
    }

    onFbMessage = (data) => {
        const { search, optionFilter, filterRealtime, typeSearch, modelAssignment } = this.state;
        const { conversations, conversation, configPage, checkMerge, configConversation } = this.props.message;
        const { mergePages } = this.props.message;
        const pageId = this.props.fbPage.pageId;
        const { addMessage, CustomerSendMessage } = this.props.actions;
        let result;
        let index = -1;
        if (search == true) {
            if (data.conversationId && !data.message) {
                if (checkMerge) {
                    result = modelAssignment.filter(x => (x.pageId == data.pageId) && (x.assignmentType == 1 || x.assignmentType == 2))
                    if (this.manager || result.length > 0) {
                        this.passConversation(data, CustomerSendMessage, true);
                    }
                } else {
                    if (this.manager || configConversation?.assignmentType == '1' || configConversation?.assignmentType == '2') {
                        this.passConversation(data, CustomerSendMessage, true);
                    }
                }
            }
            if (data.conversationId && data.message) {
                index = conversations.items.findIndex(item => item.conversationId == data.conversationId);
                if (index >= 0) {
                    this.props.actions.CustomerSendMessage(data);
                    // if (configPage.FbChatGeneralSetting.SoundNotification) {
                    //     this.audio = new Audio('/audio/messageRing.mp3');
                    //     this.audio.play();
                    // }
                } else {
                    if (checkMerge) {
                        result = modelAssignment.filter(x => (x.pageId == data.pageId) && (x.assignmentType == 1 || x.assignmentType == 2))
                        if (this.manager || result.length > 0) {
                            if (!this.manager) {
                                if (data.conversationAssigneds && !data.conversationAssigneds.contains(this.context.user.id)) {
                                    return;
                                }
                            }
                            if (data.message && mergePages.includes(data.pageId)) {
                                this.passConversation(data, addMessage, true);
                            }
                        }
                    } else {
                        if (this.manager || configConversation?.assignmentType == '1' || configConversation?.assignmentType == '2') {
                            if (this.manager && data.message && pageId == data.pageId) {
                                if (!this.manager) {
                                    if (data.conversationAssigneds && !data.conversationAssigneds.contains(this.context.user.id)) {
                                        return;
                                    }
                                }
                                this.passConversation(data, addMessage, true);
                            }
                        }
                    }
                }
            }
        } else {
            if (data.conversationId && !data.message) {
                if (checkMerge) {
                    result = modelAssignment.filter(x => (x.pageId == data.pageId) && (x.assignmentType == 1 || x.assignmentType == 2))
                    if (this.manager || result.length > 0) {
                        this.props.actions.CustomerSendMessage(data);
                        // if (configPage.FbChatGeneralSetting.SoundNotification) {
                        //     this.audio = new Audio('/audio/messageRing.mp3');
                        //     this.audio.play();
                        // }
                    }
                } else {
                    if (this.manager || configConversation?.assignmentType == '1' || configConversation?.assignmentType == '2') {
                        this.props.actions.CustomerSendMessage(data);
                        // if (configPage.FbChatGeneralSetting.SoundNotification) {
                        //     this.audio = new Audio('/audio/messageRing.mp3');
                        //     this.audio.play();
                        // }
                    }
                }
            }
            if (data.conversationId && data.message) {
                index = conversations.items.findIndex(item => item.conversationId == data.conversationId);
                if (index >= 0) {
                    this.props.actions.CustomerSendMessage(data);
                    // if (configPage.FbChatGeneralSetting.SoundNotification) {
                    //     this.audio = new Audio('/audio/messageRing.mp3');
                    //     this.audio.play();
                    // }
                } else {
                    if (checkMerge) {
                        result = modelAssignment.filter(x => (x.pageId == data.pageId) && (x.assignmentType == 1 || x.assignmentType == 2))
                        if (this.manager || result.length > 0) {
                            if (!this.manager) {
                                if (data.conversationAssigneds && !data.conversationAssigneds.contains(this.context.user.id)) {
                                    return;
                                }
                            }
                            if (mergePages.includes(data.pageId)) {
                                addMessage(data);
                                // if (configPage.FbChatGeneralSetting.SoundNotification) {
                                //     this.audio = new Audio('/audio/messageRing.mp3');
                                //     this.audio.play();
                                // }
                            }
                        }
                    } else {
                        if (this.manager || configConversation?.assignmentType == '1' || configConversation?.assignmentType == '2') {
                            if (!this.manager) {
                                if (data.conversationAssigneds && !data.conversationAssigneds.contains(this.context.user.id)) {
                                    return;
                                }
                            }
                            // // console.log(data, "data===============111")

                            // // console.log("2------------")
                            if (pageId == data.pageId) {
                                addMessage(data);
                                // if (configPage.FbChatGeneralSetting.SoundNotification) {
                                //     this.audio = new Audio('/audio/messageRing.mp3');
                                //     this.audio.play();
                                // }
                            }
                        }
                    }
                }
            }
        }
        if (conversation) {
            if (data.conversationId == conversation.conversationId) {
                if (data.message) {
                    this.props.actions.changeReadConversation(conversation.conversationId);
                    this.props.actions.changeStatusConversationRealtime(conversation.conversationId, 1);
                    // setTimeout(() => {
                    //     this.scrollToBottom();
                    // }, 4000);
                }
            }
            // if (data.source && conversation.conversationId == data.conversationId) {
            //     this.listOrderAuto.loadData(this.state.RealTimeChat);
            // }
        }
    }

    fbMessageToPageEvent = (data) => {
        const { optionFilter } = this.state;
        const { conversation } = this.props.message;
        this.timer = setTimeout(() => {
            this.props.actions.realtimePageReply(data, optionFilter);
        }, 1500);
        // if (conversation && conversation.conversationId == data.conversationId) {
        //     setTimeout(() => {
        //         this.scrollToBottom();
        //     }, 4000);
        // }
    }
    updateConversationEvent = ({ action, data }) => {
        const { conversations, conversation, checkMerge, configConversation } = this.props.message;
        const { reciveConversation, revokeConversation } = this.props.actions;
        if (action == "revoke") {
            const revoke = conversations.items.filter(item => data.includes(item.conversationId));
            const permisition = { "manager": this.manager };
            if (revoke.length > 0) {
                revokeConversation({ revoke, permisition });
                if (!this.manager) {
                    alert(__(`Đã thu hồi ${revoke.length} hội thoại do quá thời gian xử lý`));
                    if (conversation) {
                        const filter = data.map(item => item.conversationId);
                        if (filter.includes(conversation.conversationId)) {
                            this.props.actions.removeConversation();
                        }
                    }
                }
            }
        } else if (action == "recives") {
            const { mergePages } = this.props.message;
            if (checkMerge) {
                const listId = conversations.items.map(item => item.conversationId);
                const newData = data.filter(item => !listId.includes(item.conversationId) && mergePages.includes(item.pageId));
                if (this.state.search == true) {
                    this.applyConvFilter(newData, reciveConversation);
                } else {
                    alert(__(`Bạn nhận được ${newData.length} hội thoại`));
                    reciveConversation(newData);
                }
            } else {
                const pageId = this.props.match.params.id || this.props.fbPage.pageId;
                const listId = conversations.items.map(item => item.conversationId);
                const newData = data.filter(item => !listId.includes(item.conversationId) && item.pageId == pageId);
                if (newData.length > 0 && !this.manager) {
                    if (this.state.search == true) {
                        this.applyConvFilter(newData, reciveConversation);
                    } else {
                        alert(__(`Bạn nhận được ${newData.length} hội thoại`));
                        reciveConversation(newData);
                    }
                }
            }
        }
    }
    takeConversationEvent = ({ action, data }) => {
        const { mergePages } = this.props.message;
        const { conversations, conversation, checkMerge } = this.props.message;
        const { reciveConversation } = this.props.actions;
        if (action == "recives") {
            if (checkMerge) {
                const listId = conversations.items.map(item => item.conversationId);
                const newData = data.filter(item => !listId.includes(item.conversationId) && mergePages.includes(item.pageId));
                if (newData.length > 0 && !this.manager) {
                    if (this.state.search == true) {
                        this.applyConvFilter(newData, reciveConversation);
                    } else {
                        alert(__(`Bạn vừa nhận thêm ${newData.length} hội thoại`));
                        reciveConversation(newData);
                    }
                }
            } else {
                const pageId = this.props.match.params.id || this.props.fbPage.pageId;
                const listId = conversations.items.map(item => item.conversationId);
                const newData = data.filter(item => !listId.includes(item.conversationId) && item.pageId == pageId);
                if (newData.length > 0 && !this.manager) {
                    if (this.state.search == true) {
                        this.applyConvFilter(newData, reciveConversation);
                    } else {
                        alert(__(`Bạn vừa nhận thêm ${newData.length} hội thoại`));
                        reciveConversation(newData);
                    }
                }

            }
        }
    }
    updateConversationTagEvent = ({ action, data }) => {
        const { optionFilter } = this.state;
        if (action == "set") {
            this.timer = setTimeout(() => {
                this.props.actions.createAssignTagRealtime(data, optionFilter);
            }, 1000)
        } else if (action == "remove") {
            this.timer = setTimeout(() => {
                this.props.actions.removeAssignTagRealtime(data, optionFilter);
            }, 1000)
        }
    }
    updateConversationNewEvent = ({ action, data }) => {
        // // console.log("realtime updateConversationNewEvent", data);
        const { reciveConversation } = this.props.actions;
        const { conversations, conversation, checkMerge } = this.props.message;
        if (action == "revoke") {
            const revoke = conversations.items.filter(item => data.includes(item.conversationId));
            const permisition = { "manager": this.manager };
            if (revoke.length > 0) {
                this.props.actions.revokeConversation({ revoke, permisition });
                if (!this.manager) {
                    alert(__(`Đã thu hồi ${revoke.length} hội thoại do quá thời gian xử lý`));
                    if (conversation) {
                        const filter = data.map(item => item.conversationId);
                        if (filter.includes(conversation.conversationId)) {
                            this.props.actions.removeConversation();
                        }
                    }
                }
            }
        } else if (action == "recives") {
            if (checkMerge) {
                const listId = conversations.items.map(item => item.conversationId);
                const newData = data.filter(item => !listId.includes(item.conversationId) && mergePages.includes(item.pageId));
                if (newData.length > 0 && !this.manager) {
                    if (this.state.search == true) {
                        this.applyConvFilter(newData, reciveConversation);
                    } else {
                        alert(__(`Bạn vừa nhận thêm ${newData.length} hội thoại`));
                        reciveConversation(newData);
                    }
                }
            } else {
                const pageId = this.props.match.params.id || this.props.fbPage.pageId;
                const listId = conversations.items.map(item => item.conversationId);
                const newData = data.filter(item => !listId.includes(item.conversationId) && item.pageId == pageId);
                if (newData.length > 0 && !this.manager) {
                    if (this.state.search == true) {
                        this.applyConvFilter(newData, reciveConversation);
                    } else {
                        alert(__(`Bạn vừa nhận thêm ${newData.length} hội thoại`));
                        reciveConversation(newData);
                    }
                }
            }
        }
    }
    updateConversationAssignEvent = ({ action, data }) => {
        const { recivesConversationAssign } = this.props.actions;
        if (action == "recives") {
            if (checkMerge) {
                if (mergePages.includes(data.pageId) && !this.manager) {
                    if (this.state.search == true) {
                        this.passConversation(data, recivesConversationAssign);
                    } else {
                        alert(__(`Bạn vừa nhận thêm 1 hội thoại`));
                        recivesConversationAssign(data);
                    }
                }
            } else {
                const pageId = this.props.match.params.id || this.props.fbPage.pageId;
                if (pageId == data.pageId && !this.manager) {
                    if (this.state.search == true) {
                        this.passConversation(data, recivesConversationAssign);
                    } else {
                        alert(__(`Bạn vừa nhận thêm 1 hội thoại`));
                        recivesConversationAssign(data);
                    }
                }
            }
        }
    }
    assignConversationEvent = ({ action, data, ignoreUser }) => {
        const { mergePages } = this.props.message;
        const { conversation, checkMerge } = this.props.message;
        const { recivesConversationAssign } = this.props.actions;
        if (ignoreUser) {
            if (ignoreUser == this.context.user.id) {
                return;
            }
        }
        if (action == "revoke") {
            if (!this.manager) {
                this.timer = setTimeout(() => {
                    this.props.actions.revokeConversationAssign(data);
                    alert(__(`Đã thu hồi 1 hội thoại`));
                    if (conversation && (data.conversationId == conversation.conversationId)) {
                        this.props.actions.removeConversation();
                        this.setState({ firstLoad: false });
                    }
                }, 1000);
            }
        } else if (action == "recives") {
            if (checkMerge) {
                if (mergePages.includes(data.pageId) && !this.manager) {
                    this.timer = setTimeout(() => {
                        if (this.state.search == true) {
                            this.passConversation(data, recivesConversationAssign);
                        } else {
                            alert(__(`Bạn vừa nhận thêm 1 hội thoại`));
                            recivesConversationAssign(data);
                        }
                    }, 1000);
                }
            } else {
                const pageId = this.props.fbPage.pageId;
                if (pageId == data.pageId && !this.manager) {
                    this.timer = setTimeout(() => {
                        if (this.state.search == true) {
                            this.passConversation(data, recivesConversationAssign);
                        } else {
                            alert(__(`Bạn vừa nhận thêm 1 hội thoại`));
                            recivesConversationAssign(data);
                        }
                    }, 1000);
                }
            }
        }
    }
    statusConversationEvent = ({ action, data }) => {
        this.timer = setTimeout(() => {
            this.props.actions.changeStatusCoversationRealtime({ action, data });
        }, 1000)
    }
    applyConvFilter = (data, callback) => {
        const { optionFilter, typeSearch, filterRealtime } = this.state;
        let filterData = data;
        optionFilter.map((item) => {
            if (item.typeMessage) {
                if (item.typeMessage == 1) {
                    filterData = filterData.filter(it => it.typeMessage == 1);
                } else {
                    filterData = filterData.filter(it => it.typeMessage == 2);
                }
            }
            if (item.q) {
                filterData = [];
            }
            if (item.hasOwnProperty("unRead")) {
                filterData = filterData.filter(it => it.conversationStatus == item.unRead);
            }
            if (item.hasOwnProperty("replied")) {
                filterData = filterData.filter(it => it.replied == item.replied);
            }
            if (item.hasOwnProperty("hasPhone") && item.hasPhone) {
                filterData = filterData.filter(it => it.phone);
            }
            if (item.hasOwnProperty("hasPhone") && !item.hasPhone) {
                filterData = filterData.filter(it => !it.phone);
            }
            if (item.typeMessage && item.typeMessage == 2 && filterRealtime.posts.length > 0) {
                filterData = filterData.filter(it => filterRealtime.posts.contains(it.postId));
            }
            if (filterRealtime.staffs.length > 0) {
                filterData = filterData.filter(it => filterRealtime.staffs.contains(it.userAssigneds?.id));
            }
            if (filterRealtime.tags.length > 0) {
                filterData = [];
            }
            if (item.hasOwnProperty("isHandle") && item.isHandle) {
                filterData = filterData.filter(it => it.isHandle);
            }
            if (item.hasOwnProperty("isHandle") && !item.isHandle) {
                filterData = filterData.filter(it => !it.isHandle);
            }
            if (filterData.length > 0) {
                alert(__(`Bạn nhận được ${filterData.length} hội thoại`));
                callback(filterData);
            }
        })
    }
    passConversation = (data, callback, sound = false) => {
        const { optionFilter, filterRealtime } = this.state;
        const { configPage } = this.props.message;
        let flag = true;
        optionFilter.map((item) => {
            if (item.typeMessage) {
                flag = (item.typeMessage == data.typeMessage);
            }
            if (flag && item.q) {
                flag = false;
            }
            if (flag && item.unRead) {
                flag = (item.unRead == data.conversationStatus);
            }
            if (flag && item.hasOwnProperty("replied")) {
                flag = (item.replied == data.replied);
            }
            if (flag && item.hasOwnProperty("hasPhone") && item.hasPhone == true) {
                flag = (data.phone ? true : false);
            }
            if (flag && item.hasOwnProperty("hasPhone") && item.hasPhone == false) {
                flag = (!data.phone ? true : false);
            }
            if (flag && filterRealtime.staffs.length > 0) {
                flag = filterRealtime.staffs.includes(data.userAssigneds?.id)
            }
            if (flag && item.hasOwnProperty("isHandle")) {
                flag = (item.isHandle == data.isHandle);
            }
            if (flag && filterRealtime.posts.length > 0) {
                if (item.typeMessage == 2) {
                    flag = filterRealtime.posts.includes(data.post?.postId);
                } else {
                    flag = false;
                }
            }
            if (flag && filterRealtime.tags.length > 0) {
                flag = false;
            }
            if (flag) {
                if (sound) {
                    // if (configPage?.FbChatGeneralSetting?.SoundNotification) {
                    //     this.audio = new Audio('/audio/messageRing.mp3');
                    //     this.audio.play();
                    // }
                } else {
                    alert(__(`Bạn vừa nhận thêm 1 hội thoại`));
                }
                callback(data);
            }
        })
    }


    render() {
        return null;
    }
}

export default connect(RealTimeChat, state => ({
    host: state.account.host,
    checkingPolicy: state.app.enums.checkingPolicy,
    status: state.app.enums.orderStatus,
    warehouse: state.warehouse,
    transporter: state.transporter,
    branch: state.branch,
    fbMessageTemplate: state.fbMessageTemplate,
    app: state.app,
    fbOption: state.fbOption,
    message: state.fbMessage,
    fbPage: state.fbPageMessage,
    fbOrder: state.fbOrder
}), {
    // ...actions,
    ...fbactions,
    ...fbTemplateactions,
    ...fbPageMessage,
    ...fbOrder,
    getTemplate,
    // getOrderSources,
    // getTransporterList,
    // toggleSidebar,
    // findServices,
});