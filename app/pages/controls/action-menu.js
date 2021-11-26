import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    BackHandler, StyleSheet, View, TouchableWithoutFeedback,
    Text, Modal, Dimensions, Animated, StatusBar, ScrollView, Platform
} from 'react-native';
import RsTouchableNativeFeedback from './touchable-native-feedback';

class MenuContext extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            menuItems: null,
            menuX: 0,
            menuY: 0,
            menuWidth: 0,
            menuHeight: 0,
            maxHeight: 0,
            overlayColor: 'transparent'
        }
    }

    componentDidUpdate() {
        if (this.state.show) {
            Animated.timing(this.state.menuHeight, {
                toValue: this.state.maxHeight,
                duration: 200,
                useNativeDriver: true
            }).start();
        }
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.hardwareBackPress);
    }

    componentDidUnMount() {
        BackHandler.removeEventListener('hardwareBackPress', this.hardwareBackPress);
    }

    hardwareBackPress = () => {
        if (this.state.show) {
            this.showMenu(false);
            return true;
        }
        return false;
    }

    showMenu = (menuItems, x, y, width, height, overlayColor) => {
        if (menuItems) {
            this.setState({
                show: true,
                menuItems: menuItems,
                menuX: x,
                menuY: y,
                menuWidth: width,
                menuHeight: new Animated.Value(0),
                maxHeight: height,
                overlayColor
            });
        }
        else {
            this.setState({
                show: false,
                menuItems: null,
            });
        }
    }

    getChildContext() {
        return {
            show: this.state.show,
            showMenu: this.showMenu
        }
    }

    isOpen = () => {
        return !!this.state.show;
    }

    closeMenu = () => {
        this.showMenu(false);
    }

    render() {
        const menuStyle = {
            width: this.state.menuWidth,
            height: this.state.menuHeight,
            top: this.state.menuY,
            left: this.state.menuX
        }
        const show = this.state.show && this.state.menuItems != null;
        return (
            <View style={this.props.style}>
                {this.props.children}
                {
                    show && (
                        <View style={styles.menuContext}>
                            <TouchableWithoutFeedback onPress={this.closeMenu}>
                                <View style={[styles.menuBackdrop, { backgroundColor: this.state.overlayColor }]}>
                                    <TouchableWithoutFeedback>
                                        <Animated.View style={[styles.menuContainer, menuStyle]}>
                                            <ScrollView showsVerticalScrollIndicator={false}>
                                                <View style={styles.menuItems}>
                                                    {this.state.menuItems}
                                                </View>
                                            </ScrollView>
                                        </Animated.View>
                                    </TouchableWithoutFeedback>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    )
                }
            </View>
        )
    }
}

MenuContext.childContextTypes = {
    showMenu: PropTypes.func,
    show: PropTypes.bool
}

class MenuModalContext extends Component {
    constructor(props) {
        super(props);
    }

    onRequestClose = () => {
        if (this.menuContext.isOpen()) {
            this.menuContext.closeMenu();
        }
        else {
            this.props.onRequestClose();
        }
    }

    render() {
        return (
            <Modal {...this.props}
                supportedOrientations={['portrait', 'landscape']}
                onRequestClose={this.onRequestClose}>
                <MenuContext style={{ flex: 1 }} ref={ref => { this.menuContext = ref }}>
                    {this.props.children}
                </MenuContext>
            </Modal>
        )
    }
}

MenuModalContext.propTypes = {
    ...Modal.propTypes
}


class Menu extends Component {
    constructor(props) {
        super(props);
    }

    toggleMenu = (event) => {

        if (this.context.showMenu) {
            if (this.context.show) {
                this.context.showMenu(false);
            }
            else {
                const padding = 10;
                const { width, height } = Dimensions.get('window');
                var contentHeight = 0;

                React.Children.forEach(this.props.children, (item, index) => {
                    if (item.type == MenuItem) {
                        if (item.props.divider) {
                            contentHeight += 1;
                        }
                        else {
                            contentHeight += 40;
                        }
                    }
                })

                var menuY = event.nativeEvent.pageY - event.nativeEvent.locationY + (this.props.offsetTop || 0);
                var menuWidth = Math.min(this.props.menuWidth || 250, width - padding * 2);
                var menuX = width - menuWidth - padding + (this.props.offsetLeft || 0);
                var menuHeight = Math.min(height - 100, contentHeight);

                while (menuY + menuHeight > height - 40) {
                    menuY -= 2;
                }

                this.context.showMenu(
                    this.props.children,
                    menuX,
                    menuY,
                    menuWidth,
                    menuHeight,
                    this.props.overlayColor
                );
            }
        }
        else {
            // alert('No menu context found')
        }
    }

    render() {

        return (
            <View style={this.props.style} ref="menu">
                <RsTouchableNativeFeedback
                    onPress={this.props.showOnLongPress ? null : this.toggleMenu}
                    onLongPress={this.props.showOnLongPress ? this.toggleMenu : null}
                    rippleBorderless={this.props.triggerRippleBorderless}>
                    {this.props.trigger}
                </RsTouchableNativeFeedback>
            </View>
        )
    }
}

Menu.contextTypes = {
    showMenu: PropTypes.func,
    show: PropTypes.bool
}


Menu.propTypes = {
    trigger: PropTypes.element,
    triggerRippleBorderless: PropTypes.bool,
    menuWidth: PropTypes.number,
    offsetTop: PropTypes.number,
    offsetLeft: PropTypes.number,
    rippleColor: PropTypes.string,
    showOnLongPress: PropTypes.bool,
    overlayColor: PropTypes.string,
    children: function (props, propName, componentName) {
        const prop = props[propName]

        let error = null
        React.Children.forEach(prop, function (child) {
            if (child.type !== MenuItem) {
                error = new Error('`' + componentName + '` children should be of type `MenuItem`.');
            }
        })
        return error
    }
}

class MenuItem extends Component {
    constructor(props) {
        super(props);
    }

    onPress = (e) => {
        if (this.props.onPress) {
            this.props.onPress(e);
        }
        if (this.context.showMenu) {
            this.context.showMenu(false);
        }
    }

    render() {
        if (this.props.divider) {
            return (
                <View style={styles.menuItemDivider} />
            )
        }
        else {
            return (
                <RsTouchableNativeFeedback onPress={this.onPress} disabled={this.props.disabled}>
                    <View style={[styles.menuItem, this.props.style, this.props.disabled ? styles.menuItemDisabled : null]}>
                        <View style={styles.menuItemIcon}>
                            {this.props.icon}
                        </View>
                        <Text style={styles.menuItemText}>
                            {this.props.text}
                        </Text>
                    </View>
                </RsTouchableNativeFeedback>
            )
        }
    }
}

MenuItem.propTypes = {
    icon: PropTypes.element,
    action: PropTypes.func,
    text: PropTypes.string,
    rippleColor: PropTypes.string,
    divider: PropTypes.bool,
    disabled: PropTypes.bool
}

MenuItem.contextTypes = {
    showMenu: PropTypes.func,
    show: PropTypes.bool
}

Menu.MenuItem = MenuItem;
Menu.MenuContext = MenuContext;
Menu.MenuModalContext = MenuModalContext;

export {
    Menu as default,
    MenuContext,
    MenuModalContext,
    MenuItem
}

const styles = StyleSheet.create({
    menuContext: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        //zIndex: 1000,
        elevation: 5,
        //backgroundColor: 'blue'
    },
    menuBackdrop: {
        flex: 1,
        // backgroundColor: 'red'
    },
    menuContainer: {
        //zIndex: 1000,
        position: 'absolute',
        borderRadius: 4,
        backgroundColor: '#fff',
        elevation: 2,
        shadowColor: 'black',
        shadowOpacity: 0.1,
        shadowRadius: StyleSheet.hairlineWidth * 3,
        shadowOffset: {
            height: StyleSheet.hairlineWidth * 3,
        },
    },
    menuItems: {

    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        height: 40
    },
    menuItemIcon: {
        marginRight: 10,
        width: 20
    },
    menuItemText: {
        flex: 1,
        fontSize: 15,
        fontWeight: '400',
        color: '#111',
    },
    menuItemDisabled: {
        opacity: .4
    },
    menuItemDivider: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#eee',
    }
})