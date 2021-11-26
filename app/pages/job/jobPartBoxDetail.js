import moment from 'moment';
// import Toast from 'react-native-simple-toast';
import HTML from 'react-native-render-html';
import React, { Component } from 'react';
import {
    Dimensions, Linking, StyleSheet, View, ScrollView,
    TouchableOpacity, Text, Image, Modal, WebView, TextInput, RefreshControl, Alert
} from 'react-native';
import RsTouchableNativeFeedback from '../controls/touchable-native-feedback';
import KeyboardSpacer from '../controls/keyboard-space';

import WebContainer from '../controls/webcontainer';
import Toolbar from '../controls/toolbars';
import ImagePicker from '../controls/imagePicker';
import ImageViewer from '../controls/image-viewer';
import Menu, { MenuModalContext } from '../controls/action-menu';
import { Icon, Toast } from 'native-base';
import Select from '../controls/select'
import { connect } from '../../lib/connect';
import * as actions from '../../actions/job';
import JobBoxCustomer from './jobPartBoxCustomer';

class JobDetailsBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            refreshing: false,
            inputHeight: 0,
            comment: null,
            commentImage: null,
            commentImageData: null,
            commentImages: [],
            currentImageIndex: null,
            showImageViewer: false,
            items: [],
            content: '',
            attachments: [],
            attachTemp: [],
            currentJob: this.props.entry,
            model: {
                ...props.entry,
            },
            tabIndex: 0,
            show: false
        }

        this.images = [];
        this.rev = Date.now();
    }

    setValue = data => {
        this.setState({
            model: { ...this.state.model, ...data }
        });
    }

    componentDidMount() {
        // this.checkImages();
        if (this.props.entry.id) {
            this.setState({ loading: true })
            this.props.actions.getReports(this.props.entry.id)
                .then(data => {
                    this.setState({ items: data, loading: false });
                })
                .catch(error => {
                    alert(error.error, error.message);
                    this.setState({ loading: false })
                })
        }
    }

    UNSAFE_componentWillReceiveProps(props) {
        this.setState(
            {
                model: {
                    ...props.entry,
                }
            }
        )
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

    onImageSucess = (file) => {
        this.setState({
            attachTemp: [...this.state.attachTemp, {
                url: file.uri
            }]
        });
    }

    // removeImageTemp = (index, image) => {
    //     this.state.attachTemp.splice(index, 1);
    //     this.setState({
    //         attachTemp: [...this.state.attachTemp]
    //     });
    // }


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
        this.state.attachTemp.splice(index, 1);
        this.state.attachments.splice(index, 1);
        this.setState({
            attachments: [...this.state.attachments],
            attachTemp: [...this.state.attachTemp]
        });

        this.images = this.images.filter(link => link != image.path);
    }

    sendComment = () => {
        if (this.state.content) {
            this.setState({ loading: true })
            const report = {
                type: this.state.tabIndex,
                content: this.state.content,
                attachments: this.state.attachments.map(item => ({ attachmentId: item.id, url: item.url }))
            }
            this.props.actions.report(this.props.entry.id, report)
                .then(data => {
                    this.setState({
                        items: [...this.state.items, data],
                        content: "",
                        attachments: [],
                        attachTemp: [],
                        loading: false
                    }, () => {
                        this.scrollView.scrollToEnd && this.scrollView.scrollToEnd();
                    });
                })
                .catch(error => {
                    alert(error.error);
                    this.setState({ loading: false })
                })
        }
        else {
            alert('Vui lòng nhập nội dung ' + this.state.tabIndex == 0 ? 'báo cáo' : 'bình luận');
        }

    }

    success = () => {
        const model = this.props.entry;
        if (model) {
            let val = model.id;
            this.props.actions.updateFinish(val)
                .then(data => {
                    this.props.onRequestClose();
                    Toast.show({
                        text: 'Cập nhật công việc thành công',
                        buttonText: 'Okay'
                    })

                })
                .catch(error => {
                    this.props.onRequestClose();
                });
        }
    }

    deleteComment = (item) => {
        Alert.alert(
            'Xóa bình luận?',
            'Bạn có chắc chắn muốn xóa không?',
            [
                { text: 'Cancel', onPress: () => this.props.onRequestClose(), style: 'cancel' },
                {
                    text: 'OK', onPress: () => {
                        this.props.actions.removeReport(this.props.entry.id, item.id)
                            .then(data => {
                                this.setState({
                                    items: this.state.items.filter(r => r.id !== item.id)
                                });
                            })
                            .catch(error => {
                                alert(error.error);
                            })
                    }
                },
            ],
            { cancelable: false }
        )
    }

    getData = () => {
        if (this.props.entry.id) {
            this.setState({ loading: true })
            this.props.actions.getReports(this.props.entry.id)
                .then(data => {
                    this.setState({ items: data, loading: false });
                })
                .catch(error => {
                    alert(error.error, error.message);
                    this.setState({ loading: false })
                })
        }
    }

    onTextInputSizeChange = (event) => {
        this.setState({ inputHeight: event.nativeEvent.contentSize.height });
    }

    refresh = () => {
        this.setState({ refreshing: true });
        this.props.actions.getList()
            .then(() => {
                this.setState({ refreshing: false });
            })
            .catch(({ error, message }) => {
                this.setState({ refreshing: false });
                alert(error, message);
            })
    }

    tweenHandler = (ratio) => {
        return {
            mainOverlay: { opacity: ratio / 2 }
        }
    }


    showLoading = (loading) => {
        this.setState({ loading });
    }

    editJob = () => {
        this.props.showBox(this.props.entry, "edit");
    }

    deleteJob = () => {
        Alert.alert(
            'Xóa công việc',
            'Bạn có chắc chắn muốn xóa không?',
            [
                {
                    text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'
                },
                {
                    text: 'OK', onPress: () => {
                        var id = this.state.currentJob.id;
                        this.setState({ currentJob: null });
                        this.props.actions.remove(id)
                            .then(() => {
                                Toast.show({
                                    text: 'Xóa thành công',
                                    duration: 2500,
                                    position: 'bottom',
                                    textStyle: { textAlign: 'center' },

                                });
                            })
                            .catch(({ error, message }) => {
                                //this.props.showLoading(false);
                                alert(error, message);
                            })
                    }
                },
            ],
            { cancelable: false }
        )
    }

    checkImages = (reload) => {
        const { entry, account } = this.props;

        this.images = [];

        this.state.attachments && this.state.attachments.forEach(at => {
            if (at.type.indexOf('image') == 0) {
                let local = !at.url.match(/^\/Content/i);
                let url = local ? at.url : account.host + at.url;
                this.images.push(url);

                var request = new XMLHttpRequest();

                request.onreadystatechange = (e) => {
                    if (request.readyState === 4) {
                        if (request.status !== 200) {
                            this.images.remove(item => item == url);
                        }
                    }
                };

                request.open('HEAD', url);
                request.send();
            }
        });
    }

    setTab = (tab) => {
        this.setState({
            tabIndex: tab
        })
    }

    getDataSelect = () => {
        var result = [];
        if (this.props.allowEmpty) {
            result = [{
                label: "Tất cả",
                value: "0",
            }];
        }
        var list = this.props.entry.customers;

        list.forEach(item => {

            let xitem = {
                label: item.name,
                value: item.id,
            }

            result.push(xitem);
        });

        return result;
    }

    onValueChange = (value) => {
        // // console.log(value);
        this.setState({ show: true, valCustomer: value })
    }

    onCloseDetailCus = () => {
        this.setState({ show: false })
    }

    render() {
        const { entry, account } = this.props;
        // // console.log('this.props.job', this.state.items);
        // // console.log('entry', entry.users.filter(u => u.isPrimary));
        const htmlContent = `${entry.content}`;
        const listItem = this.state.items;
        const list = listItem && listItem.filter(item => item.type == this.state.tabIndex);
        this.data = this.getDataSelect();

        if (!entry) {
            return <Text>{__('Đối tượng không tồn tại hoặc đã bị xóa')}</Text>
        }

        return (
            this.state.show ?
                <JobBoxCustomer jobCus={this.state.valCustomer} show={this.state.show} onCloseDetailCus={this.onCloseDetailCus} />
                :
                <MenuModalContext onRequestClose={this.props.onRequestClose}>
                    <View style={styles.page}>
                        <Toolbar
                            style={{ backgroundColor: entry.color }}
                            icon={<Icon type='MaterialIcons' style={{ fontSize: 22, color: '#fff' }} name='arrow-back' size={22} />}
                            onIconPress={this.props.onRequestClose}
                            actions={[
                                {
                                    icon: <Icon type='MaterialIcons' style={{ fontSize: 22, color: '#fff' }} name='more-vert' size={22} />,
                                    menuItems: [
                                        {
                                            icon: <Icon name='autorenew' type='MaterialIcons' style={{ fontSize: 20 }} />,
                                            text: __("Làm mới"),
                                            onPress: this.refresh,
                                        },
                                        {
                                            icon: <Icon name='done' type='MaterialIcons' style={{ fontSize: 20 }} />,
                                            text: __('Hoàn thành'),
                                            onPress: this.success,
                                        },
                                        {
                                            icon: <Icon name='edit' type='MaterialIcons' style={{ fontSize: 20 }} />,
                                            text: __("Chỉnh sửa"),
                                            onPress: this.editJob,
                                        },
                                        {
                                            icon: <Icon name='delete' type='MaterialIcons' style={{ fontSize: 20 }} />,
                                            text: __("Xóa"),
                                            onPress: this.deleteJob,
                                        }
                                    ]
                                }
                            ]}
                            titleText='Chi tiết công việc'
                        ></Toolbar>
                        <View style={styles.job}>
                            <ScrollView
                                ref={scroll => { this.scrollView = scroll }}
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
                                <View style={styles.jobInfo}>
                                    <View style={styles.jobTypes}>
                                        <Icon type='FontAwesome' name='briefcase' style={[styles.type, entry.type == 1 && styles.typeActive]} />
                                        <Icon type='FontAwesome' name='phone' style={[styles.type, entry.type == 2 && styles.typeActive]} />
                                        <Icon type='FontAwesome' name='group' style={[styles.type, entry.type == 3 && styles.typeActive]} />
                                        <Icon type='FontAwesome' name='envelope' style={[styles.type, entry.type == 4 && styles.typeActive]} />
                                        <Icon type='FontAwesome' name='glass' style={[styles.type, entry.type == 5 && styles.typeActive]} />
                                        <Icon type='FontAwesome' name='gift' style={[styles.type, entry.type == 6 && styles.typeActive]} />
                                    </View>

                                    <View style={styles.jobProp}>
                                        <Text style={styles.label}>{__('Tên công việc')}</Text>
                                        <Text style={styles.value}>{entry.name}</Text>
                                    </View>

                                    <View style={styles.jobProp}>
                                        <Text style={styles.label}>{__('Trạng thái')}</Text>
                                        <Text style={styles.value}>{entry.statusName}</Text>
                                    </View>

                                    <View style={styles.jobProp}>
                                        <Text style={styles.label}>{__('Nội dung')}</Text>
                                        <View style={styles.content}>
                                            <HTML html={htmlContent} imagesMaxWidth={Dimensions.get('window').width} />
                                            {/*<WebContainer html={entry.content} autoHeight={true} style={styles.content} />*/}
                                        </View>
                                    </View>

                                    <View style={styles.jobProp}>
                                        <Text style={styles.label}>{__('Khách hàng')}</Text>
                                        {entry.customers.length > 0 ? <Select
                                            selectTextStyle={styles.selectTextStyle}
                                            placeholder={entry.customers.map(c => c.name).join(",\n")}
                                            style={styles.valueSelect}
                                            items={this.data}
                                            showSearchBox={false}
                                            // selectedValue={this.state.valCustomer}
                                            onValueChange={value => this.onValueChange({ valCustomer: value })} />
                                            :
                                            <Text style={styles.value}>{entry.customers.map(c => c.name).join(",\n")} </Text>
                                        }

                                    </View>
                                    {/*
                                <View style={styles.jobProp}>
                                    <Text style={styles.label}>{__('Chiến dịch')}</Text>
                                    <Text style={styles.value}>{!!entry.processName && entry.processName} {!!entry.processStepName && '/ ' + entry.processStepName}</Text>
                                </View>
                                */}

                                    <View style={styles.jobProp}>
                                        <Text style={styles.label}>{__('Ngày tạo')}</Text>
                                        <Text style={styles.value}>{moment(entry.createDate).format('DD/MM/YYYY HH:mm')}</Text>
                                    </View>

                                    <View style={styles.jobProp}>
                                        <Text style={styles.label}>{__('Bắt đầu')}</Text>
                                        <Text style={styles.value}>{moment(entry.startDate).format('DD/MM/YYYY HH:mm')}</Text>
                                    </View>

                                    <View style={styles.jobProp}>
                                        <Text style={styles.label}>{__('Kết thúc')}</Text>
                                        <Text style={styles.value}>{moment(entry.deadline).format('DD/MM/YYYY HH:mm')}</Text>
                                    </View>



                                    <View style={styles.jobProp}>
                                        <Text style={styles.label}>{__('Người tạo')}</Text>
                                        <Text style={styles.value}>{entry.creatorName}</Text>
                                    </View>

                                    <View style={styles.jobProp}>
                                        <Text style={styles.label}>{__('Giao cho')}</Text>
                                        <Text style={styles.value}>{entry.users.filter(u => u.isPrimary).map(c => c.name).join(",\n")}</Text>
                                    </View>

                                    <View style={styles.jobProp}>
                                        <Text style={styles.label}>{__('Người liên quan')}</Text>
                                        <Text style={styles.value}>{entry.users.filter(u => !u.isPrimary).map(u => u.name).join(",\n")} </Text>
                                    </View>
                                    {
                                        entry.attachments && entry.attachments.length > 0 && (
                                            <View style={styles.jobProp}>
                                                <Text style={styles.label}>{__('File đính kèm')}</Text>
                                                <View style={styles.commentAttachs}>
                                                    {
                                                        entry.attachments.map((at, index) => {
                                                            let local = !at.url.match(/^\/uploads/i);
                                                            let file = local ? at.thumbnail : account.host + at.thumbnail;
                                                            let link = local ? at.url : account.host + at.url;
                                                            let title = at.title.substr(at.title.lastIndexOf("/") + 1);
                                                            return (
                                                                <RsTouchableNativeFeedback key={index} onPress={() => this.openLink(link, at.type)}>
                                                                    <View style={styles.commentAttach}>
                                                                        <View style={styles.attach}>
                                                                            {
                                                                                at.thumbnail ?
                                                                                    <Image style={{ flex: 1 }} source={{ uri: file }} resizeMode='stretch' /> :
                                                                                    <Text style={{ flex: 1, alignSelf: 'center', paddingTop: 8 }}>{at.extension}</Text>
                                                                            }
                                                                        </View>
                                                                        <Text style={styles.attachTitle} numberOfLines={1} ellipsizeMode='tail'>{title}</Text>
                                                                    </View>
                                                                </RsTouchableNativeFeedback>
                                                            )
                                                        })
                                                    }
                                                </View>
                                            </View>
                                        )
                                    }
                                </View>
                                <View style={styles.jobComments}>
                                    <View style={styles.tabComment} >
                                        <RsTouchableNativeFeedback onPress={() => this.setTab(0)}>
                                            <View>
                                                <Text style={[this.state.tabIndex == 0 ? styles.commentTitleFocus : styles.commentTitle]}>{__('Báo cáo')}</Text>
                                            </View>
                                        </RsTouchableNativeFeedback>
                                        <RsTouchableNativeFeedback onPress={() => this.setTab(1)}>
                                            <View>
                                                <Text style={[this.state.tabIndex == 1 ? styles.commentTitleFocus : styles.commentTitle]}>{__('Bình luận')}</Text>
                                            </View>
                                        </RsTouchableNativeFeedback>
                                    </View>
                                    {
                                        list.map((item, index) => {
                                            return (
                                                <Menu
                                                    overlayColor='rgba(0,0,0,.2)'
                                                    menuWidth={180}
                                                    key={index}
                                                    trigger={
                                                        <View style={styles.comment} key={index}>
                                                            <View style={styles.commentHeader}>
                                                                <Text style={styles.commentCreator}>{item.creatorName}</Text>
                                                                <Text style={styles.commentTime}>{moment(item.createDate).format('DD/MM/YYYY HH:mm')}</Text>
                                                            </View>
                                                            <Text style={styles.commentContent}>{item.content}</Text>
                                                            {
                                                                item.attachments && item.attachments.length > 0 &&
                                                                <View style={styles.commentAttachs}>
                                                                    {
                                                                        item.attachments.map((at, index) => {
                                                                            let file = account.host + at.thumbnail;
                                                                            let link = account.host + at.url;
                                                                            // let title = at.title.substr(at.title.lastIndexOf("/") + 1);
                                                                            let title = at.title;
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
                                                    }
                                                    showOnLongPress={true}>
                                                    <Menu.MenuItem text="Xóa bình luận" onPress={() => this.deleteComment(item)} />
                                                </Menu>
                                            )
                                        })
                                    }
                                </View>
                            </ScrollView>
                            <View style={styles.commentBox}>
                                {/*image state upload*/}
                                <View style={styles.commentImages}>
                                    {
                                        !!this.state.attachTemp &&
                                        this.state.attachTemp.map((image, index) => (
                                            <View style={styles.commentImage} key={index}>
                                                <Image source={{ uri: image.url }} style={{ width: 60, height: 60 }} />
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
                                    {/*button image upload*/}
                                    <ImagePicker
                                        onSuccess={image => this.addImage(image)}
                                        cropping={false}
                                        editstyle='edit'
                                        multi={true}
                                        uploadOptions={{
                                            path: '/job/report',
                                            insertDb: true,
                                            overwrite: false,
                                            createThumbnail: true
                                        }}
                                        onImageSucess={image => this.onImageSucess(image)}
                                    >
                                        <View style={styles.commentSend}>
                                            <Icon name="camera" type='MaterialIcons' style={{ fontSize: 22, color: '#444' }} />
                                        </View>
                                    </ImagePicker>
                                    <TextInput
                                        style={[styles.commentInput, { height: Math.max(45, this.state.inputHeight) }]}
                                        placeholder={this.state.tabIndex == 0 ? 'Báo cáo' : 'Bình luận'}
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
                                <KeyboardSpacer iosOnly={true} />
                            </View>

                        </View>
                        {/*image view zoom*/}
                        <ImageViewer
                            index={this.state.currentImageIndex}
                            visible={this.state.showImageViewer}
                            images={this.images}
                            onRequestClose={() => this.setState({ showImageViewer: false })} />
                    </View>
                </MenuModalContext>
        )
    }
}

export default connect(JobDetailsBox, state => ({
    job: state.job,
    customer: state.customer,
    user: state.user,
    jobStatus: state.jobstatus,
    account: state.account
}), { ...actions });



const styles = StyleSheet.create({
    page: {
        flex: 1
    },
    sidebar: {
        backgroundColor: '#f9f9f9',
    },
    job: {
        flex: 1,
    },
    jobInfo: {
        flex: 1,
        padding: 10,
    },
    jobTitle: {
        flex: 1,
        color: '#fff',
        fontSize: 20,
        padding: 10,
        fontWeight: 'bold',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1
    },
    jobTypes: {
        flexDirection: 'row'
    },
    type: {
        fontSize: 22,
        flex: 1,
        padding: 10,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#ccc',
        textAlign: 'center',
        elevation: 0,
        shadowColor: 'black',
        shadowOpacity: 0.1,
        shadowRadius: StyleSheet.hairlineWidth,
        shadowOffset: {
            height: StyleSheet.hairlineWidth,
        },
        backgroundColor: '#fff'
    },
    typeActive: {
        elevation: -10,
        shadowOpacity: 0,
        shadowRadius: 0,
        backgroundColor: '#f0f0f0'
    },
    jobProp: {
    },
    label: {
        marginTop: 10,
        marginBottom: 10,
        fontSize: 14,
        color: '#444',
        fontWeight: 'bold'
    },
    value: {
        fontSize: 15,
        color: '#555',
        padding: 10,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#ccc',
        backgroundColor: '#f9f9f9'
    },
    valueSelect: {
        padding: 10,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#ccc',
        backgroundColor: '#f9f9f9'
    },
    selectTextStyle: { color: '#555' },
    content: {
        padding: 10,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#ccc',
        backgroundColor: '#f9f9f9',
        minHeight: 100
    },
    jobComments: {
        marginTop: 20,
        paddingBottom: 50
    },
    tabComment: { flexDirection: 'row', borderBottomColor: '#eee', borderBottomWidth: StyleSheet.hairlineWidth },
    commentTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        padding: 10,
    },
    commentTitleFocus: {
        fontWeight: 'bold',
        fontSize: 16,
        padding: 10,
        color: 'green',
        borderBottomWidth: 2,
        borderBottomColor: 'green',
    },
    comment: {
        padding: 10
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
        // paddingTop: 15,
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
    }
});


const drawerStyles = {
    drawer: {
        shadowColor: '#000000',
        shadowOpacity: 0.8,
        shadowRadius: 3
    },
    main: {

    },
    mainOverlay: {
        backgroundColor: '#000',
        opacity: 0,
        zIndex: 3,
        elevation: 3
    }
};
