import React, { Component } from 'react';
import { connect } from '../../lib/connect';
import { setPhone } from '../../actions/voip/call';
import * as Linking from 'expo-linking'
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from 'native-base';

class ButtonCall extends Component {
    call = () => {
        this.props.actions.setPhone(this.props.phone);

        Linking.openURL('stringeeapp://strtoken/?action=call&phone=' + this.props.phone + '&token=' + this.props.account.token + '&host=' + this.props.account.host + '&branch=' + this.props.branch.currentId)
            .then(() => {
                // console.log('success')
            })
            .catch(err => console.error('An error occurred', err));
    }
    openLink = (link) => {
        Linking.canOpenURL(link).then(supported => {
            if (!supported) {
                // console.log('not link', link);
            } else {
                return Linking.openURL(link);
            }
        }).catch(err => console.error('An error occurred', err));
    }
    render() {
        const { phone } = this.props;
        if (!this.props.voip.token.accessToken && phone) {
            return (
                <TouchableOpacity onPress={() => this.openLink("tel:" + phone)}>
                    <Text style={[styles.value, !!this.props.style && this.props.style]}>{phone}</Text>
                </TouchableOpacity>
            )
        }
        if (!phone || !this.props.voip.token.accessToken) {
            return null;
        }
        return (
            <TouchableOpacity
                onPress={this.call}
                style={styles.btnCall}
            >
                <Text style={[styles.value, !!this.props.style && this.props.style]}>{phone}</Text>
            </TouchableOpacity>
        );
    }
}

ButtonCall.propTypes = {
    phone: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
}

export default connect(ButtonCall, state => ({
    voip: state.voip,
    account: state.account,
    app: state.app,
    branch: state.branch,
}), { setPhone });

const styles = StyleSheet.create({
    btnCall: {
        alignItems: 'center',
        // backgroundColor: 'blue',
        // padding: 15,
        // borderRadius: 4
    },
    value: {
        fontSize: 15,
        color: 'rgb(9, 139, 156)',
    },
})