import React, { Component } from 'react';
import { Dimensions, TextInput, StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
    textbox: {
        paddingVertical: 5,
        ...Platform.select({
            ios: {
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: '#ccc',
                height: 35,
                padding: 4
            }
        })
    }
})

class Textbox extends Component {
    render() {
        const { style, password, ...props } = this.props;

        return (
            <TextInput secureTextEntry={password} {...props} style={[styles.textbox, style]} ref={input => { this.input = input }} />
        )
    }

    focus() {
        this.input && this.input.focus();
    }

    blur() {
        this.input && this.input.blur();
    }

    isFocused() {
        return this.input && this.input.isFocused();
    }

    clear() {
        this.input && this.input.clear();
    }
}

Textbox.defaultProps = {
    underlineColorAndroid: '#ffb400'
}

export default Textbox;
