import Constants from 'expo-constants'
import { Container, Icon, Toast } from 'native-base';
import React, { Component } from 'react';
import { Alert, Dimensions, Platform, StatusBar, StyleSheet } from 'react-native';
import { DrawerActions } from 'react-navigation-drawer';
import * as fbPageMessage from '../../actions/facebookMessage/message';
import * as actions from '../../actions/facebookMessage/page';
import { connect } from '../../lib/connect';
import Toolbar from '../controls/toolbars';
import MyStatusBar from '../statusBar/MyStatusBar';
import PagesChat from './listItem';
// import ConvensionBox from './convension/modalBox';
// import ConvensionChat from './convension/viewChat';
import RealTime from './realTime';
import LoginFacebook from "./convension/loginFB";

class Customer extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: false,
            showMerge: false,
            showFilter: null,
            currentConvension: null,
            currentBox: null
        }
    }

    componentDidMount() {
        this.props.actions.checkRemoveMergePages()
    }

    showMenu = () => {
        // this.props.navigation.openDrawer()
        this.props.navigation.dispatch(DrawerActions.openDrawer());
    }

    showBox = (convension, box = null, cb = null) => {
        // // console.log("show box", convension, box)
        if (box == "convension") {
            this.props.navigation.navigate("ConvensionBox", { currentConvension: convension });
        } else {
            if (box == "viewChat") {
                this.props.navigation.navigate("ConvensionChat", { currentConvension: convension });
            }

            if (cb) {
                this.setState({ currentConvension: convension, currentBox: box }, () => {
                    setTimeout(cb, 300);
                });
            }
            else {
                this.setState({ currentConvension: convension, currentBox: box });
            }
        }

    }

    closeConvension = (id) => {
        if (id) {
            this.setState({ currentConvension: { id }, currentBox: "convension" });
        }
    }

    fbUser = (id) => {
        // // console.log("11", id)
        this.props.actions.fbUser(id);
        // this.props.actions.getFbUser(id);
    }

    render() {
        let { message } = this.props;
        const actions = [
            {
                icon: <Icon type='MaterialIcons' name='apps' style={{ fontSize: 22, color: this.state.showMerge ? "green" : '#fff' }} />,
                onPress: () => this.setState({ showMerge: !this.state.showMerge })
            }
        ];

        return (
            <Container style={styles.container}>
                {Platform.OS === 'ios' ? <StatusBar backgroundColor='#ffb400' barStyle='light-content' /> : <MyStatusBar backgroundColor='#ffb400' barStyle='light-content' />}
                <Toolbar
                    noShadow
                    icon={<Icon type='MaterialIcons' name="menu" style={{ fontSize: 22, color: '#fff' }} />}
                    actions={actions}
                    onIconPress={this.showMenu}
                    titleText={__('Pages')}
                    style={styles.toolbar}
                    onPressMore={() => this.showBox({}, 'menucontext')}
                ></Toolbar>
                {
                    !!message && message.fbUserId ?
                        <PagesChat
                            showMerge={this.state.showMerge}
                            hideMerge={() => { this.setState({ showMerge: false }) }}
                            showBox={this.showBox}
                        /> :
                        <LoginFacebook
                            fbUser={(id) => this.fbUser(id)}
                        />
                }

                <RealTime />
                {
                    // this.state.currentBox == "convension" &&
                    // <ConvensionBox
                    //     showBox={this.showBox}
                    //     currentConvension={this.state.currentConvension}
                    //     onRequestClose={() => this.showBox({})}
                    // />
                }
                {
                    // this.state.currentBox == "viewChat" &&
                    // <ConvensionChat
                    //     currentChat={this.state.currentConvension}
                    //     onRequestClose={() => this.showBox({})}
                    //     onRequestCloseConvension={(pageId) => this.closeConvension(pageId)}
                    // />
                }
            </Container>
        );

    }
}

export default connect(Customer, state => ({
    host: state.account.host,
    message: state.fbMessage,
}), {
    ...actions, ...fbPageMessage
});


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: Constants.statusBarHeight,
    },
    tabBar: {
        backgroundColor: '#ffb400',
        maxHeight: 70,
        minHeight: 40,
    },
    indicator: {
        backgroundColor: '#fff',
    },
    actionIcon: {
        padding: 5,
    },
    sizeIcon: {
        fontSize: 20
    }
});