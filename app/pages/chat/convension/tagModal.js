import React from 'react';
// import Toast from 'react-native-simple-toast';
import * as actions from "../../../actions/facebookMessage/message";
import {
    StyleSheet, Modal, Text, Dimensions, TextInput, TouchableWithoutFeedback, TouchableOpacity
} from 'react-native';
import { MenuModalContext } from '../../controls/action-menu';
import Toolbar from '../../controls/toolbars';
import { Icon, View, Header, Body, Title, Left, Right, Button, Container } from 'native-base';
import { connect } from '../../../lib/connect';
import { isEqual, debounce } from "lodash";
import Toast from '../../controls/toast';

class TagForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
        this.assignTag = debounce(this.assignTag, 500);
        this.removeAssignTag = debounce(this.removeAssignTag, 500);
    }

    assignTag = (id) => {

        const { conversation } = this.props.message;
        const { optionFilter } = this.props;
        const data = { conversationId: conversation.conversationId, tagId: id };
        if (!this.state.loading) {
            this.setState({ loading: true }, () => {
                this.props.actions.assignTag(data, optionFilter, conversation.pageId).then(() => {
                    // alert("Thêm tag thành công");
                    Toast.show({
                        text: 'Thêm tag thành công',
                        duration: 2500,
                        position: 'bottom',
                        style: { zIndex: 999 },
                        textStyle: { textAlign: 'center' },
                        buttonText: '',
                    });
                    this.setState({ loading: false });
                }).catch(() => this.setState({ loading: false }));
            });
        }
    }

    removeAssignTag = (id) => {
        const { optionFilter } = this.props;
        const { conversation } = this.props.message;
        if (!this.state.loading) {
            this.setState({ loading: true }, () => {
                this.props.actions.removeAssignTag(conversation.conversationId, id, optionFilter, conversation.pageId)
                    .then(() => {
                        // alert("Xóa tag thành công");
                        Toast.show({
                            text: 'Xóa tag thành công',
                            duration: 2500,
                            position: 'bottom',
                            textStyle: { textAlign: 'center' },
                            buttonText: '',
                        });
                        this.setState({ loading: false });
                    }).catch(() => this.setState({ loading: false }));
            });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !isEqual(nextProps.message.conversation, this.props.message.conversation) ||
            !isEqual(nextProps.message.conversation.conversationTags, this.props.message.conversation.tags) ||
            !isEqual(nextProps.message.conversationTags, this.props.message.conversationTags);
    }

    setValue = data => {
        this.setState({
            model: { ...this.state.model, ...data }
        });
    }


    onCancel = () => {
        this.props.onCancel();
    }

    render() {
        const conversationTags = this.props.message.conversationTags.length > 0 ?
            this.props.message.conversationTags
            // .orderByDesc(item => item.id) 
            : [];
        const { conversation } = this.props.message;
        if (!conversation) return null;
        let tags = [];

        if (conversation && conversation.tags?.length > 0) {
            conversation.tags.map((item) => tags.push(item.id));
        }

        return (
            <MenuModalContext
                supportedOrientations={['portrait', 'landscape']}
            // onRequestClose={this.onCancel}
            >
                <Container style={styles.container}>
                    <Toolbar
                        noShadow
                        icon={<Icon type='MaterialIcons' name='arrow-back' style={{ fontSize: 22, color: '#fff' }} size={22} />}
                        onIconPress={this.onCancel}
                        // actions={[
                        //     {
                        //         icon: <Icon type='MaterialIcons' name='menu' style={{ fontSize: 22, color: '#fff' }} />,
                        //         onPress: this.openSheet,
                        //         disabled: this.state.loading
                        //     }
                        // ]}
                        titleText={"Gắn thẻ khách hàng"}
                    ></Toolbar>
                    {
                        // this.state.loading && <Loading />
                    }
                    <TouchableWithoutFeedback>
                        <View style={styles.container}>
                            <TouchableWithoutFeedback>
                                <View style={styles.actionSheet}>
                                    {
                                        conversation && conversationTags.length > 0 &&
                                        conversationTags.orderBy(x => x.order).map((item, index) => {
                                            if (!tags.includes(item.id)) {
                                                return (
                                                    <TouchableOpacity
                                                        style={{ backgroundColor: item.color, margin: 2, padding: 2, paddingHorizontal: 6, borderRadius: 2 }}
                                                        // style={{
                                                        //     opacity: "0.5",
                                                        //     backgroundColor: item.color,
                                                        //     fontSize: "0.8rem",
                                                        // }}
                                                        onPress={() => this.assignTag(item.id)}
                                                    >
                                                        <Text style={styles.buttonText}>{item.name}</Text>
                                                    </TouchableOpacity>
                                                )
                                            }
                                            return (
                                                <TouchableOpacity key={index} title={item.name}
                                                    style={{ backgroundColor: item.color, margin: 2, padding: 2, paddingHorizontal: 6, borderRadius: 2, opacity: 0.6 }}
                                                    // className="text-white text-center"
                                                    // style={{
                                                    //     backgroundColor: item.color,
                                                    //     fontSize: "0.8rem",
                                                    // }}
                                                    onPress={() => this.removeAssignTag(item.id)}
                                                >
                                                    <Text style={styles.buttonText}>{item.name}</Text>
                                                </TouchableOpacity>
                                            )
                                        })
                                    }
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                    <Toast
                        ref={c => {
                            if (c) Toast.toastInstance = c;
                        }}
                    />

                </Container>
            </MenuModalContext>
        )

    }


}

export default connect(TagForm, (state) => ({
    message: state.fbMessage,
}), actions);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center',
        // backgroundColor: 'rgba(0,0,0,.4)',
    },
    toolbar: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
    },
    actionSheet: {
        // width: Dimensions.get('window').width - 20,
        // maxWidth: 300,
        // borderRadius: 4,
        backgroundColor: '#fff',
        flexWrap: "wrap",
        flexDirection: "row",
        marginTop: 10
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#ccc'
    },
    button: {
        flex: 1,
        alignItems: 'center'
    },
    buttonText: {
        color: '#fff',
        fontSize: 16
    }
});