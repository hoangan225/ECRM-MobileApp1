import React, { Component } from 'react';
import { KeyboardAvoidingView, StyleSheet, Alert } from 'react-native';
import { View, Container, Form, Button, Text, Spinner } from 'native-base';
import EcrmInput from '../../components/input';
import { connect } from '../../lib/connect';
import * as actions from '../../actions/account';
import Msg from '../../components/messager';
import Loading from '../controls/loading';

class ResetPassWord extends Component {
    static navigationOptions = ({ navigation, navigationOptions }) => {
        return {
            headerTitle: navigation.getParam('title'),
            headerTitleStyle: {
                fontSize: 18,
                color: '#fff',
                fontWeight: 'bold'
            },
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            model: {
                password: '',
                newPassword: '',
                rePassword: '',

            },
            loading: false,
            samepassword: false
        }
    }
    UNSAFE_componentWillReceiveProps(props) {
        this.setState(
            {
                model: {
                    password: '',
                    newPassword: '',
                    rePassword: ''
                }
            }
        )
    }
    setValue = data => {
        this.setState({
            model: { ...this.state.model, ...data }
        });
    }
    handleClose = () => {
        this.props.navigation.navigate('Account');
    }
    handleSubmit = () => {
        this.setState({
            loading: true
        });
        const { password, newPassword, rePassword } = this.state.model;
        if (!password) {
            this.setState({
                loading: false,
                msg: 'Mời nhập đầy đủ thông tin'
            });
        } else if ((newPassword.length < 6) || (rePassword.length < 6)) {
            this.setState({
                loading: false,
                msg: 'Mật khẩu phải mới ít nhất 6 kí tự'
            });
        } else if (newPassword != rePassword) {
            this.setState({
                loading: false,
                msg: 'Mật khẩu không khớp'
            });
        } else {

            this.props.actions.changePassword(this.state.model)
                .then(data => {
                    this.setState({ loading: false });
                    Alert.alert(
                        __('Thành công'),
                        __('Mời đăng nhập lại'),
                        [
                            { text: 'Ok', onPress: () => this.props.navigation.navigate('Login') },
                        ],
                        { cancelable: false }
                    )

                })
                .catch(error => {
                    this.setState({
                        loading: false,
                        msg: error.message
                    });
                });
        }


    }

    render() {
        return (
            <Container  >
                {this.state.loading && <Loading />}
                <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
                    <View style={styles.constainer}>
                        <Form>
                            <EcrmInput
                                // secureTextEntry={true}
                                value={this.state.model.password}
                                onChangeText={value => this.setValue({ password: value })}
                                placeholder={__('Mật Khẩu Cũ')}
                            />
                            <EcrmInput
                                value={this.state.model.newPassword}
                                onChangeText={value => this.setValue({ newPassword: value })}
                                placeholder={__('Mật Khẩu Mới')}
                            // secureTextEntry={true}
                            />
                            <EcrmInput
                                value={this.state.model.rePassword}
                                onChangeText={value => this.setValue({ rePassword: value })}
                                placeholder={__('Nhập Lại Mật Khẩu Mới')}
                            // secureTextEntry={true}
                            />
                        </Form>
                        {this.state.msg && <Msg msg={this.state.msg} />}
                        <Button block
                            onPress={this.handleSubmit}
                            style={{ marginTop: 40 }} >
                            <Text>{__('Đổi Mật Khẩu')}</Text>
                        </Button>
                    </View>
                </KeyboardAvoidingView>
            </Container>
        );
    }
}


const styles = StyleSheet.create({
    constainer: {
        paddingTop: 20,
        paddingLeft: 15,
        paddingRight: 15
    },
});

export default connect(ResetPassWord, null, actions);