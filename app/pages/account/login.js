import React from 'react';
import { StyleSheet, Alert, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import EcrmInput from '../../components/input';
import { View, Container, Form, Button, Text, Thumbnail, Spinner, Icon, Content, Picker } from 'native-base';
import Textbox from '../controls/textbox';
import Msg from '../../components/messager';
const logo = require('../../assets/images/logo.png');
import { connect } from '../../lib/connect';
import * as actions from '../../actions/account';
import Modal from 'react-native-modal';
import * as Linking from 'expo-linking'

class Login extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: navigation.getParam('title'),
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            fulldomain: this.props.account.domain ? 'https://' + this.props.account.domain + '.ecrm.vn' : '',
            domain: this.props.account.domain,
            username: '',
            password: '',
            setSelection: false,
            loading: false,
            email: "",
            msg: props.account.logoutMessage,
            remember: false,
            box: 'login',
            resetOK: false,
            isModalVisible: false,
            keyboardVisibled: false,
            selected: 1
        }
    }

    componentDidMount() {
        Linking.addEventListener('url', this.handleOpenURL);

    }

    componentWillUnmount() {
        Linking.removeEventListener('url', this.handleOpenURL);
    }

    handleOpenURL = ({ url }) => {

        let { queryParams } = Linking.parse(url);
        // // console.log('uuuuuuuu', url, path, queryParams);
        if (queryParams.action == 'get-token') {
            let link = 'stringeeapp://strtoken/?action=login&token=' + this.props.account.token + '&host=' + this.props.account.host;
            Linking.canOpenURL(link).then(supported => {
                if (!supported) {
                    // console.log('not link', link);
                } else {
                    return Linking.openURL(link);
                }
            }).catch(err => console.error('An error occurred', err));
        }
    }

    _renderModalContent = () => (
        <View style={styles.containermodal}>
            <View style={styles.containermodalbg} >
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <Icon type="MaterialIcons" name='arrow-back' onPress={() => this._toggleModal()} style={{ paddingRight: 10, fontSize: 25, color: '#333' }} />
                    <Text style={{ fontWeight: 'bold', color: '#333' }}>{__('Điền email để khôi phục mật khẩu.')}</Text>
                </View>
                {this._renderButton('md-aperture', __('Lấy lại mật khẩu'), () => this.resetPassword())}
            </View>
        </View>
    );

    _renderButton = (icon, text, onPress) => (
        <View>
            <Form>
                <Form>
                    <EcrmInput
                        keyboardType={'email-address'}
                        value={this.state.email}
                        onChangeText={value => this.setState({ email: value })}
                        style={styles.input} placeholder="Email"
                    />
                </Form>
                {this.state.msg && <Msg msg={this.state.msg} />}
                <Button block
                    onPress={onPress}
                    style={{ marginTop: 30, marginBottom: 15 }} >
                    {this.state.loading && <Spinner color='white' />}
                    <Text style={{ textAlign: 'center' }}>{__(text)}</Text>
                </Button>
            </Form>
        </View>

    );

    resetPassword = () => {
        this.setState({ loading: true });
        this.props.actions.resetPassword(this.state.email)
            .then(() => {
                Alert.alert(
                    __('Thành công '),
                    __('Vui lòng kiểm tra hộp thư đến của bạn và thực hiện theo các bước hướng đẫn để lấy lại mật khẩu.'),
                    [
                        { text: 'OK', onPress: () => this._toggleModal() },
                    ],
                    { cancelable: false }
                )
                this.setState({ resetOK: true, loading: false, msg: null });
            })
            .catch(error => {
                this.setState({ msg: error.message, loading: false });
            })
    }

    _toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible });

    }

    onDomainFocus = () => {
        this.setState({
            setSelection: true
        });
    }
    focusPassword = () => {
        this.refs.password.focus();
    }

    focusUserName = () => {
        this.refs.username.focus();
    }

    // replaceDomain = (v, value) => {
    //     if (v == 1 && value) {
    //         value = value.replace('https://', '').replace(/\..*nobi.pro|\..*ecrm.vn/, '').replace(/\s/, '');
    //         if (value == '') {
    //             this.setState({ fulldomain: '', domain: '' })
    //         }
    //         else {
    //             this.setState({ fulldomain: 'https://' + value + '.ecrm.vn', domain: value });
    //         }
    //     } else if (v == 2 && value) {
    //         value = value.replace('https://', '').replace(/\..*nobi.pro|\..*ecrm.vn/, '').replace(/\s/, '');
    //         if (value == '') {
    //             this.setState({ fulldomain: '', domain: '' })
    //         }
    //         else {
    //             this.setState({ fulldomain: 'https://' + value + '.nobi.pro', domain: value });
    //         }
    //     }
    // }

    setDomain = (value) => {
        this.setState({ fulldomain: value ? value.toLowerCase() : '' })
    }

    login = () => {
        const { username, password, fulldomain } = this.state;

        if (fulldomain && username && password) {
            var hostName = 'https://' + fulldomain.replace(/^https?(:\/\/)?/, '');
            if (!hostName.match(/.+(\.ecrm\.vn)|(\.nobi\.pro)$/)) {
                return alert('Vui lòng nhập vào tên miền đầy đủ với phần mở rộng ecrm.vn hoặc nobi.pro của bạn.');
            }

            this.setState({ loading: true });

            this.props.actions.login(hostName, username, password)
                .then(() => {
                    if (this.props.onLoginSuccess) {
                        this.props.onLoginSuccess();
                    }
                })
                .catch((e) => {
                    this.setState({
                        loading: false,
                        msg: e.message//e.type == 'network' ? 'Tên miền ứng dụng không chính xác' : e.message
                    });
                });
        } else {
            this.setState({ msg: __('Mời nhập đầy đủ thông tin') });
        }
    }


    keyboardToggle = (show) => {
        this.setState({ keyboardVisibled: show });
    }

    // onChangePass = () => {
    //     this.props.navigation.navigate('ChangePassWordPage', { title: 'Lấy lại mật khẩu' });
    // }

    // onValueChange = (v) => {
    //     this.setState({ selected: v })
    //     this.replaceDomain(v, this.state.domain)
    // }

    render() {
        const { height } = Dimensions.get('window');
        //const selectionStart = this.state.setSelection && this.state.domain ? this.state.domain.length + 8 : 0;
        return (
            <Container style={{ flex: 1 }}>
                <KeyboardAvoidingView style={{ flex: 1 }} {...(Platform.OS === 'ios' && { behavior: 'padding' })}>
                    <View style={styles.container}>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Thumbnail logo square source={logo}
                                style={[this.state.keyboardVisibled && height < 1024 ? styles.logoSmall : styles.logo]} resizeMode="contain" />
                        </View>
                        <View style={styles.form}>
                            <Form>
                                {/* <View style={[styles.input]}>
                                    <Picker
                                        note
                                        mode="dropdown"
                                        style={{ width: 180 }}
                                        selectedValue={this.state.selected}
                                        onValueChange={this.onValueChange}
                                    >
                                        <Picker.Item label="Miền .ecrm.vn" value={1} />
                                        <Picker.Item label="Miền .nobi.pro" value={2} />
                                    </Picker>
                                </View> */}
                                <Textbox ref="domain" placeholder="Tên miền"
                                    placeholderTextColor='#ccc'
                                    autoCapitalize='none'
                                    onChangeText={this.setDomain}
                                    onSubmitEditing={this.focusUserName}
                                    onFocus={this.onDomainFocus}
                                    blurOnSubmit={false}
                                    returnKeyType="next"
                                    style={[styles.input]}
                                    value={this.state.fulldomain}
                                //selection={{ start: selectionStart, end: selectionStart }} 
                                />
                                <Textbox ref="username" placeholder="Tài khoản"
                                    autoCapitalize='none'
                                    onChangeText={value => this.setState({ username: value })}
                                    onSubmitEditing={this.focusPassword}
                                    blurOnSubmit={false}
                                    returnKeyType="next"
                                    style={[styles.input]}
                                    value={this.state.username} />
                                <Textbox ref="password" placeholder="Mật khẩu" password
                                    autoCapitalize='none'
                                    onChangeText={value => this.setState({ password: value })}
                                    onSubmitEditing={this.login}
                                    returnKeyType="go"
                                    style={[styles.input]}
                                    value={this.state.password} />
                                {this.state.msg && <Msg msg={this.state.msg} />}
                                <Button block
                                    onPress={this.login}
                                    style={[this.state.msg ? { marginTop: 15, backgroundColor: '#ffb400' } : { marginTop: 30, backgroundColor: '#ffb400' }]} >
                                    {this.state.loading && <Spinner color='white' />}
                                    <Text>{__('Đăng Nhập')}</Text>
                                </Button>
                                <Button block transparent onPress={this._toggleModal} style={[this.state.msg ? { marginTop: 5 } : { marginTop: 10 }]} >
                                    <Text>{__('Quên mật khẩu')}</Text>
                                </Button>
                            </Form>
                        </View>
                    </View>
                </KeyboardAvoidingView>
                <Modal
                    isVisible={this.state.isModalVisible}
                    onBackdropPress={() => this._toggleModal()}
                    onBackButtonPress={() => this.setState({ isModalVisible: false })}
                    backdropColor={'rgba(0, 0, 0, 0.7)'}
                    backdropOpacity={1}
                    animationIn={'zoomIn'}
                    animationOut={'zoomOut'}
                    animationInTiming={200}
                    animationOutTiming={200}
                    backdropTransitionInTiming={500}
                    backdropTransitionOutTiming={500}
                >
                    {this._renderModalContent()}
                </Modal>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    form: {
        marginLeft: 20,
        marginRight: 20
    },
    containermodal: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    containermodalbg: {
        backgroundColor: '#fff',
        padding: 15,
        // borderTopLeftRadius: 5,
        // borderTopRightRadius: 5,
        borderRadius: 5
    },
    Firstcart: {
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        borderBottomColor: '#bbb',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    logo: {
        height: 130,
        width: 250,
        marginBottom: 40,
        marginTop: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    logoSmall: {
        height: 70,
        marginTop: 40,
        marginBottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    formst: {
        marginLeft: 10,
        marginRight: 10,
    },
    input: {
        fontSize: 15,
        height: 50,
        // paddingTop: 25,
        paddingLeft: 10,
    }
});

export default connect(Login, state => ({
    account: state.account,
}), actions);