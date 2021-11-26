import React, { Component } from 'react';
import { connect } from '../../../../lib/connect';
import { FlatList, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, ActivityIndicator } from "react-native";
import * as actions from '../../../../actions/facebookMessage/message';
import { Icon, CheckBox, Button, View, Text } from 'native-base';
import RsTouchableNativeFeedback from '../../../controls/touchable-native-feedback';
import Avatar from '../../../controls/avatar';
import Loading from "../../../controls/loading";

class FbAssign extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fbUser: this.props.fbUser,
            loading: false
        }
    }
    componentDidMount() {
        const { pageId } = this.props.fbPage;
        this.props.actions.getUser(pageId);
    }
    componentWillUnmount() {
    }

    checkList = (id) => {
        const { conversationId } = this.props.conversation;
        this.setState({ loading: true });
        this.props.actions.createAssignConversation(conversationId, id)
            .then(() => {
                // alert(__("Phân công thành công"));
                this.setState({ loading: false });
            }).catch(() => {
                // alert(__("Phân công thất bại"), "danger");
                this.setState({
                    loading: false
                })
            });
    }

    render() {
        const { user, conversation } = this.props.message
        if (user.length == 0) {
            return null
        }
        const { loading } = this.state;
        return (<View>{
            user.map((item, index) => {
                return (
                    <RsTouchableNativeFeedback
                        onPress={() => this.checkList(item.id)}
                        key={"-" + index}
                    >
                        <View style={styles.pages}>

                            <Avatar
                                url={item.avatar}
                                name={item.fullName}
                                id={item.id} />
                            <View style={styles.pagesInfo}>
                                <Text style={styles.pagesTitle} ellipsizeMode='tail' numberOfLines={1}>
                                    {item.fullName}
                                </Text>

                            </View>
                            {
                                conversation.userAssigneds?.id === item.id &&
                                <View style={[styles.pagesAction]}>
                                    <RsTouchableNativeFeedback
                                        // onPress={this.openActionSheet} 
                                        rippleBorderless={true}
                                    >
                                        <View>
                                            <Icon type='MaterialIcons' name="done" size={25} style={styles.pagesActionIcon} />
                                        </View>
                                    </RsTouchableNativeFeedback>
                                </View>
                            }
                        </View>
                    </RsTouchableNativeFeedback >
                )
            })
        }
        </View>
        )
    }
}
export default connect(FbAssign, state => ({
    message: state.fbMessage,
    fbPage: state.fbPageMessage
}), actions);


const styles = StyleSheet.create({
    wrapMerge: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    pages: {
        flex: 1,
        flexDirection: 'row',
        // borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        // paddingVertical: 5
    },
    pagesInfo: {
        flex: 1,
        paddingLeft: 5,
        paddingRight: 10
    },
    pagesTitle: {
        fontSize: 15,
        paddingTop: 10,
        color: '#222'
    },
    pagesProp: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    icon: {
        fontSize: 12,
        // color: '#999'
        color: '#00000096',
    },
    value: {
        fontSize: 12,
        color: '#00000096',
        marginLeft: 10
    },
    pagesAction: {
        padding: 7,
    },
    pagesActionIcon: {
        flex: 1,
        padding: 3,
        fontSize: 25,
    },

});