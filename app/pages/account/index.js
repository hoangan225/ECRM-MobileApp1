import React from "react";
import moment from 'moment';
import { StatusBar, Platform, Image, Alert, StyleSheet, TouchableHighlight, FlatList } from "react-native";
import { View, Icon, Text } from 'native-base';
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { connect } from '../../lib/connect';
import ImagePicker from '../controls/imagePicker';
import Avatar from '../controls/avatar';
import RsTouchableNativeFeedback from '../controls/touchable-native-feedback';
import * as actions from '../../actions/account';

class Account extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isModalVisible: false,
            avatarUrl: null,
            hasCameraPermission: null,
            loading: false,
            urlTemp: null
        }
    }

    componentDidMount() {
        this.props.actions.getProfile()
            .then(() => {
                this.setState({ loading: false });
            })
            .catch(({ error, message }) => {
                this.setState({ loading: false });

            })
        this.setState({
            avatarUrl: this.props.user ? this.props.user.avatar : null
        });
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: __('Tài Khoản'),
            headerTitleStyle: {
                fontSize: 18,
                color: '#fff',
                fontWeight: 'bold'
            },
            headerLeft: () => <Icon
                type="MaterialIcons"
                onPress={() => navigation.openDrawer()}
                style={{ paddingLeft: 20, color: '#fff', fontSize: 22 }} name="menu" />,
        }
    };

    logoutfc = () => {
        Alert.alert(
            __('Thông Báo'),
            __('Bạn Có Muốn Đăng Xuất Không?'),
            [
                { text: 'Hủy Bỏ', style: 'cancel' },
                { text: 'Đăng Xuất', onPress: () => this.props.navigation.navigate('Logout') },
            ],
            { cancelable: false }
        )
    }

    addImage = (image) => {
        this.setState({
            avatarUrl: image.url
        })
        this.saveAvatar(image.url);
    }

    onImageSucess = (file) => {
        this.setState({
            urlTemp: file.uri
        });
    }

    saveAvatar = (url) => {
        this.props.actions.updateAvatar(this.props.user.id, url).then((userdata) => {
            this.setState({
                avatarUrl: url
            });
            this.props.actions.getProfile();
        })
            .catch(() => {
                alert(__('Upload ảnh đại diện lỗi, vui lòng thử lại'));
            });
        this.props.actions.getImg(false);
    }

    onMenuItemPress = (item) => {
        if (item.key == 'logout') {
            this.logoutfc();
        }
        else if (item.key == 'reset') {
            Alert.alert(
                'Làm mới ứng dụng?',
                'Việc này sẽ xóa hết toàn bộ dữ liệu hiện có sau đó tải lại, yêu cầu có kết nối mạng.',
                [
                    {
                        text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'
                    },
                    {
                        text: 'OK', onPress: () => {
                            this.props.actions.reset()
                        }
                    },
                ],
                { cancelable: false }
            )
        }
        else if (item.key == 'change-avatar') {
            // this.props.actions.getImg(true);
        }
        else {
            this.props.navigation.navigate(item.key, { title: `${__(item.text)}` });
        }

    }

    renderMenuItem = ({ item }) => {
        if (item.key == 'change-avatar') {
            return (
                <ImagePicker
                    onImageSucess={image => this.onImageSucess(image)}
                    onSuccess={image => this.addImage(image)}
                    cropping={true}
                    multi={false}>
                    <View key={item.key} style={styles.menuItem}>
                        <MaterialIcons name={item.icon} style={styles.menuIcon} />
                        <Text style={styles.menuText}>{item.text}</Text>
                        <MaterialIcons name='keyboard-arrow-right' style={[styles.menuIcon, { color: '#999' }]} />
                    </View>
                </ImagePicker>
            )
        }

        return (
            <RsTouchableNativeFeedback onPress={() => this.onMenuItemPress(item)}>
                <View key={item.key} style={styles.menuItem}>
                    <MaterialIcons name={item.icon} style={styles.menuIcon} />
                    <Text style={styles.menuText}>{item.text}</Text>
                    <MaterialIcons name='keyboard-arrow-right' style={[styles.menuIcon, { color: '#999' }]} />
                </View>
            </RsTouchableNativeFeedback>
        )
    }

    render() {
        var { user, host, token } = this.props;
        const menu = [
            {
                icon: 'info',
                text: __('Thông tin tài khoản'),
                key: 'AccountInfo',
            },
            {
                icon: 'security',
                text: __('Đổi mật khẩu'),
                key: 'ResetPassword',
            },
            {
                icon: 'add-a-photo',
                text: __('Đổi ảnh đại diện'),
                key: 'change-avatar',
            },
            {
                icon: 'refresh',
                text: __('Làm mới toàn ứng dụng'),
                key: 'reset'
            },
            {
                icon: 'exit-to-app',
                text: __('Đăng xuất hệ thống'),
                key: 'logout'
            },
        ];

        return (
            <View style={styles.page}>

                <View style={styles.panel}>
                    {
                        <ImagePicker
                            onImageSucess={image => this.onImageSucess(image)}
                            onSuccess={image => this.addImage(image)}
                            cropping={true}
                            uploadOptions={{
                                path: '/avatar',
                                insertDb: false,
                                overwrite: true,
                                createThumbnail: false,
                                imageWidth: 200,
                                imageHeight: 200,
                                changeNameTo: 'user-' + this.props.user.id + '-' + moment().format('hhmmss')
                            }}>
                            <Avatar style={styles.avatar}
                                url={this.state.urlTemp || this.state.avatarUrl || user.avatar}
                                id={user.id}
                                name={user.fullName}
                                size={70} />
                        </ImagePicker>
                    }
                    <Text style={styles.username}>
                        {user.fullName}
                    </Text>
                </View>

                <FlatList
                    data={menu}
                    renderItem={this.renderMenuItem}
                    keyExtractor={item => item.key}
                />
            </View>
        );
    }
}

export default connect(Account, state => ({
    user: state.account.user,
    host: state.account.host,
    gender: state.app.enums.gender,
    token: state.account.token
}), actions);

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;


const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: '#fff'
    },
    panel: {
        backgroundColor: '#eed400',
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15
    },
    avatar: {
        borderColor: '#fff',
        borderWidth: 3,
    },
    username: {
        color: '#fff',
        fontSize: 24,
        marginLeft: 10,
    },
    menuItem: {
        flexDirection: 'row',
        padding: 15,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc',
        alignItems: 'center',
    },
    menuIcon: {
        color: '#555',
        fontSize: 24,
    },
    menuText: {
        marginLeft: 10,
        flex: 1
    }
});

