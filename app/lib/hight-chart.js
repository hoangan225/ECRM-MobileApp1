import React, { Component } from 'react';
import {
    StyleSheet,
    Dimensions
} from 'react-native';
import { WebView } from 'react-native-webview';

const win = Dimensions.get('window');
class ChartWeb extends Component {
    constructor(props) {
        super(props);

        const { stock, more, guage, funnel, options } = props;

        this.state = {
            html: `
                <!DOCTYPE html>
                <html>
                <head>    
                    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0" />
                    <style media="screen" type="text/css">
                    #container {
                        width:100%;
                        height:100%;
                        position: absolute;
                        top: 0; left: 0; right: 0; bottom: 0;
                        user-select: none;
                        -webkit-user-select: none;
                    }
                    </style>
                    
                    <script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
                    ${stock ? '<script src="https://code.highcharts.com/stock/highstock.js"></script>' : ''}
                    ${!stock ? '<script src="https://code.highcharts.com/highcharts.js"></script>' : ''}
                    ${more ? '<script src="https://code.highcharts.com/highcharts-more.js"></script>' : ''}
                    ${guage ? '<script src="https://code.highcharts.com/modules/solid-gauge.js"></script>' : ''}
                    ${funnel ? '<script src="https://code.highcharts.com/modules/funnel.js"></script>' : ''}
                    <script src="https://code.highcharts.com/modules/exporting.js"></script>
                </head>
                <body>
                    <div id="container"></div>
                    <script>
                    $(function () {
                        try{
                            var options = #options#;
                            if(options) Highcharts.setOptions(options);
                            Highcharts.${stock ? 'stockChart' : 'chart'}('container', #config#);
                        }
                        catch(e){
                           // document.querySelector('#container').innerHTML='Lỗi ' + e;
                        }
                    });
                    </script>
                </body>
            </html>`
        }
    }

    render() {
        const { config, options, style, ...props } = this.props;

        let configStr = JSON.stringify(config, function (key, value) {
            return (typeof value === 'function') ? value.toString() : value;
        });
        let optionsStr = JSON.stringify(options);

        configStr = JSON.parse(configStr);

        configStr = flattenObject(configStr);

        let concatHTML = this.state.html.replace('#options#', optionsStr).replace('#config#', configStr);

        return (
            <WebView
                style={[styles.full]}
                source={{ html: concatHTML, baseUrl: '' }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                scalesPageToFit={true}
                scrollEnabled={false}
                automaticallyAdjustContentInsets={true}
            />
        );
    };
};

var flattenObject = function (obj, str = '{') {
    Object.keys(obj).forEach(function (key) {
        str += `${key}: ${flattenText(obj[key])}, `
    })
    return `${str.slice(0, str.length - 2)}}`
};

var flattenText = function (item, key) {
    if (key == "y") // console.log(item, typeof item);
        var str = ''
    if (item && typeof item === 'object' && item.length == undefined) {
        str += flattenObject(item)
    } else if (item && typeof item === 'object' && item.length !== undefined) {
        str += '['
        item.forEach(function (k2) {
            str += `${flattenText(k2)}, `
        })
        if (item.length > 0) str = str.slice(0, str.length - 2)
        str += ']'
    } else if (typeof item === 'string' && item.slice(0, 8) === 'function') {
        str += `${item}`
    } else if (typeof item === 'string') {
        str += `\"${item.replace(/"/g, '\\"')}\"`
    } else {
        str += `${item}`
    }
    return str
};

var styles = StyleSheet.create({
    full: {
        backgroundColor: 'transparent',
        height: 400
    }
});

module.exports = ChartWeb;