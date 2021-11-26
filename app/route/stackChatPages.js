import React from "react";
import { createStackNavigator } from 'react-navigation-stack';
import ConvensionBox from '../pages/chat/convension/modalBox';
import ConvensionChat from '../pages/chat/convension/viewChat';
import ViewChat from '../pages/chat/index';
import PagesChat from '../pages/chat/listItem';

const ChatStackNavigator = createStackNavigator(
    {
        ViewChat: {
            screen: ViewChat,
            navigationOptions: {
                headerShown: false,
            },
        },
        ConvensionBox: {
            screen: ConvensionBox,
            navigationOptions: {
                headerShown: false,
            },
        },
        PagesChat: {
            screen: PagesChat,
            navigationOptions: {
                headerShown: false,
            },
        },
        ConvensionChat: {
            screen: ConvensionChat,
            navigationOptions: {
                headerShown: false,
            },
        },
    },
    {
        navigationOptions: {
            headerShown: false,
        },
    }
    // {
    //     defaultNavigationOptions: {
    //         title: 'Hội thoại',
    //         headerStyle: {
    //             backgroundColor: '#ffb400'
    //         },
    //         headerTintColor: '#fff',
    //         headerTitleStyle: {
    //             fontWeight: 'bold',
    //         },
    //     },
    // }
);

export default ChatStackNavigator;