import moment from 'moment';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ColorPicker, fromHsv, TriangleColorPicker } from 'react-native-color-picker'
import { StyleSheet, View, Modal, Text, TouchableOpacity } from 'react-native';
import Toolbar from './toolbars';
import { Icon } from 'native-base';

class ColorPickerModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            color: props.color
        }

        this.quickColors = [
            ['#f44336', '#9c27b0', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50'],
            ['#8bc34a', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#795548', '#000000', '#ffffff']
        ]
    }

    UNSAFE_componentWillReceiveProps(props) {
        this.setState({
            color: props.color
        })
    }

    onColorChange = (color) => {
        this.setState({ color: fromHsv(color) });
        if (this.props.onColorChange) {
            this.props.onColorChange(color);
        }
    }

    onRequestClose = () => {
        this.props.onRequestClose();
    }

    onColorSelected = () => {
        if (this.props.onColorSelected) {
            this.props.onColorSelected(this.state.color);
        }
    }

    quickset = (color) => {
        if (this.props.onColorSelected) {
            this.props.onColorSelected(color);
        }
    }

    render() {
        const { visible, onRequestClose, ...props } = this.props;
        const actions = [
            {
                icon: <Icon type='MaterialIcons' name="check" style={{ fontSize: 22 }} />,
                onPress: this.onColorSelected
            }
        ];

        this.quickColors = [
            ['#9c27b0', '#3f51b5', '#8896f3', '#03a9f4', '#00bcd4', '#009688', '#8bc34a', '#4caf50'],
            ['#ffeb3b', '#ffc107', '#ff9800', '#ff5755', '#ff0000', '#795548', '#000000', '#ffffff']
        ]

        return (
            <Modal
                supportedOrientations={['portrait', 'landscape']}
                visible={this.props.visible}
                animationType='fade'
                onRequestClose={this.onRequestClose}>
                <View style={styles.container}>
                    <Toolbar titleText='Chọn màu' onIconPress={this.onRequestClose} actions={actions} />
                    <TriangleColorPicker
                        {...props}
                        color={this.state.color}
                        onColorChange={this.onColorChange}
                        style={styles.picker}
                    />
                    <View style={styles.quickChoose}>
                        {
                            this.quickColors.map((row, index) => (
                                <View style={styles.quickRow} key={index}>
                                    {
                                        row.map(color => (
                                            <TouchableOpacity key={color} onPress={() => this.quickset(color)} style={[styles.quickColor, { backgroundColor: color }]} />
                                        ))
                                    }
                                </View>
                            ))
                        }
                    </View>
                </View>
            </Modal>
        )
    }
}

ColorPickerModal.propTypes = {
    ...ColorPicker.propsTypes,
    visible: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    defaultColor: PropTypes.string
}

export default ColorPickerModal


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEEEEE'
    },
    picker: {
        flex: 1,
        padding: 20
    },
    quickChoose: {
        padding: 15,
        paddingTop: 0
    },
    quickRow: {
        flexWrap: 'wrap',
        flexDirection: 'row',
    },
    quickColor: {
        flex: 1,
        height: 30,
        margin: 5
    }
})
