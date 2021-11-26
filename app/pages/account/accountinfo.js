import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Container, Content, Button, Icon, Text, Input, View } from 'native-base';
import { connect } from '../../lib/connect';
import DatePicker from '../controls/datepicker';
import * as actions from '../../actions/account';
import moment from 'moment';

class accountinfo extends Component {
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
            loading: false
        }
    }

    moveChangeAccount = () => {
        this.props.navigation.navigate('ChangeAccountPage', { title: 'Thông tin tài khoản' });
    }

    render() {
        var date = this.props.userbirthdate;
        if (date && date != null) {
            date = moment(date).format("DD/MM/YYYY");
        }

        return (
            <Container>
                <Content>
                    <View style={styles.input}>
                        <Text style={styles.label}>{__('Họ')}</Text>
                        <Input editable={false} value={this.props.user.lastName} />
                    </View>
                    <View style={styles.input}>
                        <Text style={styles.label}>{__('Tên')}</Text>
                        <Input editable={false} value={this.props.user.firstName} />
                    </View>
                    <View style={styles.input}>
                        <Text style={styles.label}>{__('Giới tính')}</Text>
                        <Input editable={false} value={this.props.user.gender === 1 ? __('Nam') : __('Nữ')} />
                    </View>
                    <View style={styles.input}>
                        <Text style={styles.label}>{__('Email')}</Text>
                        <Input editable={false} value={this.props.user.email} />
                    </View>
                    <View style={styles.input}>
                        <Text style={styles.label}>{__('Phone')}</Text>
                        <Input editable={false} value={this.props.user.phone} />
                    </View>

                    <View style={styles.input}>
                        <Text style={styles.label}>{__('Ngày sinh')}</Text>

                        <Input editable={false} value={date} />
                    </View>
                    {/* 
        <View style = {styles.input}>
            <Text style={styles.label}>{__('Địa chỉ')}</Text>
            <Input editable={false} />
        </View>
        */}
                    <View style={styles.input}>
                        <Text style={styles.label}>{__('Giới thiệu')}</Text>
                        <Input

                            value={this.props.user.description}
                            editable={false}
                        />
                    </View>
                    <View style={{ marginTop: 30, justifyContent: 'center', alignItems: 'center' }}>
                        <Button block
                            // onPress={this.props.navigation.navigate('ChangeAccountPage', {title: 'Thông tin tài khoản'})}
                            onPress={this.moveChangeAccount}
                            style={styles.btn}
                        >
                            <Text>{__('Thay đổi thông tin')}</Text>
                        </Button>
                    </View>
                </Content>
            </Container>
        );
    }
}

export default connect(accountinfo, state => ({
    user: state.account.user,
    gender: state.app.enums.gender
}), actions);

const styles = StyleSheet.create({
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
    label: {
        width: 90,
        color: '#333',
        fontWeight: 'bold'
    },
    btn: {
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 4
    }
})