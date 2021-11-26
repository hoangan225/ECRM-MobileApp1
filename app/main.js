import "./start";
import React, { Component } from "react";
import { Root, StyleProvider } from "native-base";
import AppLoading from "expo-app-loading";
import * as Font from 'expo-font';
import * as Updates from 'expo-updates';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

import reducers from './reducers';
import { persistStore } from 'redux-persist';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import apiCall from './lib/ajax';
import thunk from 'redux-thunk';
import getTheme from './native-base-theme/components';
import commonColor from './native-base-theme/variables/commonColor';
import { Alert } from 'react-native';

const store = createStore(reducers, compose(applyMiddleware(apiCall, thunk)));
persistStore(store);

import Layout from './pages/layout';

export default class HomeNav extends Component {
    constructor(props) {
        super(props);
        this.state = { loading: true };
    }

    async UNSAFE_componentWillMount() {
        await Font.loadAsync({
            Roboto: require("./assets/fonts/Roboto.ttf"),
            Roboto_medium: require("./assets/fonts/Roboto_medium.ttf"),
            ...FontAwesome.font,
            ...MaterialIcons.font
        });
        this.setState({ loading: false });
    }

    componentDidMount() {
        this.updateListener = Updates.addListener(this._handleUpdate)
    }

    componentWillUnmount() {
        this.updateListener.remove();
    }

    _handleUpdate = ({ type }) => {
        if (type === Updates.UpdateEventType.UPDATE_AVAILABLE) {
            Alert.alert(
                'Cập nhật ứng dụng',
                'Ứng dụng vừa được cập nhật lên phiên bản mới, bạn có muốn mở lại ứng dụng không?',
                [
                    { text: 'Để sau', style: 'cancel' },
                    {
                        text: 'Đồng ý', onPress: async () => {
                            await Updates.reloadAsync();
                        }
                    },
                ],
                { cancelable: false }
            )
        }
    }

    render() {
        if (this.state.loading) {
            return (
                <Root>
                    <AppLoading />
                </Root>
            );
        }

        return (
            <Provider store={store}>
                <Root>
                    <StyleProvider style={getTheme(commonColor)}>
                        <Layout />
                    </StyleProvider>
                </Root>
            </Provider>
        );
    }
}
