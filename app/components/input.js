import React, { Component } from 'react';
import {  StyleSheet} from 'react-native';
import {Item, Input} from 'native-base';
class EcrmInput extends Component {
    state = {
        isFocused: false,
    };

    handleFocus = () => this.setState({ isFocused: true });
    handleBlur = () => this.setState({ isFocused: false });

    render() {
        const { label, ...props } = this.props;
        const { isFocused } = this.state;
        const labelStyle = {
            marginBottom: 0,
            paddingLeft: 0,
            borderBottomColor: '#28a745',
            borderBottomWidth: !isFocused ? 1 : 2,
        };

        return (
            <Item last style={[styles.item, labelStyle]}>
                <Input
                    style={styles.input}
                    {...props}
                    autoCapitalize = 'none'
                    onBlur={() => this.handleBlur()}
                    onFocus={() => this.handleFocus()}
                    blurOnSubmit
                />
            </Item>
        );
    }
}
const styles = StyleSheet.create({
    input: {
        fontSize: 15,
        height: 50,
        paddingTop: 25
    }
})
export default EcrmInput;