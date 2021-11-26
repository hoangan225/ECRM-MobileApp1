import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Platform, View, TouchableNativeFeedback, TouchableOpacity } from 'react-native';

class RsTouchableNativeFeedback extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (Platform.OS == 'android') {

            if (Platform['Version'] >= 21) {
                background = TouchableNativeFeedback.Ripple(this.props.rippleColor, this.props.rippleBorderless);
            } else {
                background = TouchableNativeFeedback.SelectableBackground();
            }

            return (
                <TouchableNativeFeedback background={background} {...this.props}>
                    {this.props.children}
                </TouchableNativeFeedback>
            )
        }
        return (
            <TouchableOpacity {...this.props}>
                {this.props.children}
            </TouchableOpacity>
        )
    }
}

RsTouchableNativeFeedback.propTypes = {
    ...TouchableNativeFeedback.propTypes,
    rippleColor: PropTypes.string,
    rippleBorderless: PropTypes.bool
}

export default RsTouchableNativeFeedback;