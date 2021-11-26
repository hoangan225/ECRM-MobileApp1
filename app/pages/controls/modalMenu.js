import moment from 'moment';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Dimensions, Linking, StyleSheet, Animated, Easing,
    View, ScrollView, TouchableWithoutFeedback, Text, Image, Modal
} from 'react-native';

import RsTouchableNativeFeedback from './touchable-native-feedback';
import { MaterialIcons } from '@expo/vector-icons';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
import FilterChat from "../chat/convension/filter/chat";
import FilterConvension from "../chat/convension/filter/convension";

class ActionSheet extends Component {
    constructor(props) {
        super(props);
        this.actionSheetHeight = new Animated.Value(0);
    }

    UNSAFE_componentWillUpdate() {
        this.actionSheetHeight = new Animated.Value(0);
    }

    componentDidUpdate() {
        this.actionSheetHeight = new Animated.Value(0);
        const width = windowWidth - 100;
        const height = 40 * this.props.items.length + 40 + (this.props.title ? 50 : 0);
        Animated.timing(this.actionSheetHeight,
            {
                toValue: Math.min(width, windowWidth),
                duration: 300,
                useNativeDriver: true
            }
        ).start();
    }

    componentDidMount() {
        this.componentDidUpdate();
    }

    onActionPress = (entry, name, show) => {
        if (show) {
            this.props.showBox(entry, name);
        }
    }

    render() {
        const { items, open, title } = this.props;

        if (!open) return null;

        return (
            <Modal
                supportedOrientations={['portrait', 'landscape']}
                onRequestClose={this.props.onRequestClose}
                animationType="fade"
                transparent={true}>
                <TouchableWithoutFeedback onPress={this.props.onRequestClose}>
                    <View style={styles.container}>
                        <TouchableWithoutFeedback>
                            <Animated.View style={[styles.actionSheet]}>
                                {
                                    !!title && (
                                        <View style={styles.sheet}>
                                            <View style={styles.sheetInfo}>
                                                <Text style={styles.sheetTitle}>
                                                    {title}
                                                </Text>
                                            </View>
                                            <View style={styles.sheetClose}>
                                                <RsTouchableNativeFeedback onPress={this.props.onRequestClose} rippleBorderless={true}>
                                                    <View><MaterialIcons name='keyboard-arrow-down' style={styles.sheetIcon} /></View>
                                                </RsTouchableNativeFeedback>
                                            </View>
                                        </View>
                                    )
                                }
                                {
                                    this.renderItems(items)
                                }
                            </Animated.View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }

    renderItems = actions => {

        // // console.log("actions sheet", this.props.filterChat, this.props.filterConvension)
        if (this.props.filterChat && this.props.filterChat != "undefined") {
            return (<ScrollView>
                <View>
                    <FilterChat />
                </View>
            </ScrollView>)
        }
        if (this.props.filterConvension && this.props.filterConvension != "undefined") {
            return (<ScrollView>
                <View>
                    <FilterConvension
                        checkTags={this.props.checkTags}
                        pageId={this.props.pageId}
                        arrayFilter={this.props.arrayFilter}
                        removeFilterTags={(item) => this.props.removeFilterTags(item)}
                        filterTags={(item) => this.props.filterTags(item)}
                        filterAll={(item) => this.props.filterAll(item)}
                        filterNotRead={(item) => this.props.filterNotRead(item)}
                        removeFilterNotRead={(item) => this.props.removeFilterNotRead(item)}
                        filterMessage={(item) => this.props.filterMessage(item)}
                        removeFilterMessage={(item) => this.props.removeFilterMessage(item)}
                        filterComment={(item) => this.props.filterComment(item)}
                        removeFilterComment={(item) => this.props.removeFilterComment(item)}
                        filterNotReply={(item) => this.props.filterNotReply(item)}
                        removeFilterNotReply={(item) => this.props.removeFilterNotReply(item)}
                        filterHavePhone={(item) => this.props.filterHavePhone(item)}
                        removeFilterHavePhone={(item) => this.props.removeFilterHavePhone(item)}
                        filterNotPhone={(item) => this.props.filterNotPhone(item)}
                        removeFilterNotPhone={(item) => this.props.removeFilterNotPhone(item)}
                        filterHandle={(item) => this.props.filterHandle(item)}
                        removeFilterHandle={(item) => this.props.removeFilterHandle(item)}
                        filterNotHandle={(item) => this.props.filterNotHandle(item)}
                        removeFilterNotHandle={(item) => this.props.removeFilterNotHandle(item)}
                    />
                </View>
            </ScrollView>)
        }
        return (
            <ScrollView>
                <View style={{ paddingVertical: 15 }}>
                    {
                        actions.map((item, key) => (
                            <RsTouchableNativeFeedback onPress={item.onPress} key={key}>
                                <View style={styles.action}>
                                    {item.icon && React.cloneElement(item.icon, { style: styles.actionIcon })}
                                    <Text style={styles.actionText}>{item.text}</Text>
                                </View>
                            </RsTouchableNativeFeedback>
                        ))
                    }
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,.6)',
    },
    actionSheet: {
        backgroundColor: '#f9f9f9',
        width: Dimensions.get('window').width - 100
    },
    sheet: {
        flexDirection: 'row',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc',
        paddingVertical: 5,
        backgroundColor: '#fff',
        alignItems: 'center'
    },
    sheetClose: {
        padding: 10
    },
    sheetIcon: {
        fontSize: 26,
        color: '#444',
    },
    sheetInfo: {
        flex: 1,
        paddingLeft: 10,
        minHeight: 50,
        justifyContent: 'center'
    },
    sheetTitle: {
        paddingVertical: 10,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#444'
    },
    actionList: {
        padding: 15,
        backgroundColor: '#f9f9f9',
        flexDirection: 'row',
        flex: 1
    },
    actionCol: {
        flex: 1
    },
    action: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 40,
        padding: 10
    },
    actionIcon: {
        fontSize: 20,
        color: '#444'
    },
    actionText: {
        paddingLeft: 15,
        fontSize: 16,
        color: '#444'
    }
});

export default ActionSheet;