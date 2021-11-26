import React, { Component } from 'react';
import { View } from 'react-native';
import * as actions from '../../actions/account';
import * as appActions from '../../actions/app';
import { getList as branchGetList } from '../../actions/branch';
import { getToken as getTokenVoip } from '../../actions/voip/call';
// import { connect } from '../../lib/connect';
import { connect, Context as HttpContext } from '../../lib/connect';
// import MainPage from '../../route';
import MainPage from '../../route/components/homeIndex';
import LoginPage from '../account/login';
import ErrorPage from './error';
import LoadingPage from './loading';
class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            networkError: null,
        }
    }
    componentDidMount() {
        this.props.actions.getToken();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.app.storageLoaded && this.props.account.loaded && this.props.account.token) {
            if (!this.props.account.loggedIn) {
                if (!this.loadingProfile) {
                    this.loadingProfile = true;
                    this.props.actions.getProfile().then(data => {
                        this.loadingProfile = false;
                        this.props.actions.getEnums();
                        this.props.actions.getFields();
                        this.props.actions.getOptions().then(() => {
                            // console.log('getOption sc');
                        }).catch((e) => { console.log('error', e) })
                    }).catch(e => {
                        if (e.status == 401 || e.status == 400 || e.status == 404
                            || e.status == 502 || e.status == 500 || e.status == 403) {
                            this.props.actions.logout();
                        }
                        else {
                            this.setState({ networkError: e });
                        }
                        return 1;
                    });
                }
            }
        }
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                {this.renderMain()}
            </View>
        )
    }

    onLoggedIn = () => {
        this.setState({ networkError: false })
    }

    renderMain() {
        // AsyncStorage.removeItem('access_token');

        if (this.state.networkError) {
            return <LoginPage onLoginSuccess={this.onLoggedIn} />
            // return <ErrorPage {...this.state.networkError} error="500" />
        }

        if (this.props.app.storageLoaded && this.props.account.loaded) {
            if (this.props.account.token && this.props.account.host) {
                if (this.props.account.loggedIn) {
                    let str = this.props.account.host;
                    return <MainPage />;
                }
                else {
                    // console.log("loading");
                    return <LoadingPage />;
                    // this.props.actions.logout();
                }
            }
            return <LoginPage onLoginSuccess={this.onLoggedIn} />
        }
        else {
            return <LoadingPage />
        }
    }
}

const LayoutWrap = connect(Layout, state => ({
    account: state.account,
    app: state.app,
    branch: state.branch,
}), { ...actions, ...appActions, branchGetList, getTokenVoip });



export default (props) => (
    <HttpContext {...props}>
        <LayoutWrap {...props} />
    </HttpContext>
)