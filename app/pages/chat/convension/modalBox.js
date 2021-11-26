import moment from 'moment';
import { Container, Icon, Text, Thumbnail, View, List, ListItem, Body, Left, Right, Badge, Spinner } from 'native-base';
import React, { Component } from 'react';
// import Toast from 'react-native-simple-toast';
import { Alert, Dimensions, Linking, RefreshControl, ScrollView, StyleSheet, StatusBar, Platform } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';
import MyStatusBar from '../../statusBar/MyStatusBar';
// import tvkd, { c } from 'tieng-viet-khong-dau';
import * as actions from '../../../actions/facebookMessage/message';
import * as fbPageMessage from "../../../actions/facebookMessage/page";
import { connect } from '../../../lib/connect';
// import request from '../../../lib/request';
import FilterConvension from '../../controls/modalMenu';
import { MenuModalContext } from '../../controls/action-menu';
// import Avatar from '../../controls/avatar';
import Toolbar from '../../controls/toolbars';
import RsTouchableNativeFeedback from '../../controls/touchable-native-feedback';
// import LoginFacebook from "./loginFB";
import Loading from "../../controls/loading";
import request from '../../../lib/request';
import Toast from '../../controls/toast';
import APP_ID from '../../../constants/app_id';
class CustomerDetailsBox extends Component {
    constructor(props, context) {
        super(props, context);
        var branchId = context.currentBranchId;
        this.state = {
            loading: false,
            endScroll: false,
            page: 1,
            pageSize: 20,
            branchId: branchId,
            refreshing: false,
            currentViewIndex: 0,
            title: __('Hội thoại'),
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
            },
            currentConvensionId: null
        }
        var user = this.context.user;
        this.userId = user.id;
        this.canDetail = this.context.user.hasCap("Customer.Detail");
        this.canListOpp = this.context.user.hasCap("Opportunity.Manage");
        this.canListJob = this.context.user.hasCap("Job.Manage");
        this.data = [];
    }

    componentDidMount() {
        let currentConvension = this.props.navigation.state.params.currentConvension;
        const { checkMerge } = this.props.message;
        const pageId = currentConvension.id || this.props.fbPage.pageId;
        if (currentConvension.id != this.props.fbPage.pageId || !pageId) {
            this.props.actions.getListPages()
            // console.log("22222222222222")
            if (checkMerge && !currentConvension.id) {
                const { mergePages } = this.props.message;
                // // console.log(pageId, mergePages, "this.props.fbPage.fbUserId---")

                if (mergePages.length < 2) {
                    return;
                }
                const param = this.convertToUrlMerge(mergePages);
                const fbPage = this.props.fbPage.items.filter(item => item.id == mergePages[0]);
                // const queryParams = queryString.parse(this.props.location.search);
                this.setState({ loaddingSideBar: true });
                // // console.log("333333333333")
                this.props.actions.getListConversationsMergePages(param, 1)
                    .then((data) => {
                        // // console.log("444444444444", data)
                        this.setState({ loaddingSideBar: false });
                        // if (queryParams.c_id) {
                        //     this.openCvToLink(data.items, queryParams, true);
                        // }
                    })
                    .catch(() => {
                        this.setState({ loaddingSideBar: false });
                    });
                this.props.actions.getConfigPage(mergePages[0]);
                this.props.actions.setPageId(...fbPage);
                this.props.actions.getConfigConversation(mergePages[0]);
                this.props.actions.getConfigConversations({ groupPage: mergePages }).then(data => {
                    this.setState({ modelAssignment: data })
                });
            } else {
                // console.log(currentConvension.id, this.props.fbPage.pageId, !pageId, "currentConvension.id, this.props.fbPage.pageId, !pageId,")

                if (!pageId) {
                    return;
                }
                this.setState({ loading: true, pageId: currentConvension.pageId })
                if (currentConvension) {
                    this.changePage(currentConvension.id, currentConvension.pageId, currentConvension)
                }
                const fbPage = this.props.fbPage.items.filter(item => item.id == pageId);

                this.props.actions.getListConversations(pageId, this.state.listPage)
                    .then((data) => {
                        // console.log(data, "data")

                        this.setState({ loading: false });
                    })
                    .catch(() => {
                        this.setState({ loading: false });
                    });
                this.props.actions.getConfigPage(pageId);
                this.props.actions.setPageId(...fbPage);
                this.props.actions.getConfigConversation(pageId);
                // this.getTemplateChangePage(pageId);
                this.props.actions.getConversationTags(pageId);
            }
            this.props.actions.getOptionPhones();
            // this.functionRemoveFilter();

        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.message.checkMerge) {
            if (this.props.message.mergePages != nextProps.message.mergePages) {
                this.setState({ loaddingSideBar: true });
                const { mergePages } = nextProps.message;
                const param = this.convertToUrlMerge(mergePages);
                const fbPage = this.props.fbPage.items.filter(item => item.id == mergePages[0]);
                this.props.actions.getListConversationsMergePages(param, 1)
                    .then(() => {
                        this.setState({ loaddingSideBar: false });
                    })
                    .catch(() => {
                        this.setState({ loaddingSideBar: false });
                    });
                this.props.actions.getConfigPage(mergePages[0]);
                this.props.actions.setPageId(...fbPage);
                this.props.actions.getConfigConversation(mergePages[0]);
                this.getTemplateChangePage(this.props.fbPage.pageId);

            }
        }

    }

    getTemplateChangePage = (pageId) => {
        const { checkMerge } = this.props.message;
        let params = {};
        params = {
            pageId: pageId,
            page: 1,
            pageSize: 20
        }
        this.props.actions.getTemplate(params);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.message.conversation != prevProps.message.conversation) {
            console.log("componentDidUpdate")
            this.scrollTo();
        }
    }

    // scrollToRow(itemIndex) {
    //     this._scrollView.scrollTo({y:itemIndex * ROW_HEIGHT});
    // }

    scrollTo = (p) => {
        let currentConvension = this.props.navigation.state.params.currentConvension;
        this.setState({ loading: true, endScroll: false, page: p })
        const { mergePages, checkMerge } = this.props.message;
        if (checkMerge) {
            const { mergePages } = this.props.message;
            const paramPageId = this.convertToUrlMerge(mergePages);
            this.props.actions.getListConversationsMergePagesScroll(paramPageId, p)
                .then((data) => {
                    if (data.items.length == 0) {
                        this.setState({ loading: false, endScroll: true })
                    } else {
                        this.setState({ loading: false, endScroll: false })
                    }
                }).catch(() => {
                    this.setState({ loading: false, endScroll: false })
                });
        } else {
            this.props.actions.getListScrollConversations(currentConvension.id, p)
                .then(data => {
                    // // console.log(data, "datascroll")
                    if (data.items.length == 0) {
                        this.setState({ loading: false, endScroll: true })
                    } else {
                        this.setState({ loading: false, endScroll: false })
                    }
                })
                .catch(error => {
                    this.setState({ loading: false, endScroll: false })
                    alert(error.error, 'error');
                });
        }

    }

    changePage = (ecrmPageId, pageIdFb, item) => {
        // const paramPageId = `pageId=${ecrmPageId}`;
        // this.setState({
        //     loaddingSideBar: true,
        //     loadingListMessage: false,
        //     mergePage: false,
        //     firstLoad: false,
        //     asyncLoading: false,
        //     optionPost: {
        //         search: null,
        //         checkSearch: false
        //     }
        // });
        this.props.actions.removeConversation();
        this.props.actions.changePage(ecrmPageId, pageIdFb, item);
        this.props.actions.changePageMessage(item);
        // this.getTemplateChangePage(ecrmPageId);
        this.props.actions.getConfigPage(ecrmPageId);
        this.props.actions.getConfigConversation(ecrmPageId);

        // if (this.state.arrayFilter.length === 0) {
        //     this.props.actions.getListConversations(ecrmPageId, 1)
        //         .then(() => {
        //             this.setState({ loaddingSideBar: false, listPage: 1 });
        //         }).catch(() => {
        //             this.setState({ loaddingSideBar: false, listPage: 1 });
        //         });
        // } else {
        //     const param = this.convertToUrl(this.state.optionFilter);
        //     this.props.actions.filter(paramPageId, param, 1).then(() => {
        //         this.setState({
        //             loaddingSideBar: false, pageSearch: 1,
        //             listPage: 1, isScroll: true, isScrollList: true
        //         });
        //     }).catch(() => {
        //         this.setState({
        //             loaddingSideBar: false, pageSearch: 1,
        //             listPage: 1, isScroll: true, isScrollList: true
        //         })
        //     });
        // }
        this.props.actions.getConversationTags(ecrmPageId);
        // this.setState({ loadingCv: false, listPage: 1 });
    }

    edit = () => {
        this.props.showEdit()
    }

    delete = () => {
        Alert.alert(
            'Xóa khách hàng',
            'Bạn có chắc chắn muốn xóa không?',
            [
                {
                    text: 'Cancel', onPress: () => console.log('Cancel Pressed')
                },
                {
                    text: 'OK', onPress: () => {
                        var id = this.props.entry.id;
                        // this.props.showBox(null, 'delete');
                        this.props.actions.remove(id)
                            .then(() => {
                                // Toast.show('Xóa thành công.');
                                Toast.show({
                                    text: 'Xóa thành công',
                                    duration: 2500,
                                    position: 'bottom',
                                    textStyle: { textAlign: 'center' },
                                    buttonText: '',
                                });
                                // this.props.onRequestClose();
                            })
                            .catch(({ error, message }) => {
                                alert(error, message);
                            })
                    }
                },
            ],
            { cancelable: false }
        )

    }

    openLink = (link) => {
        Linking.canOpenURL(link).then(supported => {
            if (supported) {
                Linking.openURL(link);
            } else {
                console.log('Don\'t know how to open URI: ' + link);
            }
        });
    }

    refresh = (silent = false) => {
        // var id = this.props.entry.id;
        // !silent && this.setState({ refreshing: true });
        // this.props.actions.getlist()
        //     .catch(() => 1).then(() => {
        //         this.setState({ refreshing: false });
        //     });
    }

    openSheet = () => {
        this.setState({
            loading: false,
            currentJob: true,
            currentBox: "actionSheet"
        })
    }

    showBox = () => {
        this.removeFilterTags();
        this.setState({
            currentJob: null,
            currentBox: ""
        })
    }

    functionFilter = () => {
        const { mergePages, checkMerge, conversation } = this.props.message;
        const { pageSearch } = this.state;
        let index = -1;
        const pageId = this.props.fbPage.pageId;
        // // console.log(this.state.optionFilter, "this.state.optionFilter")
        if (checkMerge) {
            const paramPageId = this.convertToUrlMerge(mergePages);
            const param = this.convertToUrl(this.state.optionFilter);
            this.props.actions.filter(paramPageId, param, pageSearch).then((data) => {
                this.setState({ loaddingSideBar: false, pageSearch: 1, listPage: 1, isScroll: true, isScrollList: true });
                if (conversation) {
                    index = data.items.findIndex(item => item.conversationId == conversation.conversationId);
                    if (index >= 0) {
                        this.setState({ currentIndexConversations: index, });
                    } else {
                        this.setState({ currentIndexConversations: "-1" });
                    }
                } else {
                    this.setState({ currentIndexConversations: "-1", currentIdConversations: "-1" });
                }
            }).catch(() => {
                this.setState({ loaddingSideBar: false, pageSearch: 1, isScroll: true, isScrollList: true });
            });
            this.props.actions.filterCount(paramPageId, param, pageSearch).then((data) => {
                this.setState({ countFilter: data })
            }).catch(e => console.log(e, "count filter"))
        } else {
            const param = this.convertToUrl(this.state.optionFilter);
            const paramPageId = `pageId=${pageId}`;
            // // console.log(paramPageId, param, pageSearch, "paramPageId, param, pageSearch")
            this.props.actions.filter(paramPageId, param, pageSearch).then((data) => {
                this.setState({ loaddingSideBar: false, pageSearch: 1, listPage: 1, isScroll: true, isScrollList: true });
                if (conversation) {
                    index = data.items.findIndex(item => item.conversationId == conversation.conversationId);
                    if (index >= 0) {
                        this.setState({ currentIndexConversations: index });
                    } else {
                        this.setState({ currentIndexConversations: "-1" });
                    }
                }
                else {
                    this.setState({ currentIndexConversations: "-1", currentIdConversations: "-1" });
                }
            }).catch(() => {
                this.setState({ loaddingSideBar: false, pageSearch: 1, listPage: 1, isScroll: true, isScrollList: true })
            });
            this.props.actions.filterCount(paramPageId, param, pageSearch).then((data) => {
                this.setState({ countFilter: data })
            }).catch(e => console.log(e, "count filter"))
        }
    }
    convertToUrlMerge = (check) => {
        let url = "";
        check.map((item, index) => {
            if (index == 0) {
                url += 'groupPage[' + index + ']' + "=" + item;
            } else {
                url += "&" + 'groupPage[' + index + ']' + "=" + item;
            }
        });
        return url;
    }
    functionRemoveFilter = () => {
        const { checkMerge, conversation } = this.props.message;
        const page = 1;
        const pageId = this.props.fbPage.pageId;
        let index = -1;
        if (checkMerge) {
            const { mergePages } = this.props.message;
            const paramMerge = this.convertToUrlMerge(mergePages);
            this.props.actions.getListConversationsMergePages(paramMerge, page).then((data) => {
                this.setState({ loaddingSideBar: false, pageSearch: 1, listPage: 1, isScroll: true, isScrollList: true });
                if (conversation) {
                    index = data.items.findIndex(item => item.conversationId == conversation.conversationId);
                    if (index >= 0) {
                        this.setState({ currentIndexConversations: index });
                    } else {
                        this.setState({ currentIndexConversations: "-1" });
                    }
                } else {
                    this.setState({ currentIndexConversations: "-1", currentIdConversations: "-1" });
                }
            }).catch(() => {
                this.setState({ loaddingSideBar: false, pageSearch: 1, listPage: 1, isScroll: true, isScrollList: true })
            });
        } else {
            this.props.actions.getListConversations(pageId, page).then((data) => {
                this.setState({ loaddingSideBar: false, pageSearch: 1, listPage: 1, isScroll: true, isScrollList: true });
                if (conversation) {
                    index = data.items.findIndex(item => item.conversationId == conversation.conversationId);
                    if (index >= 0) {
                        this.setState({ currentIndexConversations: index });
                    } else {
                        this.setState({ currentIndexConversations: "-1" });
                    }
                } else {
                    this.setState({ currentIndexConversations: "-1", currentIdConversations: "-1" });
                }
            }).catch(() => {
                this.setState({ loaddingSideBar: false, pageSearch: 1, listPage: 1, isScroll: true, isScrollList: true });
            });
        }
    }
    filterAll = (item) => {
        // this.StaffRef.current.removeFilterStaff();
        // this.filterBarRef.current.removeFilterDate();
        // this.searchRef.current.clear();
        this.setState({
            loaddingSideBar: true,
            arrayFilter: [item],
            optionFilter: [],
            removeFilterDate: true,
            removeFilterPost: true,
            removeFilterStaff: true,
            pageSearch: 1,
            checkTags: [],
            postFilter: [],
            search: false,
        }, () => this.functionFilter());
    };
    filterNotRead = (item) => {
        // // console.log(item, "itemitem")
        const filterArray = this.state.arrayFilter.filter((it) => it !== "Hiển thị tất cả");
        const newArrayFilter = [...filterArray, item];
        this.setState({
            loaddingSideBar: true,
            search: true,
            pageSearch: 1,
            arrayFilter: newArrayFilter,
            optionFilter: [...this.state.optionFilter, { unRead: 2 }],
        }, () => this.functionFilter())
    }
    removeFilterNotRead = (item) => {
        const filterArray = this.state.arrayFilter.filter((it) => it !== item);
        const newArrayFilter = [...filterArray];
        const newOptionFilter = this.state.optionFilter.filter((item) => !item.unRead);
        this.setState({
            loaddingSideBar: true,
            arrayFilter: newArrayFilter,
            optionFilter: newOptionFilter,
            pageSearch: 1,
        }, () => {
            if (this.state.arrayFilter.length === 0) {
                this.setState({
                    arrayFilter: ["Hiển thị tất cả"],
                    search: false,
                }, () => this.functionRemoveFilter());
            } else {
                this.functionFilter();
            }
        })
    }
    filterComment = (item) => {
        const filterArray = this.state.arrayFilter.filter(
            (it) => it !== 'Hiển thị tất cả' && it != "Lọc tin nhắn"
        );
        const newArrayFilter = [...filterArray, item];
        const newOptionFilter = this.state.optionFilter.filter((item) => !item.typeMessage);
        this.setState({
            search: true,
            loaddingSideBar: true,
            arrayFilter: newArrayFilter,
            pageSearch: 1,
            optionFilter: [...newOptionFilter, { typeMessage: 2 }]
        }, () => this.functionFilter());
    }
    removeFilterComment = (item) => {
        const filterArray = this.state.arrayFilter.filter((it) => it !== item);
        const newArrayFilter = [...filterArray];
        const newOptionFilter = this.state.optionFilter.filter((item) => item.typeMessage !== 2);
        this.setState({
            loaddingSideBar: true,
            arrayFilter: newArrayFilter,
            optionFilter: newOptionFilter,
            pageSearch: 1,
        }, () => {
            if (this.state.arrayFilter.length === 0) {
                this.setState({
                    search: false,
                    arrayFilter: ["Hiển thị tất cả"]
                }, () => this.functionRemoveFilter());
            } else {
                this.functionFilter();
            }
        })
    }
    filterMessage = (item) => {
        const filterArray = this.state.arrayFilter.filter(
            (it) => it !== "Hiển thị tất cả" && it != "Lọc bình luận"
        );
        const newArrayFilter = [...filterArray, item];
        const newOptionFilter = this.state.optionFilter.filter((item) => !item.typeMessage);
        this.setState({
            loaddingSideBar: true,
            arrayFilter: newArrayFilter,
            search: true,
            pageSearch: 1,
            optionFilter: [
                ...newOptionFilter,
                { typeMessage: 1 },
            ],
        }, () => this.functionFilter());
    }
    removeFilterMessage = (item) => {
        const filterArray = this.state.arrayFilter.filter((it) => it !== item);
        const newArrayFilter = [...filterArray];
        const newOptionFilter = this.state.optionFilter.filter((item) => item.typeMessage !== 1);
        this.setState({
            pageSearch: 1,
            loaddingSideBar: true,
            arrayFilter: newArrayFilter,
            optionFilter: newOptionFilter,
        }, () => {
            if (this.state.arrayFilter.length === 0) {
                this.setState({
                    arrayFilter: ["Hiển thị tất cả"],
                    search: false,
                }, () => this.functionRemoveFilter())
            } else {
                this.functionFilter();
            }
        })
    }
    filterHavePhone = (item) => {
        const filterArray = this.state.arrayFilter.filter((it) => it !== "Lọc không có số điện thoại" && it !== "Hiển thị tất cả");
        const newArrayFilter = [...filterArray, item];
        const newOptionFilter = this.state.optionFilter.filter((item) => item.hasPhone !== true && item.hasPhone !== false);
        this.setState({
            pageSearch: 1,
            loaddingSideBar: true,
            search: true,
            arrayFilter: newArrayFilter,
            optionFilter: [...newOptionFilter, { hasPhone: true }],
        }, () => this.functionFilter());
    };
    removeFilterHavePhone = (item) => {
        const filterArray = this.state.arrayFilter.filter((it) => it !== item);
        const newArrayFilter = [...filterArray];
        const newOptionFilter = this.state.optionFilter.filter((item) => item.hasPhone !== true && item.hasPhone !== false);
        this.setState({
            pageSearch: 1,
            loaddingSideBar: true,
            arrayFilter: newArrayFilter,
            optionFilter: newOptionFilter,
        }, () => {
            if (this.state.arrayFilter.length === 0) {
                this.setState({
                    arrayFilter: ["Hiển thị tất cả"],
                    search: false,
                }, () => this.functionRemoveFilter());
            } else {
                this.functionFilter();
            }
        })
    }
    filterNotPhone = (item) => {
        const filterArray = this.state.arrayFilter.filter((it) => it !== "Lọc có số điện thoại" && it !== "Hiển thị tất cả");
        const newArrayFilter = [...filterArray, item];
        const newOptionFilter = this.state.optionFilter.filter((item) => item.hasPhone !== true && item.hasPhone !== false);
        this.setState({
            pageSearch: 1,
            loaddingSideBar: true,
            search: true,
            arrayFilter: newArrayFilter,
            optionFilter: [...newOptionFilter, { hasPhone: false }],
        }, () => this.functionFilter());
    }
    removeFilterNotPhone = (item) => {
        const filterArray = this.state.arrayFilter.filter((it) => it !== item);
        const newArrayFilter = [...filterArray];
        const newOptionFilter = this.state.optionFilter.filter((item) => item.hasPhone !== true && item.hasPhone !== false);
        this.setState({
            loaddingSideBar: true,
            arrayFilter: newArrayFilter,
            optionFilter: newOptionFilter,
            pageSearch: 1,
        }, () => {
            if (this.state.arrayFilter.length === 0) {
                this.setState({
                    arrayFilter: ["Hiển thị tất cả"],
                    search: false,
                }, () => this.functionRemoveFilter())
            } else {
                this.functionFilter();
            }
        })
    }
    filterHandle = (item) => {
        const filterArray = this.state.arrayFilter.filter((it) => it !== "Lọc chưa xử lý" && it !== "Hiển thị tất cả");
        const newArrayFilter = [...filterArray, item];
        const newOptionFilter = this.state.optionFilter.filter((item) => item.isHandle !== true && item.isHandle !== false);
        this.setState({
            pageSearch: 1,
            loaddingSideBar: true,
            search: true,
            arrayFilter: newArrayFilter,
            optionFilter: [...newOptionFilter, { isHandle: true }],
        }, () => this.functionFilter());
    };
    removeFilterHandle = (item) => {
        const filterArray = this.state.arrayFilter.filter((it) => it !== item);
        const newArrayFilter = [...filterArray];
        const newOptionFilter = this.state.optionFilter.filter((item) => item.isHandle !== true && item.isHandle !== false);
        this.setState({
            pageSearch: 1,
            loaddingSideBar: true,
            arrayFilter: newArrayFilter,
            optionFilter: newOptionFilter,
        }, () => {
            if (this.state.arrayFilter.length === 0) {
                this.setState({
                    arrayFilter: ["Hiển thị tất cả"],
                    search: false,
                }, () => this.functionRemoveFilter());
            } else {
                this.functionFilter();
            }
        })
    }
    filterNotHandle = (item) => {
        const filterArray = this.state.arrayFilter.filter((it) => it !== "Lọc đã xử lý" && it !== "Hiển thị tất cả");
        const newArrayFilter = [...filterArray, item];
        const newOptionFilter = this.state.optionFilter.filter((item) => item.isHandle !== true && item.isHandle !== false);
        this.setState({
            pageSearch: 1,
            loaddingSideBar: true,
            search: true,
            arrayFilter: newArrayFilter,
            optionFilter: [...newOptionFilter, { isHandle: false }],
        }, () => this.functionFilter());
    };
    removeFilterNotHandel = (item) => {
        const filterArray = this.state.arrayFilter.filter((it) => it !== item);
        const newArrayFilter = [...filterArray];
        const newOptionFilter = this.state.optionFilter.filter((item) => item.isHandle !== true && item.isHandle !== false);
        this.setState({
            pageSearch: 1,
            loaddingSideBar: true,
            arrayFilter: newArrayFilter,
            optionFilter: newOptionFilter,
        }, () => {
            if (this.state.arrayFilter.length === 0) {
                this.setState({
                    arrayFilter: ["Hiển thị tất cả"],
                    search: false,
                }, () => this.functionRemoveFilter());
            } else {
                this.functionFilter();
            }
        })
    }
    filterNotReply = (item) => {
        const page = 1;
        const filterArray = this.state.arrayFilter.filter((it) => it !== "Hiển thị tất cả");
        const newArrayFilter = [...filterArray, item];
        this.setState({
            loaddingSideBar: true,
            pageSearch: 1,
            search: true,
            arrayFilter: newArrayFilter,
            optionFilter: [...this.state.optionFilter, { replied: false }],
        }, () => this.functionFilter())
    }
    removefilterNotReply = (item) => {
        const filterArray = this.state.arrayFilter.filter((it) => it !== item);
        const newArrayFilter = [...filterArray];
        const newOptionFilter = this.state.optionFilter.filter((item) => item.replied !== false);
        this.setState({
            loaddingSideBar: true,
            arrayFilter: newArrayFilter,
            optionFilter: newOptionFilter,
            pageSearch: 1,
        }, () => {
            if (this.state.arrayFilter.length === 0) {
                this.setState({
                    arrayFilter: ["Hiển thị tất cả"],
                    search: false,
                }, () => this.functionRemoveFilter());
            } else {
                this.functionFilter();
            }
        })
    }
    convertToUrl = (filters) => {
        var url = "";
        filters.map((item) => {
            url += "&" + Object.keys(item) + "=" + item[Object.keys(item)];
        });
        return url;
    };

    filterTags = (check) => {
        const { optionFilter, arrayFilter } = this.state;
        const regex = /tagIds\[\d{1,3}\]/g;
        if (check.length == 0) {
            const filterArray = this.state.arrayFilter.filter((it) => it !== "Lọc theo thẻ");
            const newOptionFilter = this.state.optionFilter.filter(item => !Object.keys(item)[0].match(regex))
            this.setState({
                loaddingSideBar: true,
                showCloseTags: false,
                arrayFilter: filterArray,
                pageSearch: 1,
                checkTags: [],
                optionFilter: newOptionFilter,
                filterRealtime: { ...this.state.filterRealtime, tags: check }
            }, () => {
                if (this.state.optionFilter.length > 0) {
                    this.functionFilter();
                    this.setState({ search: true })
                } else {
                    this.functionRemoveFilter();
                    this.setState({ search: false })
                }
            });
            return;
        }
        let checkList = [];
        let key = "";
        let value = "";
        check.map((item, index) => {
            key = `tagIds[${index}]`;
            value = item;
            checkList.push({ [key]: value });
        });
        const filterArray = this.state.arrayFilter.filter((it) => it !== "Hiển thị tất cả" && it !== "Lọc theo thẻ");
        const newOptionFilter = this.state.optionFilter.filter(item => !Object.keys(item)[0].match(regex))
        const newArrayFilter = [...filterArray, "Lọc theo thẻ"];
        this.setState({
            loaddingSideBar: true,
            checkTags: check,
            showCloseTags: true,
            pageSearch: 1,
            arrayFilter: newArrayFilter,
            search: true,
            optionFilter: [...newOptionFilter, ...checkList],
            filterRealtime: { ...this.state.filterRealtime, tags: check }
        }, () => this.functionFilter());
    }
    removeFilterTags = (check) => {
        const regex = /tagIds\[\d{1,3}\]/g;
        const newOptionFilter = this.state.optionFilter.filter(item => !Object.keys(item)[0].match(regex))
        const filterArray = this.state.arrayFilter.filter((it) => it !== "Lọc theo thẻ");
        this.setState({
            loaddingSideBar: true,
            pageSearch: 1,
            checkTags: [],
            showCloseTags: false,
            // optionFilter: [...newOptionFilter],
            // arrayFilter: [...filterArray],
            optionFilter: [],
            arrayFilter: [],
            filterRealtime: { ...this.state.filterRealtime, tags: [] }
        }, () => {
            if (this.state.arrayFilter.length === 0) {
                this.setState({
                    search: false,
                    arrayFilter: ["Hiển thị tất cả"],
                }, () => this.functionRemoveFilter())
            } else {
                this.functionFilter();
            }
        })
    }

    goback = () => {
        // this.removeFilterTags();
        this.props.navigation.goBack()
    }

    render() {
        // // console.log(this.props.fbPage.pageId, "convensions-----")
        // const { entry } = this.props;
        var titleView = this.state.currentViewIndex;
        if (titleView == 0) { titleView = __('Hội thoại') }
        if (titleView == 1) { titleView = __(`Đơn hàng`) }
        if (titleView == 2) { titleView = __(`Bài viết`) }

        // if (!entry) return null;

        let routes = {
            routes: [
                {
                    key: 'convension',
                    title: "Hội thoại",
                    icon: 'user-o',
                },
                // {
                //     key: 'order',
                //     title: 'Đơn hàng',
                //     icon: 'sticky-note-o',
                // }
            ],
            index: this.state.currentViewIndex,
        };
        // console.log(this.state.loading, "load===---")

        return (
            <Container style={styles.container}>
                <Toast
                    ref={c => {
                        if (c) Toast.toastInstance = c;
                    }}
                />
                {Platform.OS === 'ios' ? <StatusBar backgroundColor='#ffb400' barStyle='light-content' /> : <MyStatusBar backgroundColor='#ffb400' barStyle='light-content' />}
                <Toolbar
                    noShadow
                    icon={<Icon type='MaterialIcons' name='arrow-back' style={{ fontSize: 22, color: '#fff' }} size={22} />}
                    onIconPress={() => {
                        this.goback()
                    }}
                    actions={[
                        {
                            icon: <Icon type='MaterialIcons' name='menu' style={{ fontSize: 22, color: '#fff' }} />,
                            onPress: this.openSheet,
                            disabled: this.state.loading
                        }
                    ]}
                    // actions={[
                    //     {
                    //         icon: <Icon type='MaterialIcons' name='more-vert' style={{ fontSize: 22, color: '#fff' }} size={22} />,
                    //         menuItems: [
                    //             {
                    //                 icon: <Icon type='MaterialIcons' name='autorenew' style={{ fontSize: 20 }} size={20} />,
                    //                 text: __("Làm mới"),
                    //                 onPress: this.refresh,
                    //             },
                    //             {
                    //                 icon: <Icon type='MaterialIcons' name='edit' style={{ fontSize: 20 }} size={20} />,
                    //                 text: __("Sửa khách hàng"),
                    //                 onPress: this.edit,
                    //             },
                    //             {
                    //                 icon: <Icon type='MaterialIcons' name='delete' style={{ fontSize: 20 }} size={20} />,
                    //                 text: __("Xóa khách hàng"),
                    //                 onPress: this.delete,
                    //             }
                    //         ]
                    //     }
                    // ]}
                    titleText={titleView}
                ></Toolbar>
                {
                    this.state.loading && <Loading />
                }

                <FilterConvension
                    checkTags={this.state.checkTags}
                    pageId={this.props.fbPage.pageId}
                    filterConvension={
                        this.state.currentJob != null && this.state.currentBox == "actionSheet" ? true : false
                    }
                    items={[]}
                    open={this.state.currentJob != null && this.state.currentBox == "actionSheet"}
                    onRequestClose={() => this.showBox(null)}
                    title={__("Chế độ lọc")}
                    arrayFilter={this.state.arrayFilter}
                    filterTags={(item) => this.filterTags(item)}
                    removeFilterTags={this.removeFilterTags}
                    filterAll={(item) => this.filterAll(item)}
                    filterNotRead={(item) => this.filterNotRead(item)}
                    removeFilterNotRead={(item) => this.removeFilterNotRead(item)}
                    filterMessage={(item) => this.filterMessage(item)}
                    removeFilterMessage={(item) => this.removeFilterMessage(item)}
                    filterComment={(item) => this.filterComment(item)}
                    removeFilterComment={(item) => this.removeFilterComment(item)}
                    filterNotReply={(item) => this.filterNotReply(item)}
                    removeFilterNotReply={(item) => this.removefilterNotReply(item)}
                    filterHavePhone={(item) => this.filterHavePhone(item)}
                    removeFilterHavePhone={(item) => this.removeFilterHavePhone(item)}
                    filterNotPhone={(item) => this.filterNotPhone(item)}
                    removeFilterNotPhone={(item) => this.removeFilterNotPhone(item)}
                    filterHandle={(item) => this.filterHandle(item)}
                    removeFilterHandle={(item) => this.removeFilterHandle(item)}
                    filterNotHandle={(item) => this.filterNotHandle(item)}
                    removeFilterNotHandle={(item) => this.removeFilterNotHandel(item)}
                />
                <TabView
                    tabBarPosition="bottom"
                    style={styles.container}
                    navigationState={routes}
                    renderScene={this.renderView}
                    renderTabBar={this.renderViewHeader}
                    onIndexChange={this.handleChangeTab}
                    initialLayout={{ height: 0, width: Dimensions.get('window').width }}
                />
            </Container>
        )
    }

    renderIcon = ({ route }) => {
        return <Icon type='FontAwesome' name={route.icon} style={{ fontSize: 18, color: '#fff' }} />
    }

    renderLabel = ({ route }) => {
        return <Text style={{ color: '#fff', margin: 2 }}>
            {route.title}
        </Text>
    }

    handleChangeTab = (index) => {
        this.setState({
            currentViewIndex: index,
            selectedDate: null
        });
    };

    renderViewHeader = (props) => {
        return (
            <TabBar {...props}
                style={styles.tabBar}
                renderLabel={this.renderLabel}
                renderIcon={this.renderIcon}
                indicatorStyle={styles.indicator}
                scrollEnabled={false} />
        );
    };

    renderView = ({ route }) => {
        switch (route.key) {
            case 'convension':
                return this.renderConvension();
            // case 'order':
            //     return this.renderOrder();
        }
    };


    // onPress = (item) => {
    //     let { message } = this.props;
    //     let { page, pageSize } = this.state;
    //     this.props.actions.getConfigPage(item.pageId);
    //     this.props.actions.getConversationInbox(item.conversationId, item.pageId, message.fbUserId, page, pageSize)
    //         .then((data) => {
    //             this.props.onRequestClose();
    //             this.props.showBox(this.props.message, "viewChat");
    //         })
    //         .catch((e) => // console.log("err"))

    // }

    onPress = (conversation, index) => {
        const watched = 1;
        // if (conversation.conversationId != this.state.itemActive) {
        const { message } = this.props;
        const { pageSize, page, optionFilter, } = this.state;
        const { checkMerge } = this.props.message;
        // this.props.actions.getConversationId(conversation, index);
        this.setState({ itemActive: conversation.conversationId, loading: true });
        // console.log(conversation.typeMessage === 1, conversation.conversationId, conversation.pageId, message.fbUserId, page, pageSize, optionFilter, "===")

        if (conversation.typeMessage === 1) {
            // this.props.customer(conversation.customers[0]);
            this.props.actions.getConversationInbox(conversation.conversationId, conversation.pageId, message.fbUserId, page, pageSize, optionFilter)
                .then(() => {
                    // this.props.onRequestClose();
                    // console.log(conversation, index, "conversation, index---")
                    this.setState({ loading: false })

                    this.props.navigation.navigate("ConvensionChat", {
                        currentConvension: this.props.message,
                        currentChat: this.props.message,
                    });
                    // this.props.showBox(this.props.message, "viewChat");
                    // this.props.changefirstLoad();
                    // this.props.hideLoadingCv();
                    // this.props.actions.checkAsynInbox(conversation.conversationId, conversation.pageId)
                    //     .then((data) => {
                    //         this.props.checkAsync(data.check);
                    //     })
                })
                .catch((e) => {
                    // console.log(e, "conversation, index---")
                    this.setState({ loading: false })
                    // this.props.hideLoadingCv();
                });
            this.props.actions.changeStatusConversationNotAction(conversation.conversationId, watched);
        }

        else {
            this.setState({ loading: true })
            // this.props.customer(conversation.customers[0]);
            this.props.actions.getConversationComment(conversation.conversationId, conversation.pageId, message.fbUserId, page, pageSize, optionFilter)
                .then(() => {
                    this.setState({ loading: false })
                    // this.props.onRequestClose();
                    this.props.navigation.navigate("ConvensionChat", {
                        currentConvension: this.props.message,
                        currentChat: this.props.message,
                    });
                    // this.props.showBox(this.props.message, "viewChat");
                    // this.props.changefirstLoad();
                    // this.props.hideLoadingCv();
                })
                .catch(() => {
                    this.setState({ loading: false })
                    // this.props.hideLoadingCv();
                });
            this.props.actions.changeStatusConversationNotAction(conversation.conversationId, watched);
        }
        this.props.actions.checkConversationToLead(conversation.customers[0].id)
            .then(data => {
                // this.props.toLead(data.isLead);
            });
        // load template with pageId item
        // }
    }

    fbUser = (id) => {
        // // console.log("11", id)
        this.props.actions.fbUser(id);
        // this.props.actions.getFbUser(id);
    }

    isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        const paddingToBottom = 0;
        return layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom;
    };

    showTime = (time) => {
        const date = new Date();
        if (moment(time).isBefore(moment(date), 'day')) {
            return moment(time).fromNow();
        } else {
            return moment(time).format("HH:mm");
        }
    }

    renderConvension = () => {
        let { message } = this.props;
        // console.log(message?.conversations?.items, "convensions==========");
        // var view = convensions.filter(t => t.customers.length > 0);
        // var isViewMain = true;
        // if (!isViewMain && view) {
        //     view = view.filter(t => t.userId == this.context.user.id);
        // }
        var branchName = this.props.branch.items.filter((item) => item.id)
        if (message?.conversations?.items.length == 0) {
            return (
                <View style={{ alignItems: "center" }}>
                    <Text>{__("Danh sách trống")}</Text>
                </View>
            )
        }
        return (
            <ScrollView
                onScroll={({ nativeEvent }) => {
                    if (this.isCloseToBottom(nativeEvent)) {
                        if (!this.state.endScroll) {
                            this.scrollTo(this.state.page + 1);
                        }
                    }
                }}
                refreshControl={
                    <RefreshControl
                        tintColor="#28cc54"
                        title="Loading..."
                        titleColor="#00ff00"
                        colors={['#28cc54', '#00ff00', '#ff0000']}
                        refreshing={this.state.refreshing}
                        onRefresh={this.refresh}
                    />
                }
            >
                {

                    message?.conversations?.items?.filter(t => t.customers?.length > 0)
                        .map((item, key) => {
                            // // console.log(item, item.namePage, item.pageIdFb, "hah")
                            const url = request.url(item.customers[0].avatar, this.props.host);
                            // // console.log(url, "item.customers[0].avatar")
                            // itemActive == item.conversationId ? 'listview__item--active' : '',
                            // item.conversationStatus == 2 ? "listview__item--unread" : ''

                            return (
                                <RsTouchableNativeFeedback
                                    key={key + "-" + item.id}
                                >

                                    <List style={item.conversationStatus == 2 ? styles.unread : styles.unread1}>
                                        <ListItem
                                            avatar
                                            onPress={() => this.onPress(item, key)}
                                        >
                                            {item.unReadCount > 0 &&
                                                <View
                                                    style={styles.badget}
                                                >
                                                    <Text style={styles.badgetText}>{item.unReadCount}</Text>
                                                </View>
                                            }
                                            <Left>
                                                <Thumbnail source={{ uri: url }} />
                                            </Left>
                                            <Body>
                                                <Text style={item.conversationStatus == 2 ? styles.unreadText : styles.unreadText1}>{item.customers[0].fullName}</Text>
                                                <Text note numberOfLines={2} style={item.conversationStatus == 2 ? styles.unreadText : styles.unreadText1}>{item.lastMessageContent}</Text>
                                                {
                                                    !!item.tags && item.tags.length > 0 &&
                                                    (<View style={{ flexDirection: "row" }} >
                                                        {item.tags.map((x, kt) => {
                                                            return (
                                                                <Text key={kt} style={{ backgroundColor: x.color, width: 12, height: 12, borderRadius: 3, marginRight: 2 }}></Text>
                                                            )
                                                        })}

                                                    </View>
                                                    )
                                                }
                                                {
                                                    item.namePage ?
                                                        <View style={{ flexDirection: "row" }}>
                                                            <Thumbnail
                                                                style={{ width: 20, height: 20 }}
                                                                source={{ uri: `https://graph.facebook.com/${item.pageIdFb}/picture?app_id=${APP_ID.app_id}` }} />
                                                            <Text note style={item.conversationStatus == 2 ? styles.unreadText : styles.unreadText1}>{item.namePage}</Text>
                                                        </View> :
                                                        <Text note style={item.conversationStatus == 2 ? styles.unreadText : styles.unreadText1}>{ }</Text>
                                                }


                                            </Body>
                                            <Right>
                                                <Text note style={item.conversationStatus == 2 ? styles.unreadText : styles.unreadText1}>{this.showTime(item.time)}</Text>
                                                <Text note style={item.conversationStatus == 2 ? styles.unreadText : styles.unreadText1}>
                                                    <Icon type='MaterialIcons' name={item.typeMessage == 1 ? "markunread" : "comment"} size={12} style={styles.pagesActionIcon} />
                                                </Text>
                                            </Right>
                                        </ListItem>
                                    </List>
                                    {/*
                                    <View style={styles.pages}>
                                        <Avatar
                                            url={item.customers[0].avatar}
                                            name={item.customers[0].fullName}
                                            id={item.customers[0].id}
                                        // size={70} 
                                        />
                                        <View style={styles.pagesInfo}>
                                            <Text style={styles.pagesTitle} ellipsizeMode='tail' numberOfLines={1}>
                                                {item.customers[0].fullName}
                                            </Text>

                                        </View>
                                        {
                                            <View style={[styles.pagesAction]}>
                                                <RsTouchableNativeFeedback
                                                    // onPress={this.openActionSheet} 
                                                    rippleBorderless={true}
                                                >
                                                    <View>
                                                        <Icon type='MaterialIcons' name="chevron-right" size={25} style={styles.pagesActionIcon} />
                                                    </View>
                                                </RsTouchableNativeFeedback>
                                            </View>
                                        }
                                    </View>
                                    */}

                                </RsTouchableNativeFeedback>
                            )
                        })
                }
                {
                    // this.state.loading &&
                    // <View style={{ justifyContent: "center", alignItems: "center" }}>
                    //     <Spinner />
                    // </View>
                }

            </ScrollView>
        )
    }

    renderOrder = () => {
        return (
            <View style={{ justifyContent: "center", alignItems: "center" }}><Text>Chức năng đang được nâng cấp</Text></View>
        )
        return (
            <NoteItems entry={this.props.entry}
                refreshing={this.state.refreshing}
                onRefresh={this.refresh}
                activity={this.props.activity}
            />
        )
    }

    renderJobs = () => {
        return null
        // return (
        //     <JobItems
        //         entry={this.props.entry}
        //         refreshing={this.state.refreshing}
        //         onRefresh={this.refresh}
        //     />
        // )
    }

    renderOpportunities = () => {
        return null
        // return (
        //     <OpportunityItems
        //         entry={this.props.entry}
        //         refreshing={this.state.refreshing}
        //         onRefresh={this.refresh}
        //     />
        // )
    }
}

export default connect(CustomerDetailsBox, state => ({
    user: state.user,
    host: state.account.host,
    branch: state.branch,
    fbMessageTemplate: state.fbMessageTemplate,
    message: state.fbMessage,
    fbPage: state.fbPageMessage,
}), {
    ...actions,
    ...fbPageMessage
});

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: '#fff'
    },
    unread: {
        backgroundColor: "#efefeb",
        borderBottomColor: "#d9d5d5",
        borderBottomWidth: 1
    },
    unreadText: {
        fontWeight: "bold"
    },
    pagesActionIcon: {
        fontSize: 22
    },
    container: { flex: 1 },
    sidebar: {
        backgroundColor: '#f9f9f9',
    },
    customer: {
        flex: 1,
    },
    Avatar: {
        width: 70,
        height: 70,
        borderWidth: 2,
        borderColor: '#fff',
        borderRadius: 70,
        justifyContent: 'center',
        alignItems: 'center',

    },
    badgetText: {
        color: '#fff',
        fontSize: 12
    },

    badget: {
        position: 'absolute',
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9,
        left: 38,
        bottom: 16,
        width: 18,
        height: 18,
        backgroundColor: "red",
        borderRadius: 18
    },
    AvatarText: {
        color: '#fff',
        fontSize: 30
    },
    AvatarBackground: {
        backgroundColor: '#900',
    },
    nameDetails: {
        paddingLeft: 5,
        paddingRight: 25
    },
    fullname: {
        paddingLeft: 5,
        color: '#fff',
        fontSize: 22,
        fontWeight: 'normal'
    },
    rowname: {
        flexDirection: 'row',
        backgroundColor: '#81C784',
        alignItems: 'center',
        padding: 15,
        marginTop: 1
    },
    avatarContainer: {
        backgroundColor: '#81C784',
        alignItems: 'center',
        flexDirection: 'row'
    },
    // tabBar: {
    //     backgroundColor: '#4CAF50',
    //     maxHeight: 70
    // },
    tabBar: {
        backgroundColor: '#ffb400',
        paddingHorizontal: 0,
        zIndex: 0,
        elevation: 0,
        shadowOpacity: 0,
    },
    indicator: {
        backgroundColor: '#fff',
    },
    customerInfo: {
        flex: 1,
        padding: 10,
    },
    customerTitle: {
        flex: 1,
        color: '#fff',
        fontSize: 20,
        padding: 10,
        fontWeight: 'bold',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1
    },
    customerProp: {
        flexDirection: 'row',
        paddingVertical: 6,
    },
    icon: {
        marginTop: 3,
        fontSize: 14,
        color: '#444'
    },
    value: {
        fontSize: 15,
        color: '#555',
        marginLeft: 10
    },
    tabBar2: {
        backgroundColor: '#4CAF50',
        position: 'absolute',
        top: -50,
        left: 0,
        right: 0,
        bottom: 0,
        elevation: 0,
        shadowColor: 'black',
        shadowOpacity: 0,
        shadowRadius: 1.5,
        shadowOffset: {
            height: 1,
            width: 0
        },
    },
    // detailsumary: { position: 'absolute', bottom: 0, left: 0, right: 0 },
    sumary: {
        // backgroundColor: '#f2f2f2',
        paddingHorizontal: 10,
        paddingVertical: 3,
        // borderTopWidth: StyleSheet.hairlineWidth,
        // borderTopColor: '#efefeb',
        // flexDirection: 'row'
    },
    sumaryText: {
        flex: 1,
        // textAlign: 'center'
    },
    weight: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#333'
    },
    empty: {
        color: 'red',
        textAlign: 'center',
        padding: 10
    },

});