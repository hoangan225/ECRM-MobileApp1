import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Menu from '../controls/action-menu';
import RsTouchableNativeFeedback from './touchable-native-feedback';

import {
    Animated,
    StyleSheet,
    View,
    Text,
    Platform,
    Dimensions
} from 'react-native';

class Toolbar extends Component {
    render() {
        let noShadowStyle = !!this.props.noShadow && {
            zIndex: null,
            elevation: 0,
            shadowOpacity: 0,
            shadowRadius: 0,
        };
        let noPaddingStyle = !!this.props.noPadding && {
            paddingTop: 0,
            paddingLeft: 0,
            paddingRight: 0,
            paddingBottom: 0
        };

        return (
            <View style={[styles.toolbar, this.props.style, noShadowStyle, noPaddingStyle]}>
                <View style={styles.toolbarContent}>
                    {this.props.icon && (
                        <RsTouchableNativeFeedback
                            onPress={this.props.onIconPress}
                            rippleBorderless={true}>
                            <View style={styles.icon}>
                                {React.cloneElement(this.props.icon, { color: this.props.iconColor })}
                            </View>
                        </RsTouchableNativeFeedback>
                    )}
                    {!!this.props.title && (
                        <View style={styles.title}>
                            {this.props.title}
                        </View>
                    )}
                    {this.props.titleText && !this.props.title && (
                        <View style={styles.title}>
                            <Text style={[styles.titleText, { color: this.props.titleColor }]}
                                numberOfLines={1} ellipsizeMode="tail">
                                {this.props.titleText}
                            </Text>
                        </View>
                    )}
                    {this.props.actions && (
                        <View style={styles.actionsContainer}>
                            {this.props.actions.map((action, actionIndex) => {
                                if (action && action.visibled !== false) {
                                    let icon =
                                        <View style={styles.actionIcon}>
                                            {React.cloneElement(action.icon, { color: this.props.actionIconColor || this.props.iconColor })}
                                        </View>;
                                    if (action.menuItem) {
                                        return (
                                            <RsTouchableNativeFeedback key={actionIndex} onPress={this.props.onPressMore}>
                                                <View>
                                                    {action.menuItem.icon}
                                                    {/*
                                                        <Icon type='MaterialIcons' name='more-vert' style={[styles.actionIcon, { color: '#fff', fontSize: 22 }]} />
                                                        */}
                                                </View>
                                            </RsTouchableNativeFeedback>
                                        )
                                    }
                                    if (action.menuItems) {
                                        return (
                                            <Menu trigger={icon} triggerRippleBorderless={true} key={actionIndex}>
                                                {action.menuItems.map((item, index) => (
                                                    <Menu.MenuItem {...item} key={index} />
                                                ))}
                                            </Menu>
                                        )
                                    }
                                    else {
                                        return (
                                            <RsTouchableNativeFeedback
                                                key={actionIndex}
                                                onPress={action.onPress}
                                                // onLongPress={action.onLongPress}
                                                disabled={action.disabled}
                                                rippleBorderless={true}>
                                                {icon}
                                            </RsTouchableNativeFeedback>
                                        );
                                    }
                                }
                                else {
                                    return null;
                                }
                            })}
                        </View>
                    )}
                </View>
            </View>
        )

    }
}

Toolbar.propTypes = {
    style: PropTypes.any,
    titleText: PropTypes.string,
    titleColor: PropTypes.string,
    icon: PropTypes.element,
    iconColor: PropTypes.string,
    onIconPress: PropTypes.func,
    title: PropTypes.element,
    actions: PropTypes.array,
    actionIconColor: PropTypes.string,
    rippleColor: PropTypes.string,
    noShadow: PropTypes.bool,
    noPadding: PropTypes.bool
}

Toolbar.defaultProps = {
    titleText: 'Title Text',
    titleColor: '#fff',
    icon: <Icon type="MaterialIcons" name='arrow-back' size={22} />,
    iconColor: '#fff'
}

export default Toolbar;

const styles = StyleSheet.create({
    toolbar: {
        minHeight: 48,
        backgroundColor: '#ffb400',
        elevation: 2,
        shadowColor: 'black',
        shadowOpacity: 0.3,
        shadowRadius: 1.5,
        shadowOffset: {
            height: 1,
            width: 0
        },
        justifyContent: 'center',
        ...Platform.select({
            ios: {
                paddingTop: 25,
                zIndex: 1
            }
        })
    },
    toolbarContent: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 5
    },
    title: {
        flex: 1,
        justifyContent: 'center'
    },
    titleText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff'
    },
    icon: {
        marginHorizontal: 10,
        padding: 5,
        justifyContent: 'center'
    },
    actionIcon: {
        padding: 5,
    }
});