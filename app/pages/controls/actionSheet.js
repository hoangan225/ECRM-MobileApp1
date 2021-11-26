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

class ActionSheet extends Component {
    constructor(props) {
        super(props);
        this.actionSheetHeight = new Animated.Value(0);
    }

    // componentWillUpdate() {
    //     this.actionSheetHeight = new Animated.Value(0);
    // }

    componentDidUpdate() {
        this.actionSheetHeight = new Animated.Value(0);
        const height = 40 * this.props.items.length + 40 + (this.props.title ? 50 : 0);
        Animated.timing(this.actionSheetHeight,
            {
                toValue: Math.min(height || windowHeight / 2, windowHeight),
                duration: 300,
                useNativeDriver: false
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
                            <Animated.View style={[styles.actionSheet, { height: this.actionSheetHeight }]}>
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
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,.6)',
    },
    actionSheet: {
        backgroundColor: '#f9f9f9',
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