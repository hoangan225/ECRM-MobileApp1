import React, { Component } from 'react';
import { FlatList, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, ActivityIndicator, Alert, View, Text } from "react-native";
import * as actions from "../../../../actions/facebookMessage/message";
import { Icon } from "native-base";
import * as fbPageMessage from "../../../../actions/facebookMessage/page";
import { connect } from "../../../../lib/connect";
import RsTouchableNativeFeedback from '../../../controls/touchable-native-feedback';
// import { MaterialIcons } from '@expo/vector-icons';
import request from "../../../../lib/request";
import Tags from "./tag";
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

    render() {
        let arrayFilter = this.props.arrayFilter;
        return (
            <View>
                <Tags
                    color={color}
                    removeFilterTags={this.props.removeFilterTags}
                    filterTags={(tag) => this.props.filterTags(tag)}
                    checkTags={this.props.checkTags}
                    pageId={this.props.pageId}
                />
                <RsTouchableNativeFeedback
                    onPress={() =>
                        this.props.filterAll("Hiển thị tất cả")
                    }
                >
                    <View style={styles.action}>
                        <Icon type='MaterialIcons' name='select-all' style={[styles.actionIcon, arrayFilter.includes("Hiển thị tất cả") && { color: color }]} />
                        <Text style={[styles.actionText, arrayFilter.includes("Hiển thị tất cả") && { color: color }]}>{
                            __("Hiển thị tất cả")
                        }</Text>
                    </View>
                </RsTouchableNativeFeedback>

                <RsTouchableNativeFeedback
                    onPress={() =>
                        !arrayFilter.includes("Lọc chưa đọc") ?
                            this.props.filterNotRead("Lọc chưa đọc") :
                            this.props.removeFilterNotRead("Lọc chưa đọc")
                    }
                >
                    <View style={styles.action}>
                        <Icon type='MaterialIcons' name='visibility' style={[styles.actionIcon, arrayFilter.includes("Lọc chưa đọc") && { color: color }]} />
                        <Text style={[styles.actionText, arrayFilter.includes("Lọc chưa đọc") && { color: color }]}>{
                            __("Lọc chưa đọc")
                        }</Text>
                    </View>
                </RsTouchableNativeFeedback>

                <RsTouchableNativeFeedback
                    onPress={() =>
                        !arrayFilter.includes("Lọc tin nhắn") ?
                            this.props.filterMessage("Lọc tin nhắn") :
                            this.props.removeFilterMessage("Lọc tin nhắn")

                    }
                >
                    <View style={styles.action}>
                        <Icon type='MaterialIcons' name='forward-to-inbox' style={[styles.actionIcon, arrayFilter.includes("Lọc tin nhắn") && { color: color }]} />
                        <Text style={[styles.actionText, arrayFilter.includes("Lọc tin nhắn") && { color: color }]}>{
                            __("Lọc tin nhắn")
                        }</Text>
                    </View>
                </RsTouchableNativeFeedback>

                <RsTouchableNativeFeedback
                    onPress={() =>
                        !arrayFilter.includes("Lọc bình luận") ?
                            this.props.filterComment("Lọc bình luận") :
                            this.props.removeFilterComment("Lọc bình luận")

                    }
                >
                    <View style={styles.action}>
                        <Icon type='MaterialIcons' name='comment' style={[styles.actionIcon, arrayFilter.includes("Lọc bình luận") && { color: color }]} />
                        <Text style={[styles.actionText, arrayFilter.includes("Lọc bình luận") && { color: color }]}>{
                            __("Lọc bình luận")
                        }</Text>
                    </View>
                </RsTouchableNativeFeedback>

                <RsTouchableNativeFeedback
                    onPress={() =>
                        !arrayFilter.includes("Lọc chưa trả lời") ?
                            this.props.filterNotReply("Lọc chưa trả lời") :
                            this.props.removeFilterNotReply("Lọc chưa trả lời")

                    }
                >
                    <View style={styles.action}>
                        <Icon type='MaterialIcons' name='markunread' style={[styles.actionIcon, arrayFilter.includes("Lọc chưa trả lời") && { color: color }]} />
                        <Text style={[styles.actionText, arrayFilter.includes("Lọc chưa trả lời") && { color: color }]}>{
                            __("Lọc chưa trả lời")
                        }</Text>
                    </View>
                </RsTouchableNativeFeedback>

                <RsTouchableNativeFeedback
                    onPress={() =>
                        !arrayFilter.includes("Lọc có số điện thoại") ?
                            this.props.filterHavePhone("Lọc có số điện thoại") :
                            this.props.removeFilterHavePhone("Lọc có số điện thoại")

                    }
                >
                    <View style={styles.action}>
                        <Icon type='MaterialIcons' name='phone' style={[styles.actionIcon, arrayFilter.includes("Lọc có số điện thoại") && { color: color }]} />
                        <Text style={[styles.actionText, arrayFilter.includes("Lọc có số điện thoại") && { color: color }]}>{
                            __("Lọc có số điện thoại")
                        }</Text>
                    </View>
                </RsTouchableNativeFeedback>

                <RsTouchableNativeFeedback
                    onPress={() =>
                        !arrayFilter.includes("Lọc không có số điện thoại") ?
                            this.props.filterNotPhone("Lọc không có số điện thoại") :
                            this.props.removeFilterNotPhone("Lọc không có số điện thoại")

                    }
                >
                    <View style={styles.action}>
                        <Icon type='MaterialIcons' name='phone-disabled' style={[styles.actionIcon, arrayFilter.includes("Lọc không có số điện thoại") && { color: color }]} />
                        <Text style={[styles.actionText, arrayFilter.includes("Lọc không có số điện thoại") && { color: color }]}>{
                            __("Lọc không có số điện thoại")
                        }</Text>
                    </View>
                </RsTouchableNativeFeedback>

                <RsTouchableNativeFeedback
                    onPress={() =>
                        !arrayFilter.includes("Lọc đã xử lý") ?
                            this.props.filterHandle("Lọc đã xử lý") :
                            this.props.removeFilterHandle("Lọc đã xử lý")

                    }
                >
                    <View style={styles.action}>
                        <Icon
                            type='MaterialIcons'
                            name='done'
                            style={[styles.actionIcon, arrayFilter.includes("Lọc đã xử lý") && { color: color }]} />
                        <Text style={[styles.actionText, arrayFilter.includes("Lọc đã xử lý") && { color: color }]}>{
                            __("Lọc đã xử lý")
                        }</Text>
                    </View>
                </RsTouchableNativeFeedback>

                <RsTouchableNativeFeedback
                    onPress={() =>
                        !arrayFilter.includes("Lọc chưa xử lý") ?
                            this.props.filterNotHandle("Lọc chưa xử lý") :
                            this.props.removeFilterNotHandle("Lọc chưa xử lý")

                    }
                >
                    <View style={styles.action}>
                        <Icon
                            type='MaterialIcons'
                            name='undo'
                            style={[styles.actionIcon, arrayFilter.includes("Lọc chưa xử lý") && { color: color }]} />
                        <Text style={[styles.actionText, arrayFilter.includes("Lọc chưa xử lý") && { color: color }]}>{
                            __("Lọc chưa xử lý")
                        }</Text>
                    </View>
                </RsTouchableNativeFeedback>

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
        backgroundColor: color
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
