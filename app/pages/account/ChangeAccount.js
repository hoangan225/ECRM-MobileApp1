import React, { Component } from 'react';
import { StyleSheet, Alert, Platform, Dimensions, KeyboardAvoidingView } from 'react-native';
import { Container, Content, Button, Text, Input, View } from 'native-base';
import { connect } from '../../lib/connect';
import DatePicker from '../controls/datepicker';
import Loadding from '../controls/loading';
import Select from '../controls/select';
import * as actions from '../../actions/account';

class ChangeAccount extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: navigation.getParam('title'),
            headerTitleStyle: {
                fontSize: 18,
                color: '#fff',
                fontWeight: 'bold'
            },
        }
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            model: {
                ...props.user
            },
            loading: false
        }
    }

    UNSAFE_componentWillReceiveProps(props) {
        this.setState(
            {
                model: {
                    ...props.user
                }
            }
        )
    }
    setValue = data => {
        this.setState({
            model: { ...this.state.model, ...data }
        });
    }

    handleSubmit = () => {
        let ok = this.validate(this.state.model.email);
        if (ok === true) {
            this.setState({ loading: true });
            this.state.model.fullName = this.state.model.lastName + " " + this.state.model.firstName;
            this.props.actions.updateProfile(this.state.model)
                .then(() => {

                    Alert.alert(
                        __('Cập nhật thành công'),
                        [
                            { text: '', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                            { text: 'OK', onPress: () => this.props.navigation.goBack() },
                        ],
                        { cancelable: false }
                    )
                    this.setState({ loading: false });
                })
                .catch(error => {
                    this.setState({ loading: false });
                    alert(error.error, error.message, 'error');
                });
        }
    }

    validate = (text) => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(text) === false) {
            Alert.alert(
                __('Email không đúng'),
                __('Nhập lại email'),
                [
                    { text: '', onPress: () => console.log('Ask me later pressed') },
                    { text: '', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ],
                { cancelable: false }
            )
            this.setValue({ email: text })
            return false;
        }
        else {
            this.setValue({ email: text })
            return true;
        }
    }


    render() {
        return (
            <Container style={{ backgroundColor: '#fff' }}>
                <KeyboardAvoidingView style={{ flex: 1 }} {...(Platform.OS === 'ios' && { behavior: 'padding' })}>
                    <Content>
                        <View style={styles.input}>
                            <Text style={styles.label}>{__('Họ')}</Text>
                            <Input
                                style={styles.inputText}
                                value={this.state.model.lastName}
                                onChangeText={(text) => this.setValue({ lastName: text })}
                            />
                        </View>
                        <View style={styles.input}>
                            <Text style={styles.label}>{__('Tên')}</Text>
                            <Input
                                style={styles.inputText}
                                value={this.state.model.firstName}
                                onChangeText={(text) => this.setValue({ firstName: text })}
                            />
                        </View>
                        <View style={styles.input}>
                            <Text style={styles.label}>{__('Giới tính')}</Text>
                            <Select
                                items={[
                                    { label: 'Nam', value: 1 },
                                    { label: 'Nữ', value: 2 },
                                ]}
                                style={styles.inputText}
                                selectedValue={this.state.model.gender}
                                showSearchBox={false}
                                onValueChange={value => this.setValue({ gender: value })} />
                        </View>
                        <View style={styles.input}>
                            <Text style={styles.label}>{__('Email')}</Text>
                            <Input
                                style={styles.inputText}
                                keyboardType={'email-address'}
                                value={this.state.model.email}
                                onChangeText={(text) => this.setValue({ email: text })}
                            />
                        </View>
                        <View style={styles.input}>
                            <Text style={styles.label}>{__('Phone')}</Text>
                            <Input
                                style={styles.inputText}
                                keyboardType={'phone-pad'}
                                value={this.state.model.phone}
                                onChangeText={(text) => this.setValue({ phone: text })}
                            />
                        </View>
                        <View style={styles.input}>
                            <Text style={styles.label}>{__('Ngày sinh')}</Text>
                            <DatePicker
                                style={styles.inputText}
                                placeholder="Chọn ngày"
                                date={this.state.model.birthdate}
                                onDateChange={(date) => { this.setValue({ birthdate: date }) }}
                                defaultDate={'1990-09-09'}
                            />
                        </View>
                        {/*
                        <View style={styles.input}>
                            <Text style={styles.label}>{__('Địa chỉ')}</Text>
                            <Input
                                style= {styles.inputText}
                            
                            />
                        </View>
                        */}
                        <View style={styles.input}>
                            <Text style={styles.label}>{__('Giới thiệu')}</Text>
                            <Input
                                multiline={true}
                                style={[styles.inputText, styles.textarea]}
                                value={this.state.model.description}
                                onChangeText={(text) => this.setValue({ description: text })}
                            />
                        </View>
                        <View style={{ marginTop: 30, marginBottom: 20, justifyContent: 'center', alignItems: 'center' }}>
                            <Button block
                                style={styles.btn}
                                onPress={this.handleSubmit}
                            >
                                <Text>{__('Cập nhật thông tin')}</Text>
                            </Button>
                        </View>
                        {this.state.loading && <Loadding />}

                    </Content>
                </KeyboardAvoidingView>
            </Container>

        );
    }
}

export default connect(ChangeAccount, state => ({
    user: state.account.user,
    gender: state.app.enums.gender
}), actions);

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    input: {
        paddingLeft: 10,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: '#ddd',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderTopWidth: 0,
    },
    inputText: {
        flex: 3,
        backgroundColor: '#f9f9f9',
        marginTop: 8,
        marginBottom: 8,
        marginRight: 5,
        height: 35,
        width: Dimensions.get('window').width - 100,
    },
    textarea: {
        flex: 3,
        minHeight: 50
    },
    datepk: {
        backgroundColor: '#f9f9f9',
        marginTop: 8,
        marginBottom: 8,
        marginRight: 5,
        height: 35,
        width: 300,
    },
    label: {
        flex: 1,
        width: 90,
        color: '#000',
        fontWeight: 'bold'
    },
    btn: {
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 4,
    }
})