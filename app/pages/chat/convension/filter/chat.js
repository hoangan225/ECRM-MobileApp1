import React, { Component } from 'react';
import { FlatList, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, ActivityIndicator, Alert, View, Text } from "react-native";
import * as actions from "../../../../actions/facebookMessage/message";
import { Icon } from "native-base";
import * as fbPageMessage from "../../../../actions/facebookMessage/page";
import { connect } from "../../../../lib/connect";
// import FbBirthday from "@/components/fbbirthday";
// import View from "../../../../controls/tooltip";
import FbAssign from "./fbAssign";
// import FbGender from "@/components/fbgender";
// import Icon from "../../../../controls/icon";
// import Avatar from "../../../../controls/avatar";
import RsTouchableNativeFeedback from '../../../controls/touchable-native-feedback';
// import { MaterialIcons } from '@expo/vector-icons';
import request from "../../../../lib/request";
const color = "#ffb400";
class ActionMessage extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            showFormBirthday: false,
            showFormGender: false,
            showFbStaff: false,
            hideUnread: false,
            unreadId: null,
            asyncLoading: false,
            allConversationsCustomer: false,
            btnSyncInbox: false
        }
        this.manager = this.context.user.hasCap('Conversation.Manage');
        this.createLead = this.context.user.hasCap('Conversation.Lead');
        this.manageLead = this.context.user.hasCap('Lead.Manage');
    }
    componentDidMount() {
    }
    showFormGender = () => {
        const { showFormGender } = this.state;
        const { conversation } = this.props.message;
        let gender = null;
        if (conversation.typeMessage == 1) {
            gender = conversation.customer.customer.gender;
        } else {
            gender = conversation.customers[0].customer.gender;
        }
        if (showFormGender) {
            // return (
            //     <FbGender
            //         className="facebook__gender"
            //         hide={() => this.setState({ showFormGender: false })}
            //         gender={gender}
            //         conversation={conversation}
            //     />
            // )
        }
    }
    showFbStaff = () => {
        const { showFbStaff } = this.state;
        const { conversation } = this.props.message;
        // if (showFbStaff) {
        return (
            <FbAssign
                conversation={conversation}
            // hideFbStaff={() => this.setState({ showFbStaff: false })}
            />
        )
        // }
    }
    block = () => {
        const { conversation } = this.props.message;
        if (conversation.typeMessage == 1) {
            Alert.alert(
                'Chặn khách hàng',
                'Bạn có chắc chắn muốn chặn khách hàng không?',
                [
                    {
                        text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'
                    },
                    {
                        text: 'OK', onPress: () => {
                            this.props.actions.blockCustomer(conversation.customer.psid, conversation.pageId)
                                .then((data) => {
                                    if (data) {
                                        alert(__("Chặn thành công"));
                                    }
                                })
                                .catch(() => {
                                    alert(__("Chặn không thành công"), "danger");
                                });
                        }
                    },
                ],
                { cancelable: false }
            )

        } else {
            Alert.alert(
                'Chặn khách hàng',
                'Bạn có chắc chắn muốn chặn khách hàng không?',
                [
                    {
                        text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'
                    },
                    {
                        text: 'OK', onPress: () => {
                            this.props.actions.blockCustomer(conversation.customers[0].psid, conversation.pageId)
                                .then((data) => {
                                    if (data) {
                                        alert(__("Chặn thành công"));
                                    }
                                })
                                .catch(() => {
                                    alert(__("Chặn không thành công"), "danger");
                                });
                        }
                    },
                ],
                { cancelable: false }
            )

        }
    };

    unBlock = () => {
        const { conversation } = this.props.message;
        if (conversation.typeMessage == 1) {
            Alert.alert(
                'Bỏ chặn khách hàng',
                'Bạn có chắc bỏ chặn khách hàng không?',
                [
                    {
                        text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'
                    },
                    {
                        text: 'OK', onPress: () => {
                            this.props.actions.UnblockCustomer(conversation.customer.psid, conversation.pageId)
                                .then((data) => {
                                    if (data) {
                                        alert(__("Bỏ chặn  thành công"));
                                    }
                                })
                                .catch(() => {
                                    alert(__("Bỏ không thành công"), "danger");
                                });
                        }
                    },
                ],
                { cancelable: false }
            )
        } else {
            Alert.alert(
                'Bỏ chặn khách hàng',
                'Bạn có chắc bỏ chặn khách hàng không?',
                [
                    {
                        text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'
                    },
                    {
                        text: 'OK', onPress: () => {
                            this.props.actions.UnblockCustomer(conversation.customers[0].psid, conversation.pageId)
                                .then((data) => {
                                    if (data) {
                                        alert(__("Bỏ chặn  thành công"));
                                    }
                                })
                                .catch(() => {
                                    alert(__("Bỏ không thành công"), "danger");
                                });
                        }
                    },
                ],
                { cancelable: false }
            )
        }
    };

    changeAssignedStatus = () => {
        const { conversation } = this.props.message;
        this.props.actions.changeAssignedStatus(conversation.conversationId)
            .then((data) => {
            })
            .catch((err) => {
                alert(__("Lỗi: " + err.message), "danger");
            })
    }


    Unread = (id) => {
        this.setState({
            hideUnread: !this.state.hideUnread,
        }, () => {
            this.changeStatusConversation(id);
        })
    }

    changeStatusConversation = (id) => {
        const watched = 1;
        const notWatched = 2;
        const { hideUnread } = this.state;
        const { conversation } = this.props.message;
        const { filter } = this.props;
        if (conversation.conversationStatus === 1) {
            this.setState({ unreadId: id });
            this.props.actions
                .changeStatusConversation(id, notWatched, filter)
                .then(() => {
                    // alert(__("Đánh dấu chưa đọc thành công"));
                })
                .catch(() => alert(__("Đánh dấu chưa đọc không thành công"), "danger"));
        } else {
            this.setState({ unreadId: null });
            this.props.actions
                .changeStatusConversation(id, watched, filter)
                .then(() => {
                    // alert(__("Đánh dấu đã đọc thành công"));
                })
                .catch(() => alert(__("Đánh dấu đã đọc không thành công"), "danger"));
        }
    }

    convertToUrlMerge = (check) => {
        var url = "";
        check.map((item, index) => {
            if (index == 0) {
                url += 'groupPage[' + index + ']' + "=" + item;
            } else {
                url += "&" + 'groupPage[' + index + ']' + "=" + item;
            }
        });
        return url;
    }
    convertToUrl = (filters) => {
        var url = "";
        filters.map((item) => {
            url += "&" + Object.keys(item) + "=" + item[Object.keys(item)];
        });
        return url;
    };
    copyName = (name) => {
        copy(name);
        alert(__("Đã sao chép tên khách hàng ") + name);
    }

    asynConversation = (conversation) => {
        const { checkMerge } = this.props.message;
        const { fbUserId } = this.props.fbPage;
        this.setState({ asyncLoading: true, btnSyncInbox: true });

        if (conversation.typeMessage == 1) {
            this.props.actions.asynInbox(conversation.conversationId, conversation.pageId)
                .then(() => {
                    if (this.state.btnSyncInbox) {
                        alert("Đồng bộ tin nhắn thành công");
                    }
                    this.setState({ asyncLoading: false, btnSyncInbox: false });
                    // this.props.changeCheckAsync();
                    this.props.actions.getConversationInbox(conversation.conversationId, conversation.pageId, fbUserId, 1, 25);
                })
                .catch(error => {
                    this.setState({ asyncLoading: false, btnSyncInbox: false });
                    // alert(error.message, "danger");
                });
        }
        else {
            this.props.actions.asynComment(conversation.conversationId, conversation.pageId)
                .then(() => {
                    this.setState({ asyncLoading: false, btnSyncInbox: false });
                    // this.props.changeCheckAsync();
                    // alert("Đồng bộ tin nhắn thành công");
                    this.props.actions.getConversationComment(conversation.conversationId, conversation.pageId, fbUserId, 1, 25)
                })
                .catch(error => {
                    this.setState({ asyncLoading: false, btnSyncInbox: false });
                    alert(error.message, "danger");
                });
        }
    }
    convesationToLead = (item) => {
        if (item.typeMessage == 1) {
            this.props.actions.convesationToLead(item.asid, item.customer.customer.id)
                .then(() => {
                    alert(__("Chuyển hội thoại thành lead thành công"));
                    if (this.props.changeToLead) {
                        this.props.changeToLead();
                    }
                }).catch(err => alert(err.message, "danger"));
        } else {
            this.props.actions.convesationToLead(item.customers[0].psid, item.customers[0].customer.id)
                .then(() => {
                    alert(__("Chuyển hội thoại thành lead thành công"));
                    if (this.props.changeToLead) {
                        this.props.changeToLead();
                    }
                }).catch(err => alert(err.message, "danger"));
        }
    }
    lead = () => {
        if (this.props.redirectLead) {
            this.props.redirectLead();
        }
    }
    copyLink = () => {
        const { match } = this.props;
        const { conversation } = this.props.message;
        let urlC = request.url(match.url);
        urlC = urlC + "?c_id=" + conversation.conversationId;
        copy(urlC);
        alert(__("Đã sao chép link hội thoại ") + urlC);
    }
    createOrder = () => {
        alert("Chức năng đang được nâng cấp");
    }
    render() {
        let { allConversationsCustomer, asyncLoading, btnSyncInbox, showFormBirthday } = this.state;
        const { checkAsync, toLead, changeResponsive } = this.props;
        const { conversation, conversations, configConversation, configPage } = this.props.message;
        let birthDate;
        let isHandle = false;
        if (conversations != null && conversation) {
            let index = conversations.items.findIndex(item => item.conversationId === conversation.conversationId);
            if (index != -1) {
                isHandle = conversations.items[index].isHandle;
            }
        }
        if (!conversation) return null;
        if (conversation.typeMessage == 1) {
            birthDate = conversation.customer.customer.birthdate;
        } else {
            birthDate = conversation.customers[0].customer.birthdate;
        }
        return (
            <View>
                <View style={styles.title}>
                    <Text style={{ color: "#fff", padding: 10 }}>Chọn hành động</Text>
                </View>

                <View>
                    <RsTouchableNativeFeedback
                        onPress={() => conversation.conversationStatus === 1 ?
                            this.Unread(conversation.conversationId) :
                            this.Unread(conversation.conversationId)
                        }
                    >
                        <View style={styles.action}>
                            <Icon type='MaterialIcons' name='visibility' style={styles.actionIcon} />
                            <Text style={styles.actionText}>{
                                conversation.conversationStatus === 1 ?
                                    __("Đánh dấu chưa đọc") :
                                    __("Đánh dấu đã đọc")
                            }</Text>
                        </View>
                    </RsTouchableNativeFeedback>
                    {
                        conversation.typeMessage === 1 &&
                        <RsTouchableNativeFeedback
                            onPress={conversation.customer.blocked ? this.unBlock : this.block}
                        >
                            <View style={styles.action}>
                                <Icon type='MaterialIcons' name='remove-circle' style={styles.actionIcon} />
                                <Text style={styles.actionText}>{
                                    conversation.customer.blocked ?
                                        __("Bỏ chặn khách hàng này") :
                                        __("Chặn khách hàng này")
                                }</Text>
                            </View>
                        </RsTouchableNativeFeedback>
                    }
                    {
                        configPage.FbChatGeneralSetting?.AutoLead?.Selection &&
                        (
                            toLead ?
                                (this.manageLead &&
                                    <RsTouchableNativeFeedback
                                    >
                                        <View style={styles.action}>
                                            <Icon type='MaterialIcons' name='compare-arrows' style={styles.actionIcon} />
                                            <Text style={styles.actionText}>{
                                                __("Đã chuyển thành lead")
                                            }</Text>
                                        </View>
                                    </RsTouchableNativeFeedback>)
                                :
                                (this.createLead &&
                                    <RsTouchableNativeFeedback
                                        onPress={() => this.convesationToLead(conversation)}
                                    >
                                        <View style={styles.action}>
                                            <Icon type='MaterialIcons' name='compare-arrows' style={styles.actionIcon} />
                                            <Text style={styles.actionText}>{
                                                __("Chuyển hội thoại thành lead")
                                            }</Text>
                                        </View>
                                    </RsTouchableNativeFeedback>
                                )
                        )
                    }
                    {
                        <RsTouchableNativeFeedback
                            onPress={() => this.asynConversation(conversation)}
                        >
                            <View style={styles.action}>
                                <Icon type='MaterialIcons' name='sync-alt' style={styles.actionIcon} />
                                <Text style={styles.actionText}>{
                                    asyncLoading && btnSyncInbox ?
                                        __("Đang đồng bộ..") :
                                        __("Đồng bộ tin nhắn")
                                }</Text>
                            </View>
                        </RsTouchableNativeFeedback>
                    }

                    {
                        // conversation.typeMessage === 1 ?
                        // <TouchableOpacity
                        //                     style={styles.iconComment}
                        //                     onPress={() => this.openLink(`https://www.facebook.com${conversation.link}`)}
                        //                 >
                        //                     <Icon type='FontAwesome' name='facebook-f' style={{ fontSize: 18, color: '#ccc' }} />
                        //                 </TouchableOpacity> : 
                        //                 <TouchableOpacity
                        //                 style={styles.iconComment}
                        //                 onPress={() => this.openLink(conversation.link)}
                        //             >
                        //                 <Icon type='FontAwesome' name='facebook-f' style={{ fontSize: 18, color: '#ccc' }} />
                        //             </TouchableOpacity>
                    }

                    <RsTouchableNativeFeedback
                        onPress={this.createOrder}
                    >
                        <View style={styles.action}>
                            <Icon type='MaterialIcons' name='shopping-cart' style={styles.actionIcon} />
                            <Text style={styles.actionText}>{__("Tạo đơn")}</Text>
                        </View>
                    </RsTouchableNativeFeedback>

                    <View style={styles.title}>
                        <Text style={{ color: "#fff", padding: 10 }}>{__("Hội thoại được phân công cho")}</Text>
                    </View>

                    {
                        this.showFbStaff()
                    }

                </View>
            </View >
        );
    }
};

export default connect(ActionMessage,
    (state) => ({
        message: state.fbMessage,
        fbPage: state.fbPageMessage,
    }),
    {
        ...actions,
        ...fbPageMessage,
    }
);


const styles = StyleSheet.create({
    title: {
        backgroundColor: "green"
    },
    action: {
        flexDirection: "row",
        // justifyContent: "center",
        alignItems: "center",
        borderBottomColor: "#f2f2f2",
        borderBottomWidth: 1,
        paddingVertical: 8,
        paddingLeft: 15
    },
    actionIcon: {
        fontSize: 26
    },
    line: {
        backgroundColor: "#ccc"
    },
    actionText: {
        marginLeft: 15,
        color: "#000"
    },
    page: {
        flex: 1,
        backgroundColor: '#fff'
    },
    headerText: {
        color: 'red',
        textAlign: 'center',
        padding: 20
    },
    header: {
        flex: 1
    },
    flatlistfooter: {
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    notData: {
        paddingTop: 10,
        alignItems: 'center'
    }
})
