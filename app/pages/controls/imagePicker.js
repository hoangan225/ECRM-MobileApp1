import React from "react";
import { View, Text, StatusBar, Platform, StyleSheet, TouchableHighlight, Modal, TouchableWithoutFeedback, TouchableOpacity, Dimensions } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { connect } from '../../lib/connect';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import moment from 'moment';
import Toolbar from './toolbars';
import RsTouchableNativeFeedback from './touchable-native-feedback';
import request from '../../lib/request';
import * as actions from '../../actions/account';

class ImgPicker extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isModalVisible: false,
            avatarUrl: null,
            hasCameraPermission: null,
            loading: false,
            show: false
        }
    }

    async UNSAFE_componentWillMount() {
        this.allowCamera = (await Permissions.getAsync(Permissions.CAMERA)).status == "granted";
        this.allowCameraRoll = (await Permissions.getAsync(Permissions.CAMERA_ROLL)).status == "granted";
    }

    UNSAFE_componentWillReceiveProps(props) {
        if (props.getImg) {
            this.setState({
                ...this.state,
                show: true
            })
        }
    }

    _TakePhotoCamera = async () => {
        let image = await ImagePicker.launchCameraAsync({
            mediaTypes: 'Images',
            allowsEditing: this.props.cropping,
            aspect: [1, 1]
        })
            .catch(error => console.log({ error }));

        if (image && !image.cancelled) {
            this._handleUploadSuccess(image);
            this.props.onImageSucess && this.props.onImageSucess(image);
        }
        this.close();
    }

    _ChoseImage = async () => {

        // console.log('start select image from library');

        let image = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'Images',
            allowsEditing: this.props.cropping,
            aspect: [1, 1],
        })
            .catch(error => console.log('cannot select image', error));

        if (image && !image.cancelled) {
            this._handleUploadSuccess(image);
            this.props.onImageSucess && this.props.onImageSucess(image);
        }
        this.close();
    };

    _handleUploadSuccess = file => {
        // // console.log(file)
        this.setState({ loading: true });
        const uri = file.uri;
        let uriParts = uri.split('.');
        let fileType = uriParts[uriParts.length - 1];
        // // console.log('permissionsuri', fileType);

        var formData = new FormData();

        formData.append('file', {
            uri,
            name: `img-${Date.now()}.${fileType}`,
            type: `image/${fileType}`,
        });

        let options = {
            ...this.props.uploadOptions
        }

        // console.log('image picker upload', options);

        for (let key in options) {
            formData.append(key, options[key]);
        }

        let ajaxOptions = {
            method: 'POST',
            body: formData,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                "authorization": 'Bearer ' + this.props.token
            },
        };

        fetch(this.props.host + "/api/attachments", ajaxOptions)
            .then(res => res.json())
            .then(data => {
                if (data) {
                    setTimeout(() => {
                        this.props.onSuccess(data);
                    }, 100);
                }
                else {
                    alert('Ảnh lỗi, vui lòng chọn một ảnh khác!.');
                }

            })
            .catch(error => {
                this.setState({ loading: false });
                alert('Upload ảnh lỗi, vui lòng thử lại!.');
            })


    }

    close = () => {
        this.setState({ show: false });
    }

    open = async () => {
        if (!this.allowCamera || !this.allowCameraRoll) {
            this.allowCameraRoll = (await Permissions.askAsync(Permissions.CAMERA_ROLL)).status == "granted";
            this.allowCamera = (await Permissions.askAsync(Permissions.CAMERA)).status == "granted";
        }

        if (this.allowCameraRoll && this.allowCamera) {

            if (this.props.allowCamera) {
                this.setState({ show: true });
            }
            else {
                this._TakePhotoCamera();
            }
        }
    }

    render() {
        var { user, host, token } = this.props;
        return (
            <View>
                <TouchableOpacity onPress={this.open}>
                    <View>
                        {this.props.children}
                    </View>
                </TouchableOpacity>
                <Modal
                    supportedOrientations={['portrait', 'landscape']}
                    visible={this.state.show}
                    onRequestClose={this.close}
                    transparent={true}
                    animationType='fade'>
                    <TouchableWithoutFeedback onPress={this.close}>
                        <View style={styles.container}>
                            <TouchableWithoutFeedback>
                                <View style={styles.actionSheet}>
                                    <Toolbar
                                        noPadding
                                        style={styles.toolbar}
                                        icon={<MaterialIcons name='arrow-back' size={22} />}
                                        iconColor='#000'
                                        onIconPress={this.close}
                                        titleText={this.props.title}
                                        titleColor='#000'
                                    ></Toolbar>
                                    <View style={styles.sheet}>
                                        <RsTouchableNativeFeedback onPress={this._TakePhotoCamera}>
                                            <View style={styles.item}>
                                                <MaterialIcons name="camera" style={styles.itemIcon} />
                                                <Text style={styles.itemText}>{__('Chụp ảnh mới')}</Text>
                                            </View>
                                        </RsTouchableNativeFeedback>
                                        <RsTouchableNativeFeedback onPress={this._ChoseImage}>
                                            <View style={styles.item}>
                                                <MaterialIcons name="image" style={styles.itemIcon} />
                                                <Text style={styles.itemText}>{__('Chọn ảnh từ thư viện')}</Text>
                                            </View>
                                        </RsTouchableNativeFeedback>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </View>
        );
    }
}

ImgPicker.defaultProps = {
    title: 'Chọn ảnh',
    imageWidth: 400,
    imageHeight: 400,
    cropping: true,
    multiple: false,
    allowCamera: true,
}

export default connect(ImgPicker, state => ({
    user: state.account.user,
    host: state.account.host,
    gender: state.app.enums.gender,
    token: state.account.token,
    getImg: state.account.getImg
}), actions);

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,.4)',
    },
    toolbar: {
        backgroundColor: '#fff',
        elevation: 1,
        shadowOpacity: 0,
        shadowRadius: 0,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
    },
    actionSheet: {
        width: Dimensions.get('window').width - 20,
        maxWidth: 300,
        borderRadius: 4,
        backgroundColor: '#fff'
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 60,
        padding: 20
    },
    itemIcon: {
        fontSize: 20,
        marginTop: 2,
        color: '#333',
    },
    itemText: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        marginLeft: 20
    }
});

