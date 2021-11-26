import React from 'react';
import moment from 'moment';
import { View, Text, ScrollView, FlatList, StyleSheet, Platform, StatusBar, Dimensions, TouchableOpacity } from 'react-native';
// import { Icon } from 'native-base';
import * as Facebook from 'expo-facebook';
import { connect } from '../../../lib/connect';
import * as actions from '../../../actions/facebookMessage/message';
let screenHeight = Dimensions.get("window").height;
import APP_ID from "../../../constants/app_id";
class LoginFb extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            showCreate: false,
            currentEdit: false,
            currentDelete: null,
            selectedDate: null,
            showListJob: false,
            currentJob: null,
            currentBox: null,
            showWidget: false,
            today: moment().startOf('day'),
        }
    }

    showMenu = () => {
        this.props.navigation.openDrawer();
    }

    logInFb = async () => {
        let capturedToken = null;
        try {
            await Facebook.initializeAsync({
                appId: APP_ID.app_id,
            });
            const {
                type,
                token,
                expirationDate,
                permissions,
                declinedPermissions,
            } = await Facebook.logInWithReadPermissionsAsync({
                permissions: ['public_profile'],
            });
            if (type === 'success') {
                // Get the user's name using Facebook's Graph API
                const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
                // alert('Logged in!', `Hi ${(await response.json()).name}!`);
                let dataJson = await response.json();
                if (dataJson) {
                    // // console.log(dataJson, "-------")

                    this.props.fbUser(dataJson.id);

                }
            } else {
                // type === 'cancel'
            }
        } catch ({ message }) {
            alert(`Facebook Login Error: ${message}`);
        }
    }


    render() {
        // const widgets = this.state.widgets;
        return (
            <View style={styles.page}>
                <TouchableOpacity style={[styles.btn, { backgroundColor: '#4267b2', justifyContent: "center", alignItems: "center" }]} onPress={this.logInFb}>
                    {
                        // <Image
                        //     style={{ width: 20, height: 20 }}
                        //     source={require('../../../assets/facebook.png')}
                        // />
                    }
                    <Text>{__('KẾT NỐI FACEBOOK')}</Text>
                </TouchableOpacity>

            </View>
        );
    }
}


export default (connect(LoginFb, state => ({
    app: state.app,
    account: state.account,
}),
    actions
));

const styles = StyleSheet.create({
    page: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ddd"
    },
    btn: {
        padding: 10
    },
    scrollView: {
        paddingBottom: 100
    },
    pageItems: {
        height: screenHeight / 2
    },
    widget: {
        backgroundColor: '#fff'
    },
    headerViewChart: {
        flexDirection: 'row',
        // borderColor: '#ccc',
        // borderWidth: StyleSheet.hairlineWidth,
        paddingVertical: 5,
        alignItems: 'center',
        backgroundColor: '#ddd'
    },
    headerChildViewChart: {
        flex: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    btnCloseView: {
        flex: 1,
        alignItems: 'flex-end'
    },
    textHeader: {
        fontWeight: 'bold',
        fontStyle: 'italic',
        color: '#333'
    },
    icon: {
        fontSize: 14,
        color: '#333',
        paddingLeft: 15,
        paddingRight: 15,
    }
})