import React, { Component } from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
class QuickStats extends Component {
    render() {
        const { background, title, subTitle, icon, className, iconSize, loading, ...atts } = this.props;

        return (
            <View {...atts}>
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 22 }}>
                    {!loading && title}
                </Text>
                <Text style={{ color: '#fff' }}>{subTitle}</Text>
            </View>
        );
    }
}

export default QuickStats;

QuickStats.defaultProps = {
    background: "red",
    iconSize: 48,
    loading: false,
}

QuickStats.propTypes = {
    background: PropTypes.oneOf(["red", "pink", "purple", "deep-purple", "indigo", "blue", "light-blue", "cyan", "teal", "green", "light-green", "lime", "yellow", "amber", "orange", "deep-orange", "brown", "grey", "blue-grey", "black"]).isRequired,
    icon: PropTypes.string.isRequired,
    iconSize: PropTypes.number.isRequired,
    title: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.number]).isRequired,
    subTitle: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.number]),
    loading: PropTypes.bool
}