'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { WebView, View } from 'react-native';
import _ from 'lodash';


const script = `
<script>
    function setHeight(){
        window.scrollTo(0, 9999);
        document.title = window.innerHeight + window.scrollY + 20; 
        window.location.hash = Date.now();
    }
    setTimeout(setHeight, 500); 
    setTimeout(setHeight, 1500); 
</script>`;

class WebContainer extends React.Component {
    constructor() {
        super();
        this.state = { height: 60 };
    }

    onMessage = (event) => {
        this.setState({ height: event.nativeEvent.data });
    }

    onNavigationStateChange = (navState) => {
        this.setState({ height: Number(navState.title || '60') });
    }

    render() {
        let {
            html,
            style,
            autoHeight,
            scrollEnabled,
            ...props
        } = this.props;

        html = `
        <!doctype html>
        <html>
            <head>	
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0, max-scale=1">
                <style>
                    html, body{
                        font-family: Arial, Helvetica, sans-serif;
                        font-size: 1em;
                        color: #2d4150;
                    }
                    body{
                        padding: 10px; margin: 0
                    }
                </style>
            </head>
            <body>${autoHeight ? (html + script) : html}</body>
        </html>`;

        return (
            <View style={style}>
                <WebView
                    {...props}
                    style={[{ backgroundColor: 'transparent' }, autoHeight && { height: this.state.height }]}
                    scrollEnabled={autoHeight ? false : scrollEnabled}
                    source={{ html }}
                    scalesPageToFit={false}
                    onNavigationStateChange={this.onNavigationStateChange} />
            </View>
        );
    }
}

WebContainer.propTypes = {
    autoHeight: PropTypes.bool,
};

export default WebContainer;
