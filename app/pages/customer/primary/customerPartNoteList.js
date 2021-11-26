import moment from 'moment';
import tvkd from 'tieng-viet-khong-dau';
import React, { PureComponent } from 'react';
// import Toast from 'react-native-simple-toast';
import {
    StyleSheet, ScrollView, TouchableOpacity,
    Image, Modal, FlatList, RefreshControl, Alert, Linking, Dimensions, TextInput
} from 'react-native';
import { Icon, View, Text, Toast } from 'native-base';
import RsTouchableNativeFeedback from '../../controls/touchable-native-feedback';
import { connect } from '../../../lib/connect';
import * as actions from '../../../actions/customer';
import { getList as getListUser } from '../../../actions/user';
import { getList as getListActivity } from '../../../actions/activity';
import Menu, { MenuModalContext } from '../../controls/action-menu';
import ActionButton from 'react-native-action-button';
import ImagePicker from '../../controls/imagePicker';
import ImageViewer from '../../controls/image-viewer';
import KeyboardSpacer from '../../controls/keyboard-space';

class NoteList extends PureComponent {
    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: false,
            inputHeight: 0,
            comment: null,
            commentImage: null,
            commentImageData: null,
            commentImages: [],
            currentImageIndex: null,
            showImageViewer: false,
            items: [],
            loaded: true,
            loading: false,
            content: "",
            attachments: [],
            searchActivity: {
                page: 1,
                pagesize: 20,
                entity: 'Note',
                customerId: 0,
            },
        }

        this.canCreateNote = this.context.user.hasCap("CustomerInfo.CreateNote");
        this.canDeleteNote = this.context.user.hasCap("CustomerInfo.DeleteNote");

        this.images = [];
    }

    componentDidMount() {
        this.applySearch({ customerId: this.props.entry.id })
        if (this.props.user.items.length == 0) {
            this.props.actions.getListUser();
        }
    }

    applySearch = (data) => {
        var searchActivity = { ...this.state.searchActivity, ...data };

        this.setState({ searchActivity });

        this.props.actions.getListActivity(searchActivity)
            .then((data) => {
                // console.log('');
            })
            .catch(({ error, message }) => {
                Toast.show('Activity: ' + message, 'danger');
            });
    }



    onTextInputSizeChange = (event) => {
        this.setState({ inputHeight: event.nativeEvent.contentSize.height });
    }

    openLink = (link, type) => {
        Linking.canOpenURL(link).then(supported => {
            if (supported) {
                Linking.openURL(link);
            } else {
                // console.log('Don\'t know how to open URI: ' + link);
            }
        });
    }

    addImage = (image) => {
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

    sendComment = () => {
        var model = {
            id: 0,
            rate: 1,
            customerId: this.props.entry.id || 0,
            userId: 0,
            createDate: null,
            content: this.state.content,
            attachments: this.state.attachments,
            tags: [],
        };
        if (this.state.content) {
            // this.noteInput.blur();

            this.setState({ loading: true });
            this.props.actions.createNote({ ...model })
                .then(data => {
                    // this.flatList.scrollToOffset(0);
                    this.setState({
                        loading: false,
                        content: ''
                    });
                    this.applySearch({ customerId: this.props.entry.id });
                    // Toast.show(__('Thêm mới thành công'));
                    Toast.show({
                        text: 'Thêm mới thành công',
                        duration: 2500,
                        position: 'bottom',
                        textStyle: { textAlign: 'center' },

                    });
                })
                .catch(error => {
                    this.setState({ loading: false });
                    alert(error.error, error.message, 'error');
                });

            this.setState({
                content: '',
                attachments: []
            });
        } else {
            alert('Vui lòng nhập nội dung ghi chú')
        }
    }

    deleteComment = id => {
        this.setState({ currentDeleteItemId: id });
        this.props.actions.removeNote(id)
            .then(() => {
                notify(__('Xóa thành công'));
                this.setState({ currentDeleteItemId: null });
            })
            .catch(error => {
                // console.log(error)
                this.setState({ currentDeleteItemId: null });
            });
    }

    render() {
        // // console.log('this.props.activity.items', this.props.activity.items);
        var notes = this.props.activity.items;

        if (!notes || notes.length == 0) {
            // return (
            //     <Text style={styles.msg}>{__('Chưa có ghi chú.')}</Text>
            // )
            notes = [
                { id: 0, customerId: 127, object: "Note", date: "", action: 1, title: __("Thêm khách hàng"), content: __('Chưa có ghi chú') }];
        }

        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    ref={ref => this.flatList = ref}
                    data={notes}
                    renderItem={({ item }) => this.renderItem(item)}
                    keyExtractor={item => 'ID' + item.id}
                    refreshControl={
                        <RefreshControl
                            tintColor="#28cc54"
                            title="Loading..."
                            titleColor="#00ff00"
                            colors={['#28cc54', '#00ff00', '#ff0000']}
                            refreshing={this.props.refreshing}
                            onRefresh={this.props.onRefresh}
                        />
                    }
                />

                <View style={styles.commentBox}>
                    <View style={styles.commentImages}>
                        {
                            !!this.state.attachments &&
                            this.state.attachments.map((image, index) => (
                                <View style={styles.commentImage} key={index}>
                                    <Image source={{ uri: this.props.account.host + image.url }} style={{ width: 60, height: 60 }} />
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
                            cropping={false}
                            editstyle='edit'
                            multi={true}
                            uploadOptions={{
                                path: '/customer/notes',
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
                            placeholder='Thêm ghi chú'
                            underlineColorAndroid='transparent'
                            value={this.state.content}
                            onChangeText={value => this.setState({ content: value })}
                            onContentSizeChange={this.onTextInputSizeChange}
                            multiline={true}
                        // onSubmitEditing={this.sendComment} 
                        />
                        <RsTouchableNativeFeedback onPress={this.sendComment}>
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
            </View>
        )
    }

    renderItem = item => {
        var lstUser = this.props.user.items;
        // // console.log('this.props.user.items', this.props.user.items);

        const { entry, account } = this.props;
        var lstObject = [{ object: 'Customer', label: __('Khách hàng') },
        { object: 'Job', label: __('Công việc') },
        { object: 'Note', label: __('Ghi chú') }];

        var lstAction = [{ action: 1, label: __('Tạo mới') },
        { action: 2, label: __('Xóa') },
        { action: 3, label: __('Chỉnh sửa') },
        { action: 4, label: __('Cập nhật trạng thái') }];
        const inner = (
            <View style={styles.comment}>
                <View style={styles.commentHeader}>
                    <Text style={styles.commentCreator}>
                        {item.id == 0 ? __('Chưa có ghi chú') : ((lstUser.filter(t => t.id == item.userId) && lstUser.filter(t => t.id == item.userId).length > 0) ? lstUser.filter(t => t.id == item.userId)[0].fullName : '') + ' : ' + lstAction.filter(t => t.action == item.action)[0].label + ' ' + lstObject.filter(t => t.object == item.object)[0].label}
                    </Text>
                    <Text style={styles.commentTime}>{moment(item.date).format('DD/MM/YYYY HH:mm')}</Text>
                </View>
                <Text style={styles.commentContent}>{item.content}</Text>
                {
                    item.attachments && item.attachments.length > 0 &&
                    <View style={styles.commentAttachs}>
                        {
                            item.attachments.map((at, index) => {
                                let file = account.host + at.thumbnail;
                                let link = account.host + at.url;
                                let title = at.title.substr(at.title.lastIndexOf("/") + 1);
                                return (
                                    <RsTouchableNativeFeedback key={index} onPress={() => this.openLink(link, at.type)}>
                                        <View style={styles.commentAttach}>
                                            <View style={styles.attach}>
                                                <Image style={{ flex: 1 }} source={{ uri: link }} resizeMode='stretch' />
                                            </View>
                                            <Text style={styles.attachTitle} numberOfLines={1} ellipsizeMode='tail'>{title}</Text>
                                        </View>
                                    </RsTouchableNativeFeedback>
                                )
                            })
                        }
                    </View>
                }
            </View>
        );

        return (
            <Menu
                overlayColor='rgba(0,0,0,.2)'
                menuWidth={180}
                trigger={inner}
                showOnLongPress={true}>
                <Menu.MenuItem text="Xóa ghi chú" onPress={() => this.deleteComment(item.id)} />
            </Menu>
        );
    }
}

export default connect(NoteList, state => ({
    customer: state.customer,
    account: state.account,
    user: state.user,
    host: state.account.host,
    branch: state.branch,
    activity: state.activity,
}), {
    ...actions,
    getListActivity,
    getListUser
});
const styles = StyleSheet.create({
    comment: {
        padding: 15,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc',
    },
    commentHeader: {
        flexDirection: 'row',
        paddingBottom: 5
    },
    commentCreator: {
        flex: 1,
        fontWeight: 'bold'
    },
    commentTime: {
        color: '#aaa',
    },
    commentAttachs: {
        marginTop: 10,
        padding: 10,
        paddingTop: 5,
        backgroundColor: '#f9f9f9'
    },
    commentAttach: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5
    },
    attach: {
        width: 40,
        height: 40,
        padding: 1,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#ccc',
        backgroundColor: '#fff'
    },
    attachTitle: {
        flex: 1,
        marginLeft: 10
    },
    commentBox: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#ccc',
    },
    addComment: {
        flexDirection: 'row'
    },
    commentInput: {
        flex: 1,
        paddingTop: 10,
        height: 30
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
