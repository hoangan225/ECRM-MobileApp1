import moment from 'moment';
import tvkd from 'tieng-viet-khong-dau';
import React, { PureComponent } from 'react';
// import Toast from 'react-native-simple-toast';
import {
    StyleSheet, ScrollView, TouchableOpacity,
    Image, Modal, FlatList, RefreshControl, Alert, Linking, Dimensions, TextInput, StatusBar, Platform
} from 'react-native';
import { Icon, View, Text, Container } from 'native-base';
import MyStatusBar from '../../statusBar/MyStatusBar';
import RsTouchableNativeFeedback from '../../controls/touchable-native-feedback';
import { connect } from '../../../lib/connect';
import * as actions from '../../../actions/facebookMessage/message';
import { getList as getListUser } from '../../../actions/user';
import Menu, { MenuModalContext } from '../../controls/action-menu';
import ActionButton from 'react-native-action-button';
import ImagePicker from '../../controls/imagePicker';
import ImageViewer from '../../controls/image-viewer';
import Toolbar from '../../controls/toolbars';
import KeyboardSpacer from '../../controls/keyboard-space';
import Avatar from '../../controls/avatar';
import APP_ID from "../../../constants/app_id";
import Hyperlink from 'react-native-hyperlink';
import request from "../../../lib/request";
import Loading from "../../controls/loading";
import Animated from 'react-native-reanimated';
import Tag from "./tagModal";
import FilterChat from "../../controls/modalMenu";
import Toast from '../../controls/toast';
import { generatorId } from "../../../lib/helpers";
class ViewChats extends PureComponent {
    constructor(props, context) {
        super(props, context);
        this.state = {
            showTag: false,
            showFilter: false,
            endScroll: false,
            page: 1,
            pageSize: 20,
            loading: false,
            inputHeight: 0,
            comment: null,
            commentImage: null,
            commentImageData: null,
            commentImages: [],
            currentImageIndex: null,
            showImageViewer: false,
            showImageViewerContent: false,
            currentImages: [],
            items: [],
            loaded: true,
            loading: false,
            content: "",
            attachments: [],
            // lay tu web
            templateMessage: '',
            shortcutkey: false,
            showEmoji: false,
            showImageManager: false,
            indexTemplateMessage: 0,
            showTemplateAuto: false,
            filter: "",
            fbUpload: false,
            fbFileUpload: [],
            opencreateTemplate: false,
            fbUpload: false,
            showTemplateMore: false,
            selectFiles: [],
            currentChat: props.navigation.state.params?.currentChat
        }

        // this.canCreateNote = this.context.user.hasCap("CustomerInfo.CreateNote");
        // this.canDeleteNote = this.context.user.hasCap("CustomerInfo.DeleteNote");
        this.images = [];
    }

    componentDidMount() {
        this.scrollToBottom();
    }

    scrollToRef = () => {
        setTimeout(() => this.messagesEndRef?.scrollTo({ x: 0, y: 280, animated: true }), 300)
    }

    isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        // console.log(contentOffset.y, "yy")
        return contentOffset.y <= 0;
    };

    scrollTo = () => {
        const { conversation } = this.props.message;
        const { page, pageSize, endScroll } = this.state;
        const conversationId = conversation?.conversationId;
        const { fbUserId } = this.props.message;
        // const messagesEndRef = this.messagesEndRef.current;
        const { getConversationInboxScroll, getConversationCommentScroll } = this.props.actions;
        // // console.log(conversation?.maxPage, "000", page, messagesEndRef)
        this.setState({
            endScroll: conversation?.maxPage > page ? false : true,
            loading: true
        })
        // console.log(conversation?.maxPage, page, "---")
        if (conversation?.maxPage > page) {
            this.setState({
                // scrollHeight: messagesEndRef.scrollHeight,
                page: parseInt(page + 1),
                loading: true,
            }, () => {
                if (conversation.typeMessage === 1) {
                    getConversationInboxScroll(conversationId, conversation.pageId, fbUserId, this.state.page, pageSize)
                        .then((data) => {
                            // console.log(data, "data00000")
                            this.setState({
                                loading: false,
                            });
                            this.scrollToRef();
                            // this.scrollToBottom();
                            // messagesEndRef.scrollTop = messagesEndRef.scrollHeight - this.state.scrollHeight - 100;
                        })
                        .catch(() => {
                            this.setState({
                                loading: false,
                            });
                        });
                } else {
                    this.setState({ loading: true });
                    getConversationCommentScroll(
                        conversationId,
                        conversation.pageId,
                        fbUserId,
                        this.state.page,
                        pageSize
                    ).then(() => {
                        this.setState({
                            loading: false,
                        });
                        this.scrollToRef();
                        // messagesEndRef.scrollTop = messagesEndRef.scrollHeight - this.state.scrollHeight - 100;
                    }).catch(() => {
                        this.setState({ loading: false });
                    });
                }
            });
        } else {
            this.setState({
                loading: false
            })
        }
        // let currentConvension = this.props.currentConvension;
        // this.setState({ loading: true, endScroll: false, page: this.state.page + 1 })
        // this.props.actions.getListScrollConversations(currentConvension.id, this.state.page)
        //     .then(data => {
        //         // // console.log(data, "datascroll")
        //         if (data.items.length == 0) {
        //             this.setState({ loading: false, endScroll: true })
        //         } else {
        //             this.setState({ loading: false, endScroll: false })
        //         }
        //     })
        //     .catch(error => {
        //         this.setState({ loading: false, endScroll: false })
        //         alert(error.error, 'error');
        //     });
    }

    onTextInputSizeChange = (event) => {
        this.setState({ inputHeight: event.nativeEvent.contentSize.height });
    }

    openLink = (link, type) => {
        Linking.canOpenURL(link).then(supported => {
            if (supported) {
                Linking.openURL(link);
            } else {
                console.log('Don\'t know how to open URI: ' + link);
            }
        });
    }

    addImage = (image) => {
        // // console.log(image, "image")
        this.images = [...this.images, image.url];
        this.setState({
            attachments: [...this.state.attachments, {
                ...image,
                id: image.id,
            }]
        });

    }

    removeImage = (index, image) => {
        this.state.attachments.splice(index, 1);
        this.setState({
            attachments: [...this.state.attachments]
        });

        this.images = this.images.filter(link => link != image.path);
    }

    sendMessage = () => {
        // // console.log(this.state, "this.state")
        const { templateMessage } = this.state;
        const { conversation, fbUserId } = this.props.message;
        // const { checkReply } = this.props;
        const checkReply = false; //chua biet lam gi
        const attachments = this.state.attachments;
        const psId = conversation.asid;
        let { pageIdFb } = this.props.fbPage;
        const { conversationId } = conversation;
        console.log(conversation.pageId, "conversation")
        const token = conversation.pageId || conversation.pageAccessToken;
        // const token = pageIdFb;
        const { optionFilter } = this.props;
        let image = []
        let index = null;
        let dataVirtual = null;
        let regex = /\/inbox\/(\d+)/;
        // attachments.map((item) => {
        //     switch (item.extension) {
        //         case "jepg": case "jpg": case "png": case "image": case "gif": case "sticker": case "flash": case "jpeg":
        //             var d = { url: request.url(item.url), type: "image" };
        //             image.push(d);
        //             break;
        //         case "video": case "3gp": case "avi": case "m4v": case "mkv": case "mp4":
        //         case "mov": case "mpeg": case "mpg": case "ogv": case "rmvb": case "webm": case "wmv":
        //             var d = { url: request.url(item.url), type: "video" };
        //             image.push(d);
        //             break;
        //         case "audio": case "aac": case "aif": case "aiff": case "mp3": case "mpg":
        //         case "ape": case "flac": case "hiu": case "m4a": case "org": case "ra": case "wma":
        //             var d = { url: request.url(item.url), type: "audio" };
        //             image.push(d);
        //             break;
        //         case "pptx": case "ppt": case "scrom": case "txt": case "doc": case "xlsx": case "docx": case "xls": case "pdf":
        //             var d = { url: request.url(item.url), type: "file" };
        //             image.push(d);
        //             break;
        //         default:
        //             var d = { url: request.url(item.url), type: "file" };
        //             image.push(d);
        //             break;
        //     }
        // });
        this.setState({
            attachments: []
        })
        if (conversation.typeMessage === 1) {
            let timeNow = moment.utc();

            const listTimes = conversation.messages.filter(item => item.pageScopeId != null).reverse();
            let index = listTimes.findIndex(item => item.pageScopeId != null);
            let equal24 = false;
            if (index === -1) {
                equal24 = true;
            }
            else {
                equal24 = moment(timeNow).diff(listTimes[index].createdTime) > 86400000
            }

            if (equal24) {
                Toast.show({
                    text: 'Vui lòng gửi tin quá 24h bằng extension trên máy tính',
                    duration: 2500,
                    position: 'bottom',
                    textStyle: { textAlign: 'center' },
                    buttonText: '',
                });
                return;
            }
            if (attachments.length > 0) {
                // this.props.showLoading();
                // send message by nobita extension
                this.setState({
                    modell: {
                        attachments: [],
                    },
                    templateMessage: "",
                });
                if (templateMessage && templateMessage.trim() !== "") {
                    dataVirtual = {
                        id: "123456789",
                        created_time: new Date(),
                        from: {
                            id: pageIdFb,
                            name: "xxx",
                            avatar: null
                        },
                        message: templateMessage,
                        mimeType: "",
                        attachmentUrls: [],
                        sticker: null,
                        hasAddress: false,
                        hasPhone: false,
                        isDeleted: false,
                        isHidden: false,
                        permalLink: "",
                        seen: false,
                        userLikes: false,
                        reaction: null,
                    };

                    // this.props.actions.createConversationVirtual(dataVirtual);

                    const data = {
                        Psid: psId,
                        FbUserId: fbUserId,
                        Content: templateMessage,
                        FullName: "Linh",
                    };

                    this.props.actions.createConversationInboxText(conversationId, data, token, optionFilter)
                        .then(() => {
                            this.scrollToBottom();
                        }).catch((error) => {
                            this.scrollToBottom();
                            Toast.show(error.message, 'danger');
                            console.log(error)
                        });
                    this.setState({
                        templateMessage: "",
                    });
                }
                attachments.map((item) => {
                    dataVirtual = {
                        id: "12345678910",
                        created_time: new Date(),
                        from: {
                            id: pageIdFb,
                            name: "xxx",
                            avatar: null
                        },
                        message: null,
                        mimeType: item.extension,
                        attachmentUrls: [{ attachmentUrl: request.url(item.url, this.props.host), fileName: request.url(item.url, this.props.host), mimeType: item.extension }],
                        fileName: item.title + '.' + item.extension,
                        sticker: null,
                        hasAddress: false,
                        hasPhone: false,
                        isDeleted: false,
                        isHidden: false,
                        permalLink: "",
                        seen: false,
                        userLikes: false,
                        reaction: null,
                    };
                    // this.props.actions.createConversationVirtual(dataVirtual);
                });

                image.map((item) => {
                    const data = {
                        Psid: psId,
                        FbUserId: fbUserId,
                        Type: item.type,
                        Url: request.url(item.url, this.props.host),
                        FullName: "Linh",
                    };
                    this.props.actions.createConversationInboxAttachment(conversationId, data, token, optionFilter)
                        .then(() => {

                        }).catch((error) => {
                            Toast.show(error.message, 'danger');
                            console.log(error)
                        });
                })
                this.setState({
                    modell: {
                        attachments: [],
                    },
                    templateMessage: "",
                });
            } else {
                if (templateMessage && templateMessage.trim() !== "") {
                    // this.props.showLoading();
                    dataVirtual = {
                        id: "123456789",
                        created_time: new Date(),
                        from: {
                            id: pageIdFb,
                            name: "xxx",
                            avatar: null
                        },
                        message: templateMessage,
                        mimeType: "",
                        attachmentUrls: null,
                        sticker: null,
                        reaction: null,
                    };


                    // this.props.actions.createConversationVirtual(dataVirtual);
                    const data = {
                        Psid: psId,
                        FbUserId: fbUserId,
                        Content: templateMessage,
                        FullName: "Linh",
                    };

                    this.props.actions.createConversationInboxText(conversationId, data, token, optionFilter)
                        .then(() => {
                            this.scrollToBottom();

                        }).catch((error) => {
                            this.scrollToBottom();
                            Toast.show(error.message, 'danger');
                            console.log(error)
                        });
                    this.setState({
                        templateMessage: "",
                    });
                }
            }
            // end inbox
        } else {
            if (attachments.length > 0) {
                // this.props.showLoading();
                if (checkReply) {
                    if (templateMessage) {
                        attachments.map((item) => {
                            index = conversation.messages.findIndex(it => it.id == checkReply);
                            dataVirtual = {
                                created_time: new Date(),
                                from: {
                                    name: "PAG1",
                                    id: pageIdFb,
                                    avatar: null,
                                },
                                message: templateMessage,
                                attachmentUrl: item.url,
                                fileName: item.title + '.' + item.extension,
                                id: "123456789",
                                mimeType: item.extension,
                                is_deleted: false,
                                permalink_url: "",
                                quote: {
                                    content: {
                                        attachmentUrl: conversation.messages[index]?.attachmentUrl,
                                        createdTime: conversation.messages[index]?.createdTime,
                                        messsage: conversation.messages[index]?.message,
                                        mimeType: conversation.messages[index]?.mimeType,
                                        name: conversation.messages[index]?.from?.name,
                                    }
                                }
                            };
                            // this.props.actions.createConversationVirtual(dataVirtual);
                        });
                    } else {
                        attachments.map((item) => {
                            index = conversation.messages.findIndex(it => it.id == checkReply);
                            dataVirtual = {
                                created_time: new Date(),
                                from: {
                                    name: "PAG1",
                                    id: pageIdFb,
                                    avatar: null,
                                },
                                message: null,
                                attachmentUrl: item.url,
                                fileName: item.title + '.' + item.extension,
                                id: "123456789",
                                mimeType: item.extension,
                                is_deleted: false,
                                permalink_url: "",
                                quote: {
                                    content: {
                                        attachmentUrl: conversation.messages[index]?.attachmentUrl,
                                        createdTime: conversation.messages[index]?.createdTime,
                                        messsage: conversation.messages[index]?.message,
                                        mimeType: conversation.messages[index]?.mimeType,
                                        name: conversation.messages[index]?.from?.name,
                                    }
                                }
                            };
                            // this.props.actions.createConversationVirtual(dataVirtual);
                        });
                    }
                } else {
                    if (templateMessage && templateMessage.trim() !== "") {
                        dataVirtual = {
                            id: "123456789",
                            created_time: new Date(),
                            from: {
                                id: pageIdFb,
                                name: "xxx",
                                avatar: null
                            },
                            message: templateMessage,
                            mimeType: "",
                            attachmentUrl: null,
                            sticker: null,
                            hasAddress: false,
                            hasPhone: false,
                            isDeleted: false,
                            isHidden: false,
                            permalLink: "",
                            seen: false,
                            userLikes: false,
                            reaction: null,
                        };
                        // this.props.actions.createConversationVirtual(dataVirtual);
                    }
                    attachments.map((item) => {
                        dataVirtual = {
                            created_time: new Date(),
                            from: {
                                name: "PAG1",
                                id: pageIdFb,
                                avatar: null,
                            },
                            message: null,
                            attachmentUrl: item.url,
                            fileName: item.title + '.' + item.extension,
                            id: "123456789",
                            mimeType: item.extension,
                            is_deleted: false,
                            permalink_url: "",
                            quote: null
                        };
                        // this.props.actions.createConversationVirtual(dataVirtual);
                    });
                    //  gửi data ảo comment text
                }
                // gửi data ảo hình ảnh
                const data = {
                    message: templateMessage,
                    can_hide: true,
                    attachments: image,
                };
                if (checkReply) {
                    this.props.hideReply();
                    index = conversation.messages.findIndex(it => it.id == checkReply);
                    const dataReply = {
                        "quote": {
                            "content": {
                                "attachmentUrl": conversation.messages[index]?.attachmentUrl,
                                "createdTime": conversation.messages[index]?.createdTime,
                                "messsage": conversation.messages[index]?.message,
                                "mimeType": conversation.messages[index]?.mimeType,
                                "name": conversation.messages[index]?.from?.name,
                            }
                        }
                    }
                    this.props.actions.replyComment(conversationId, conversation.pageId, data, dataReply, fbUserId, checkReply, optionFilter)
                        .then(() => {
                            this.scrollToBottom();
                            this.props.hideReply();

                        }).catch((error) => {
                            this.scrollToBottom();

                            this.props.hideReply();
                            Toast.show(error.message, 'danger');
                            console.log(error)
                        });
                    this.setState({
                        templateMessage: "",
                        modell: {
                            attachments: [],
                        }
                    });
                } else {
                    this.props.actions.createConversationComment(conversationId, conversation.pageId, data, fbUserId, optionFilter)
                        .then(() => {
                            this.scrollToBottom();

                        }).catch((error) => {
                            this.scrollToBottom();
                            Toast.show(error.message, 'danger');
                            console.log(error)
                        });
                    this.setState({
                        templateMessage: "",
                        modell: {
                            attachments: [],
                        }
                    });
                }
            }
            else {
                if (templateMessage && templateMessage.trim() !== "") {
                    // this.props.showLoading();
                    if (checkReply) {
                        index = conversation.messages.findIndex(it => it.id == checkReply);
                        dataVirtual = {
                            id: "123456789",
                            created_time: new Date(),
                            from: {
                                id: pageIdFb,
                                name: "xxx",
                                avatar: null
                            },
                            message: templateMessage,
                            mimeType: "",
                            attachmentUrl: null,
                            sticker: null,
                            reaction: null,
                            quote: {
                                content: {
                                    attachmentUrl: conversation.messages[index]?.attachmentUrl,
                                    createdTime: conversation.messages[index]?.createdTime,
                                    messsage: conversation.messages[index]?.message,
                                    mimeType: conversation.messages[index]?.mimeType,
                                    name: conversation.messages[index]?.from?.name,
                                }
                            }
                        }
                    } else {
                        dataVirtual = {
                            created_time: new Date(),
                            from: {
                                name: "PAG1",
                                id: pageIdFb,
                                avatar: null,
                            },
                            message: templateMessage,
                            attachmentUrl: null,
                            mimeType: "",
                            id: "123456789",
                            is_deleted: false,
                            permalink_url: ""
                        }
                    }
                    // this.props.actions.createConversationVirtual(dataVirtual);
                    const data = {
                        message: templateMessage,
                        can_hide: true,
                        attachments: [],
                    };
                    if (checkReply) {
                        this.props.hideReply();
                        index = conversation.messages.findIndex(it => it.id == checkReply);
                        const dataReply = {
                            "quote": {
                                "content": {
                                    "attachmentUrl": conversation.messages[index]?.attachmentUrl,
                                    "createdTime": conversation.messages[index]?.createdTime,
                                    "messsage": conversation.messages[index]?.message,
                                    "mimeType": conversation.messages[index]?.mimeType,
                                    "name": conversation.messages[index]?.from?.name,
                                }
                            }
                        }
                        this.props.actions.replyComment(conversationId, conversation.pageId, data, dataReply, fbUserId, checkReply, optionFilter)
                            .then(() => {
                                this.scrollToBottom();

                                this.props.hideReply();
                            }).catch((error) => {
                                this.scrollToBottom();

                                this.props.hideReply();
                                Toast.show(error.message, 'danger');
                                console.log(error)
                            });
                        this.setState({
                            templateMessage: ""
                        });
                    } else {
                        // console.log(conversationId, conversation.pageId, data, fbUserId, optionFilter, "conversationId, conversation.pageId, data, fbUserId, optionFilter")

                        this.props.actions.createConversationComment(conversationId, conversation.pageId, data, fbUserId, optionFilter)
                            .then(() => {
                                this.scrollToBottom();

                            }).catch((error) => {
                                this.scrollToBottom();
                                Toast.show(error.message, 'danger');
                                console.log(error)
                            });
                        this.setState({
                            templateMessage: ""
                        });
                    }
                }
            }
        }
        // this.scrollToBottom();
        // var model = {
        //     id: 0,
        //     rate: 1,
        //     customerId: this.props.entry.id || 0,
        //     userId: 0,
        //     createDate: null,
        //     content: this.state.content,
        //     attachments: this.state.attachments,
        //     tags: [],
        // };
        // if (this.state.content) {
        //     // this.noteInput.blur();

        //     this.setState({ loading: true });
        //     this.props.actions.createNote({ ...model })
        //         .then(data => {
        //             // this.flatList.scrollToOffset(0);
        //             this.setState({
        //                 loading: false,
        //                 content: ''
        //             });
        //             this.applySearch({ customerId: this.props.entry.id });
        //             // Toast.show(__('Thêm mới thành công'));
        //             Toast.show({
        //                 text: 'Thêm mới thành công',
        //                 duration: 2500,
        //                 position: 'bottom',
        //                 textStyle: { textAlign: 'center' },
        //                 
        //             });
        //         })
        //         .catch(error => {
        //             this.setState({ loading: false });
        //             alert(error.error, error.message, 'error');
        //         });

        //     this.setState({
        //         content: '',
        //         attachments: []
        //     });
        // } else {
        //     alert('Vui lòng nhập nội dung ghi chú')
        // }
    }

    scrollToBottom = (evt) => {
        // console.log(evt, "evt")
        setTimeout(() => this.messagesEndRef?.scrollToEnd({ animated: true }), 300)
    }

    deleteComment = id => {
        this.setState({ currentDeleteItemId: id });
        this.props.actions.removeNote(id)
            .then(() => {
                Toast.show({
                    text: 'Xóa thành công',
                    duration: 2500,
                    position: 'bottom',
                    textStyle: { textAlign: 'center' },
                    buttonText: '',
                });
                this.setState({ currentDeleteItemId: null });
            })
            .catch(error => {
                // console.log(error)
                Toast.show(error, 'danger');
                this.setState({ currentDeleteItemId: null });
            });
    }

    onRequestClose = () => {
        // if (this.state.changed) {
        //     Alert.alert(
        //         __('Lưu thay đổi?'),
        //         __('Một vài trường dữ liệu đã được thay đổi, bạn có muốn lưu lại không?'),
        //         [
        //             { text: '', onPress: () => // console.log('Ask me later pressed') },
        //             { text: 'Cancel', onPress: () => this.props.onRequestClose() },
        //             { text: 'OK', onPress: () => this.save() },
        //         ],
        //         { cancelable: false }
        //     )
        // }
        // else {
        this.props.onRequestClose();
        this.props.navigation.goBack()
        let currentChat = this.props.navigation.state.params?.currentChat;
        this.props.onRequestCloseConvension(currentChat.conversation?.messages[0].pageId || null);
        // // console.log(this.props.currentChat.conversation?.messages[0].pageId, "------=====")
        // }
    }

    showTime = (time) => {
        const date = new Date();
        if (moment(time).isBefore(moment(date), 'day')) {
            return moment(time).fromNow();
        } else {
            return moment(time).format("HH:mm");
        }
    }


    openTag = () => {
        this.setState({
            showTag: true
        })
    }

    openFilter = () => {
        this.setState({
            showFilter: true
        })
    }

    makeid = (length) => {
        return generatorId(length);
        // var result = '';
        // var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        // var charactersLength = characters.length;
        // for (var i = 0; i < length; i++) {
        //     result += characters.charAt(Math.floor(Math.random() *
        //         charactersLength));
        // }
        // return result;
    }

    onChangeText = (value) => {
        this.setState({ templateMessage: value })
    }

    render() {
        let currentChat = this.props.navigation.state.params?.currentChat?.conversation?.messages;
        // let currentChat = this.props.currentChat?.conversation?.messages;
        if (!currentChat || currentChat.length == 0) {
            return null;
        }
        // currentChat.map(item => {
        //     return {
        //         id: item.id,
        //         attachmentUrls: item.attachmentUrls,
        //         createdTime: item.createdTime,
        //         from: item.from,
        //         isDeleted: item.isDeleted,
        //         isHidden: item.isHidden,
        //         message: item.message,
        //         pageId: item.pageId,
        //         pageScopeId: item.pageScopeId,
        //         seen: item.seen,
        //         template: item.template,
        //         userLikes: item.userLikes,
        //         updatedTime: item.updatedTime,
        //         userRep: item.userRep
        //     }
        // });

        // if (!currentChat || currentChat.length == 0) {
        //     currentChat = [
        //         { id: 0, customerId: 127, object: "Note", date: "", action: 1, title: __("Thêm khách hàng"), content: __('Chưa có ghi chú') }];
        // }

        // if (this.state.showTag) {
        //     return (
        //         <Tag
        //             show={this.state.showTag}
        //             onCancel={() => this.setState({ showTag: false })}
        //         />
        //     )
        // }

        // if (this.state.showFilter) {
        //     return (
        //         <FilterChat
        //             open={this.state.showFilter}
        //             onRequestClose={() => this.setState({ showFilter: false })}
        //             title={""}
        //             filterChat={this.state.showFilter ? true : false}
        //             items={[]}
        //         />
        //     )
        // }

        return (
            <Container>
                {Platform.OS === 'ios' ? <StatusBar backgroundColor='#ffb400' barStyle='light-content' /> : <MyStatusBar backgroundColor='#ffb400' barStyle='light-content' />}

                <Toolbar
                    icon={<Icon type='MaterialIcons' name='arrow-back' style={{ fontSize: 22, color: '#fff' }} />}
                    onIconPress={() => { this.props.navigation.goBack() }}
                    actions={[
                        {
                            icon: <Icon type='MaterialIcons' name='loyalty' style={{ fontSize: 22, color: '#fff' }} />,
                            onPress: this.openTag,
                            disabled: this.state.loading
                        },
                        {
                            icon: <Icon type='MaterialIcons' name='menu' style={{ fontSize: 22, color: '#fff' }} />,
                            onPress: this.openFilter,
                            disabled: this.state.loading
                        }
                    ]}
                    titleText='Chat'
                    style={styles.toolbar}
                ></Toolbar>
                <View style={{ flex: 1, backgroundColor: "#e3f2fd" }}>
                    <Toast
                        ref={c => {
                            if (c) Toast.toastInstance = c;
                        }}
                    />
                    {
                        this.state.loading && <Loading />
                    }
                    {
                        // this.state.loading &&
                        // <View style={{ justifyContent: "center", alignItems: "center" }}>
                        //     <Spinner />
                        // </View>
                    }
                    <ScrollView
                        ref={ref => this.messagesEndRef = ref}
                        onScroll={({ nativeEvent }) => {
                            if (this.isCloseToBottom(nativeEvent)) {
                                if (!this.state.endScroll && !this.state.loading) {
                                    this.scrollTo();
                                }
                            }
                        }}
                    // refreshControl={
                    //     <RefreshControl
                    //         tintColor="#28cc54"
                    //         title="Loading..."
                    //         titleColor="#00ff00"
                    //         colors={['#28cc54', '#00ff00', '#ff0000']}
                    //         refreshing={this.state.loading}
                    //         onRefresh={() => this.scrollTo()}
                    //     />
                    // }

                    >
                        {
                            currentChat.length > 0 &&
                            currentChat.map((item, key) => {
                                return this.renderItem(item, key + this.makeid(6))
                            })
                        }
                    </ScrollView>
                </View>
                <View style={styles.commentBox}>
                    <View style={styles.commentImages}>
                        {
                            !!this.state.attachments &&
                            this.state.attachments.map((image, index) => (
                                <View style={styles.commentImage} key={index + this.makeid(6)}>
                                    <Image source={{ uri: this.props.host + image.url }} style={{ width: 60, height: 60 }} />
                                    <TouchableOpacity
                                        style={styles.removeImage}
                                        onPress={() => this.removeImage(index, image)}>
                                        <Icon name="close" type='MaterialIcons' style={{ fontSize: 14, color: '#fff' }} />
                                    </TouchableOpacity>
                                </View>
                            ))
                        }
                    </View>
                    <View style={styles.addComment}>
                        <ImagePicker
                            onSuccess={image => this.addImage(image)}
                            cropping={true}
                            editstyle='edit'
                            multi={true}
                            uploadOptions={{
                                path: '/convension/chat',
                                insertDb: true,
                                overwrite: false,
                                createThumbnail: true,
                                imageWidth: 200,
                                imageHeight: 200
                            }}
                        >
                            <View style={styles.commentSend}>
                                <Icon name="camera" type='MaterialIcons' style={{ fontSize: 22, color: '#444' }} />
                            </View>
                        </ImagePicker>
                        <TextInput
                            // ref={ref => this.noteInput = ref}
                            style={[styles.commentInput, { height: Math.max(45, this.state.inputHeight) }]}
                            placeholder='Nhập tin nhắn..'
                            underlineColorAndroid='transparent'
                            value={this.state.templateMessage}
                            onChangeText={value => this.onChangeText(value)}
                            onContentSizeChange={this.onTextInputSizeChange}
                            multiline={true}
                        // onSubmitEditing={this.sendMessage} 
                        />
                        <RsTouchableNativeFeedback onPress={this.sendMessage}>
                            <View style={styles.commentSend}>
                                <Icon name="send" type='MaterialIcons' style={{ fontSize: 22, color: '#333' }} />
                            </View>
                        </RsTouchableNativeFeedback>
                    </View>
                </View>

                <KeyboardSpacer iosOnly={true} />
                <ImageViewer
                    index={this.state.currentImageIndex}
                    visible={this.state.showImageViewer}
                    images={this.images}
                    onRequestClose={() => this.setState({ showImageViewer: false })} />
                <ImageViewer
                    enableImageZoom={true}
                    index={this.state.currentImageIndex}
                    visible={this.state.showImageViewerContent}
                    images={this.state.currentImages.map(at => {
                        return at.attachmentUrl;
                    })}
                    onRequestClose={() => this.setState({ showImageViewerContent: false })} />
                {
                    this.state.showTag
                    && (
                        <Tag
                            show={this.state.showTag}
                            onCancel={() => this.setState({ showTag: false })}
                        />
                    )
                }

                {
                    this.state.showFilter
                    && (
                        <FilterChat
                            open={this.state.showFilter}
                            onRequestClose={() => this.setState({ showFilter: false })}
                            title={""}
                            filterChat={this.state.showFilter ? true : false}
                            items={[]}
                        />
                    )
                }
            </Container>
        )
    }

    showImageViewerContent = (index, item) => {
        // console.log(index, item, "index, item")
        this.setState({
            showImageViewerContent: true,
            currentImageIndex: index,
            currentImages: item
        })
    }

    conversationLike = (item) => {
        const { conversation } = this.props.message;
        const { fbUserId } = this.props.message;
        if (item.userLikes) {
            this.props.actions.unlineConversationComment(
                item.id,
                conversation.pageId,
                fbUserId
            );
        } else {
            this.props.actions.likeConversationComment(
                item.id,
                conversation.pageId,
                fbUserId
            );
        }
    }

    showModalMessageCustumer = (psid, idComment) => {
        this.setState({
            idComment: idComment,
            conversationSend: true,
            psidCustumer: psid,
        });
    }

    conversationSee = (item) => {
        const { conversation } = this.props.message;
        const { fbUserId } = this.props.message;
        if (item.isHidden) {
            const data = {
                is_hidden: false,
            };
            this.props.actions
                .showConversationComment(item.id, conversation.pageId, fbUserId, data)
                .then(() => {
                    Toast.show({
                        text: 'Hiện bình luận thành công',
                        duration: 2500,
                        position: 'bottom',
                        textStyle: { textAlign: 'center' },
                        buttonText: '',
                    });
                })
                .catch(() => {
                    Toast.show({
                        text: 'Hiện bình luận không thành công',
                        duration: 2500,
                        position: 'bottom',
                        textStyle: { textAlign: 'center' },
                        buttonText: '',
                    });
                });
        } else {
            const data = {
                is_hidden: true,
            };
            this.props.actions
                .hideConversationComment(item.id, conversation.pageId, fbUserId, data)
                .then(() => {
                    Toast.show({
                        text: 'Ẩn bình luận thành công',
                        duration: 2500,
                        position: 'bottom',
                        textStyle: { textAlign: 'center' },
                        buttonText: '',
                    });
                })
                .catch(() => {
                    Toast.show({
                        text: 'Lỗi ẩn bình luận',
                        duration: 2500,
                        position: 'bottom',
                        textStyle: { textAlign: 'center' },
                        buttonText: '',
                    });
                });
        }
    }

    conversationDelete = (item) => {
        const { conversation } = this.props.message;
        const { conversationDeleteId } = this.state;
        Alert.alert(
            __('Bạn có chắc muốn xóa bình luận?'),
            __('Nếu Ok bình luận này sẽ bị xóa'),
            [
                {
                    text: 'Cancel', onPress: () => console.log("close")
                },
                {
                    text: 'OK', onPress: () => {
                        this.props.actions.deleteConversationComment(item.id, conversation.pageId)
                            .then(() => {
                                Toast.show({
                                    text: 'Xóa thành công',
                                    duration: 2500,
                                    position: 'bottom',
                                    textStyle: { textAlign: 'center' },
                                    buttonText: '',
                                });
                                this.setState({
                                    conversationDeleteId: null,
                                    hideEditComment: true,
                                    hideEditCommentId: null
                                });
                            }).catch((error) => {
                                Toast.show({
                                    text: 'Xóa lỗi',
                                    duration: 2500,
                                    position: 'bottom',
                                    textStyle: { textAlign: 'center' },
                                    buttonText: '',
                                });
                                this.setState({
                                    conversationDeleteId: null,
                                    hideEditComment: true,
                                    hideEditCommentId: null
                                })
                            });
                    }
                },
            ],
            { cancelable: false }
        )
    }

    openLink = async (link) => {
        await Linking.openURL(link);
    }

    renderItem = (item, key) => {
        // // console.log(key + item.id + "-", "key + item.id ")
        // let currentChat = this.props.navigation.state.params?.currentChat;
        // let getAvatar = request.url(currentChat?.conversation?.customer?.customer?.avatar || "", this.props.host);

        // if (item.pageScopeId) {
        // console.log(getAvatar, "getAvatar---------==============akdfhsi", currentChat?.conversation?.customer)
        // }
        // console.log(item)
        let currentChat = this.state.currentChat;
        // console.log(currentChat?.conversation?.conversationId, "currentChat")
        let asid = currentChat?.conversation?.asid;
        let conversation = currentChat?.conversation;

        // console.log(conversation?.customer?.customer?.avatar, "conversation.customer.customer.avatar")
        // // console.log(this.props.currentChat?.conversation, "this.props.currentChat?.conversation")

        const inner = (
            conversation.typeMessage === 1 ?
                (
                    <View
                        key={key + item.id + this.makeid(6)}
                        style={[{ flex: 1 }, styles.comment, asid === item.from.id ? styles.client : styles.owner]}
                    >
                        {
                            asid === item.from.id &&
                            (

                                key == 0 ? (
                                    <Avatar
                                        style={{ margin: 0, marginRight: 5, }}
                                        url={
                                            request.url(conversation?.customer?.customer?.avatar || "", this.props.host)
                                            // `https://platform-lookaside.fbsbx.com/platform/profilepic/?psid=${item.from?.id + "&height=200&width=200&ext=1630485443&hash=AeQzzjzddJXFJdbqu8w"}`
                                        }
                                        name={""}
                                        id={item.pageId} />
                                ) : conversation.messages[key - 1]?.from?.id !== conversation.messages[key]?.from?.id ? (
                                    <Avatar
                                        style={{ margin: 0, marginRight: 5, }}
                                        url={
                                            request.url(conversation?.customer?.customer?.avatar || "", this.props.host)
                                            // `https://platform-lookaside.fbsbx.com/platform/profilepic/?psid=${item.from?.id + "&height=200&width=200&ext=1630485443&hash=AeQzzjzddJXFJdbqu8w"}`
                                        }
                                        name={""}
                                        id={item.pageId}
                                    />
                                ) :
                                    (<Avatar
                                        style={{ margin: 0, marginRight: 5, }}
                                        url={
                                            request.url(conversation?.customer?.customer?.avatar || "", this.props.host)
                                            // `https://platform-lookaside.fbsbx.com/platform/profilepic/?psid=${item.from?.id + "&height=200&width=200&ext=1630485443&hash=AeQzzjzddJXFJdbqu8w"}`
                                        }
                                        name={""}
                                        id={item.pageId}
                                    // style={{ marginLeft: 4 }}
                                    // none 
                                    />)

                            )

                        }
                        {
                            (!!item.message && item.message) &&
                            <View style={[asid === item.from.id ? [styles.clientContent, item.message.length > 50 && { flex: 1 }] : styles.ownerContent]}>
                                {
                                    <Hyperlink
                                        linkStyle={{ color: "#f2f2f2" }}
                                        linkDefault={true}
                                    >
                                        <Text style={styles.commentContent, [asid != item.from.id && { color: "#fff" }]}>{item.message}</Text>
                                    </Hyperlink>
                                    // <Text style={styles.commentContent, [!item.pageScopeId && { color: "#fff" }]}>{item.message}</Text>
                                }
                            </View>
                        }
                        {
                            item.attachmentUrls && item.attachmentUrls.length > 0 &&
                            <View style={[styles.commentAttachs, item.attachmentUrls.length > 0 && { flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-end" }]}>
                                {

                                    item.attachmentUrls.map((at, index) => {
                                        let url = request.url(at.attachmentUrl, this.props.host);
                                        // let file = account.host + at.thumbnail;
                                        // let link = account.host + at.url;
                                        // let title = at.title.substr(at.title.lastIndexOf("/") + 1);
                                        return (
                                            <RsTouchableNativeFeedback
                                                key={index + this.makeid(6)}
                                                onPress={() => this.showImageViewerContent(index, item.attachmentUrls)}
                                            >
                                                <View style={[styles.commentAttach]}>
                                                    <View style={styles.attach}>
                                                        <Image style={{ flex: 1 }} source={{ uri: url }} resizeMode='stretch' />
                                                    </View>
                                                </View>

                                            </RsTouchableNativeFeedback>
                                        )
                                    })
                                }
                            </View>
                        }
                    </View>) :  // end message
                (
                    <View style={[styles.comment, item.from.avatar ? styles.client : styles.owner]}>
                        {
                            item.from.avatar &&
                            (

                                key == 0 ? (
                                    <Avatar
                                        style={{ margin: 0, marginRight: 5, }}
                                        url={
                                            request.url(item.from.avatar, this.props.host)

                                            // `https://platform-lookaside.fbsbx.com/platform/profilepic/?psid=${item.from?.id + "&height=200&width=200&ext=1630485443&hash=AeQzzjzddJXFJdbqu8w"}`
                                        }
                                        name={item.from.name || "N"}
                                        id={item.pageId} />
                                ) : conversation.messages[key - 1]?.from?.id !== conversation.messages[key]?.from?.id ? (
                                    <Avatar
                                        style={{ margin: 0, marginRight: 5, }}
                                        url={
                                            request.url(item.from.avatar, this.props.host)
                                            // `https://platform-lookaside.fbsbx.com/platform/profilepic/?psid=${item.from?.id + "&height=200&width=200&ext=1630485443&hash=AeQzzjzddJXFJdbqu8w"}`
                                        }
                                        name={item.from.name || "N"}
                                        id={item.pageId} />
                                ) :
                                    (
                                        <Avatar
                                            style={{ margin: 0, marginRight: 5, }}
                                            url={
                                                request.url(item.from.avatar, this.props.host)
                                                // `https://platform-lookaside.fbsbx.com/platform/profilepic/?psid=${item.from?.id + "&height=200&width=200&ext=1630485443&hash=AeQzzjzddJXFJdbqu8w"}`
                                            }
                                            name={item.from.name || "N"}
                                            id={item.pageId}
                                        // style={{ marginLeft: 4 }}
                                        // none 
                                        />)

                            )

                        }
                        {
                            (!!item.message && item.message && !!item.attachmentUrl) ?  //neu tin nhan va  hinh anh
                                <View style={[item.from.avatar ? [styles.clientContent, item.message.length > 50 && { flex: 1 }] : styles.ownerContent]}>
                                    {
                                        !!item.attachmentUrl ?
                                            <View style={[styles.commentAttachs]}>
                                                {
                                                    item.attachmentUrl && item.attachmentUrl != "" &&
                                                    <RsTouchableNativeFeedback
                                                        onPress={() => this.showImageViewerContent(1, [{ attachmentUrl: request.url(item.attachmentUrl, this.props.host) }])}
                                                    >
                                                        <View style={[styles.commentAttach]}>
                                                            <View style={styles.attach}>
                                                                <Image style={{ flex: 1 }} source={{ uri: request.url(item.attachmentUrl, this.props.host) }} resizeMode='stretch' />
                                                            </View>
                                                        </View>

                                                    </RsTouchableNativeFeedback>
                                                }
                                            </View>
                                            : <View></View>
                                    }
                                    {
                                        <Hyperlink
                                            linkStyle={{ color: "#f2f2f2" }}
                                            linkDefault={true}
                                        >
                                            <Text style={styles.commentContent, [!item.from.avatar && { color: "#fff" }, item.isDeleted && { opacity: 0.6 }]}>{item.message}</Text>
                                            {item.isDeleted && <Text style={styles.commentContent, [!item.from.avatar && { color: "#fff" }, { opacity: 0.6, fontStyle: "italic", fontSize: 12 }]}>Bình luận đã xóa</Text>}
                                        </Hyperlink>
                                        // <Text style={styles.commentContent, [!item.pageScopeId && { color: "#fff" }]}>{item.message}</Text>
                                    }
                                    {item.from.avatar && !item.isDeleted ?
                                        <View style={styles.actionsComment}>
                                            <TouchableOpacity
                                                style={styles.iconComment}
                                                onPress={() => this.conversationLike(item)}
                                            >
                                                <Icon type='MaterialIcons' name='thumb-up' style={{ fontSize: 18, color: item.userLikes ? '#fed12b' : '#efefeb' }} />
                                            </TouchableOpacity>
                                            {/**
                                    <TouchableOpacity
                                        style={styles.iconComment}
                                        onPress = {() =>
                                            this.showModalMessageCustumer(item.from, item.id)
                                        }
                                    >
                                        <Icon type='MaterialIcons' name='comment' style={{ fontSize: 18, color: '#efefeb' }} />
                                    </TouchableOpacity>
                                     */}
                                            <TouchableOpacity
                                                style={styles.iconComment}
                                                onPress={() => this.conversationSee(item)}
                                            >
                                                <Icon type='MaterialIcons' name='visibility-off' style={{ fontSize: 18, color: item.isHidden ? '#fed12b' : '#efefeb' }} />
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={styles.iconComment}
                                                onPress={() => this.openLink(item.permalLink)}
                                            >
                                                <Icon type='FontAwesome' name='facebook-f' style={{ fontSize: 18, color: '#efefeb' }} />
                                            </TouchableOpacity>


                                            <TouchableOpacity
                                                style={styles.iconComment}
                                                onPress={() => this.conversationDelete(item)}
                                            >
                                                <Icon type='MaterialIcons' name='delete' style={{ fontSize: 18, color: item.isDeleted ? 'red' : '#efefeb' }} />
                                            </TouchableOpacity>
                                        </View> :  // neu la khach
                                        <View style={styles.actionsComment}>
                                            <TouchableOpacity
                                                style={styles.iconComment}
                                                onPress={() =>
                                                    this.editComment(item.id, item.message)
                                                }
                                            >
                                                <Icon type='MaterialIcons' name='edit' style={{ fontSize: 18, color: '#fff' }} />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={styles.iconComment}
                                                onPress={() => this.conversationDelete(item)}
                                            >
                                                <Icon type='MaterialIcons' name='delete' style={{ fontSize: 18, color: '#fff' }} />
                                            </TouchableOpacity>
                                        </View>  //neu la chu
                                    }
                                </View> :
                                (!!item.message && item.message) ?  //neu chi tin nhan
                                    <View style={[item.from.avatar ? [styles.clientContent, item.message.length > 50 && { flex: 1 }] : styles.ownerContent]}>
                                        {
                                            <Hyperlink
                                                linkStyle={{ color: "#f2f2f2" }}
                                                linkDefault={true}
                                            >
                                                <Text style={styles.commentContent, [!item.from.avatar && { color: "#fff" }, item.isDeleted && { opacity: 0.6 }]}>{item.message}</Text>
                                                {item.isDeleted && <Text style={styles.commentContent, [!item.from.avatar && { color: "#fff" }, { opacity: 0.6, fontStyle: "italic", fontSize: 12 }]}>Bình luận đã xóa</Text>}
                                            </Hyperlink>
                                            // <Text style={styles.commentContent, [!item.pageScopeId && { color: "#fff" }]}>{item.message}</Text>
                                        }
                                        {item.from.avatar && !item.isDeleted &&
                                            <View style={styles.actionsComment}>
                                                <TouchableOpacity
                                                    style={styles.iconComment}
                                                    onPress={() => this.conversationLike(item)}
                                                >
                                                    <Icon type='MaterialIcons' name='thumb-up' style={{ fontSize: 18, color: item.userLikes ? '#fed12b' : '#efefeb' }} />
                                                </TouchableOpacity>
                                                {/**
                                        <TouchableOpacity
                                            style={styles.iconComment}
                                            onPress = {() =>
                                                this.showModalMessageCustumer(item.from, item.id)
                                            }
                                        >
                                            <Icon type='MaterialIcons' name='comment' style={{ fontSize: 18, color: '#efefeb' }} />
                                        </TouchableOpacity>
                                         */}
                                                <TouchableOpacity
                                                    style={styles.iconComment}
                                                    onPress={() => this.conversationSee(item)}
                                                >
                                                    <Icon type='MaterialIcons' name='visibility-off' style={{ fontSize: 18, color: item.isHidden ? '#fed12b' : '#efefeb' }} />
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    style={styles.iconComment}
                                                    onPress={() => this.openLink(item.permalLink)}
                                                >
                                                    <Icon type='FontAwesome' name='facebook-f' style={{ fontSize: 18, color: '#efefeb' }} />
                                                </TouchableOpacity>


                                                <TouchableOpacity
                                                    style={styles.iconComment}
                                                    onPress={() => this.conversationDelete(item)}
                                                >
                                                    <Icon type='MaterialIcons' name='delete' style={{ fontSize: 18, color: item.isDeleted ? 'red' : '#efefeb' }} />
                                                </TouchableOpacity>
                                            </View>}
                                    </View> :
                                    !!item.attachmentUrl ?   // neu chi hinh anh
                                        <View style={[styles.commentAttachs, item.from.avatar ? [styles.clientContent, item.message.length > 50 && { flex: 1 }] : styles.ownerContent]}>
                                            {
                                                item.attachmentUrl && item.attachmentUrl != "" &&
                                                <RsTouchableNativeFeedback
                                                    onPress={() => this.showImageViewerContent(1, [{ attachmentUrl: item.attachmentUrl }])}
                                                >
                                                    <View style={[styles.commentAttach]}>
                                                        <View style={styles.attach}>
                                                            <Image style={{ flex: 1 }} source={{ uri: request.url(item.attachmentUrl, this.props.host) }} resizeMode='stretch' />
                                                        </View>
                                                    </View>

                                                </RsTouchableNativeFeedback>
                                            }
                                            {item.from.avatar && !item.isDeleted &&
                                                <View style={styles.actionsComment}>
                                                    <TouchableOpacity
                                                        style={styles.iconComment}
                                                        onPress={() => this.conversationLike(item)}
                                                    >
                                                        <Icon type='MaterialIcons' name='thumb-up' style={{ fontSize: 18, color: item.userLikes ? '#fed12b' : '#efefeb' }} />
                                                    </TouchableOpacity>
                                                    {/**
                                                    <TouchableOpacity
                                                        style={styles.iconComment}
                                                        onPress = {() =>
                                                            this.showModalMessageCustumer(item.from, item.id)
                                                        }
                                                    >
                                                        <Icon type='MaterialIcons' name='comment' style={{ fontSize: 18, color: '#efefeb' }} />
                                                    </TouchableOpacity>
                                                     */}
                                                    <TouchableOpacity
                                                        style={styles.iconComment}
                                                        onPress={() => this.conversationSee(item)}
                                                    >
                                                        <Icon type='MaterialIcons' name='visibility-off' style={{ fontSize: 18, color: item.isHidden ? '#fed12b' : '#efefeb' }} />
                                                    </TouchableOpacity>

                                                    <TouchableOpacity
                                                        style={styles.iconComment}
                                                        onPress={() => this.openLink(item.permalLink)}
                                                    >
                                                        <Icon type='FontAwesome' name='facebook-f' style={{ fontSize: 18, color: '#efefeb' }} />
                                                    </TouchableOpacity>


                                                    <TouchableOpacity
                                                        style={styles.iconComment}
                                                        onPress={() => this.conversationDelete(item)}
                                                    >
                                                        <Icon type='MaterialIcons' name='delete' style={{ fontSize: 18, color: item.isDeleted ? 'red' : '#efefeb' }} />
                                                    </TouchableOpacity>
                                                </View>}
                                        </View>
                                        : <View></View>
                        }

                    </View>
                )  // end comment
        );

        return (
            <Menu
                overlayColor='rgba(0,0,0,.2)'
                menuWidth={180}
                trigger={inner}
            // showOnLongPress={true}
            >
                <Menu.MenuItem
                    text="Xóa tin nhắn"
                // onPress={() => this.deleteComment(item.id)} 
                />
            </Menu>
        );
    }
}

export default connect(ViewChats, state => ({
    fbMessageTemplate: state.fbMessageTemplate,
    message: state.fbMessage,
    fbPage: state.fbPageMessage,
    host: state.account.host,
    branch: state.branch,
}), {
    ...actions,
    getListUser
});
const styles = StyleSheet.create({
    comment: {
        paddingHorizontal: 8,
        // flexWrap: "wrap",
        // borderBottomWidth: StyleSheet.hairlineWidth,
        // borderBottomColor: '#efefeb',
    },
    owner: {
        justifyContent: "flex-end",
        alignItems: "flex-end",
    },
    client: {
        justifyContent: "flex-start",
        alignItems: "flex-start",
        flexDirection: "row",
        marginVertical: 5
    },
    ownerContent: {
        backgroundColor: "#3578e5",
        color: "#fff",
        padding: 10,
        marginVertical: 2,
        borderRadius: 10
    },
    clientContent: {
        backgroundColor: "#fff",
        padding: 10,
        marginVertical: 2,
        borderRadius: 10
    },
    commentHeader: {
        flexDirection: 'row',
        paddingBottom: 5
    },
    commentCreator: {
        // flex: 1,
        fontWeight: 'bold'
    },
    commentTime: {
        color: '#aaa',
    },
    commentAttachs: {
        // marginTop: 10,
        marginHorizontal: 2,
        paddingTop: 5,
        paddingBottom: 5
        // backgroundColor: '#f9f9f9'
    },
    commentAttach: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5
    },
    actionsComment: {
        marginTop: 5,
        flexDirection: 'row',
    },
    iconComment: {
        paddingRight: 8
    },
    attach: {
        width: Dimensions.get('window').width / 5,
        height: Dimensions.get('window').width / 5,
        padding: 2,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#efefeb',
        backgroundColor: '#fff'
    },
    attachTitle: {
        flex: 1,
        marginLeft: 10
    },
    commentBox: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#efefeb',
    },
    addComment: {
        flexDirection: 'row',
        backgroundColor: "#fff"
    },
    commentInput: {
        flex: 1,
        paddingTop: 10,
        height: 30,
    },
    commentSend: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15
    },
    commentImages: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    commentImage: {
        margin: 10,
        marginRight: 0
    },
    removeImage: {
        backgroundColor: '#222',
        position: 'absolute',
        top: -5,
        right: -5,
        borderRadius: 10
    },
    msg: {
        padding: 15,
        color: 'red',
        textAlign: 'center'
    }
});
