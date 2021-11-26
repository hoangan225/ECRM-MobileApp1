import React from 'react';
import { StyleSheet, Alert } from 'react-native';
import {
    View, Container, Item, Input,
    Button, Text, CardItem, Icon, Body
} from 'native-base';
import { connect } from '../../lib/connect';
import * as actions from '../../actions/account';
import Modal from 'react-native-modal';


class ResetPass extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

            loading: false,
            email: "",
            msg: props.account.logoutMessage,
            remember: false,
            box: 'login',
            resetOK: false,
            isModalVisible: false,
        }
    }



    _renderModalContent = () => (
        <View style={styles.containermodal}>
            <View style={styles.wrapperModal}>
                <CardItem style={styles.Firstcart}>
                    <Icon type="FontAwesome" name='arrow-right' onPress={() => this._toggleModal()} />
                    <Text style={{ fontWeight: 'bold' }}>{__('Điền email để khôi phục mật khẩu.')}</Text>
                </CardItem>
                {this._renderButton('md-aperture', __('Lấy lại mật khẩu'), () => this.resetPassword())}
            </View>
        </View>
    );

    _renderButton = (icon, text, onPress) => (
        <View>

            <CardItem>
                <Item>
                    <Input
                        keyboardType={'email-address'}
                        value={this.state.email}
                        onChangeText={value => this.setState({ email: value })}
                        style={styles.input} placeholder="Email" />
                </Item>
            </CardItem>
            <CardItem>
                {this.state.msg &&
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ color: 'red', fontSize: 12 }}>{__('Vui lòng nhập đúng email')}</Text>
                    </View>}
            </CardItem>
            <View>
                <CardItem>
                    <Body style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <Button block onPress={onPress}>
                            <Text style={{ textAlign: 'center' }}>{__(text)}</Text>
                        </Button>
                    </Body>
                </CardItem>
            </View>

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

    render() {
        return (
            <Container style={{ flex: 1 }}>
                <Modal
                    isVisible={this.props.isModalVisible}
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
        marginLeft: 10,
        marginRight: 10,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    containermodal: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        // backgroundColor: '#fff'
    },
    Firstcart: {
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        borderBottomColor: '#bbb',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
});

export default connect(ResetPass, state => ({
    account: state.account,
}), actions);