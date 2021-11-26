import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, Image } from 'react-native';
import tvkd from 'tieng-viet-khong-dau';
import { connect } from '../../lib/connect';
import request from '../../lib/request';

const colors = ['#b00700', '#57e72e', '#ed4c56', '#877564', '#504559', '#d20cac', '#45095e',
    '#0e672f', '#b5b318', '#9e03b2'];

class Avatar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            noImage: false,
            loaded: false
        }
        const id = props.id || Math.round(Math.random() * colors.length);
        const colorIndex = id % colors.length;
        this.randomColor = colors[colorIndex];
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        this.setState({ noImage: false });
    }

    render() {
        const size = this.props.size || 50;
        const name = this.props.name || '';
        var url = this.props.url;

        let nameMatch = name.trim().match(/\S+$/);

        if (url) {
            url = request.url(url)
        }

        const NoImage = (
            <View style={[styles.avatarIcon, this.props.style, { borderRadius: size / 2, backgroundColor: this.randomColor, width: size, height: size }]}>
                <Text style={[styles.avatarIconText, { fontSize: size * 2 / 3.5 }]}>
                    {nameMatch && nameMatch[0] ? tvkd.cUpperCase(nameMatch[0][0]) : '?'}
                </Text>
                {
                    !this.setState.loaded && !!url && (
                        <Image
                            style={{ width: 1, height: 1 }}
                            source={{ uri: url }}
                            onError={() => this.setState({ noImage: true })}
                            onLoad={() => this.setState({ loaded: true })} />
                    )
                }
            </View>
        );

        if (!url || this.state.noImage || !this.state.loaded) {
            return NoImage;
        }

        return (
            <Image
                style={[styles.avatarImage, this.props.style, { width: size, height: size, borderRadius: size / 2 }]}
                source={{ uri: url }} />
        )
    }
}

Avatar.propTypes = {
    size: PropTypes.number,
    url: PropTypes.string,
    id: PropTypes.number,
    name: PropTypes.string,
    style: PropTypes.any
}
export default connect(Avatar, state => ({
    account: state.account,
}));



const styles = StyleSheet.create({
    avatarIcon: {
        position: 'relative',
        // opacity: 0.8,
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: StyleSheet.hairlineWidth,
        borderWidth: 2,
        borderColor: '#fff',
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    avatarImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        margin: 10,
        // borderWidth: StyleSheet.hairlineWidth,
        borderWidth: 2,
        borderColor: '#fff'
    },
    avatarIconText: {
        color: '#fff',
        fontSize: 30,
    },
})
