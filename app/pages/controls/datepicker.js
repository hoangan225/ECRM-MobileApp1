import moment from 'moment';
import React, { Component } from 'react';
import { Text, Platform } from 'react-native';
import Modal from 'react-native-modal';

import DatePicker from "@react-native-community/datetimepicker";
const ios = Platform.OS == 'ios';

class SmartDatePicker extends Component {
    state = {
        open: false
    }

    getFormat = () => {
        if (this.props.mode == 'time') {
            return "HH:mm"
        }
        else if (this.props.mode == 'datetime') {
            return "DD/MM/YYYY HH:mm"
        }
        else {
            return "DD/MM/YYYY";
        }
    }

    getDisplayString = () => {
        if (this.props.date) {
            return moment(this.props.date).format(this.getFormat());
        }
        return null;
    }

    getStringValue = (date) => {
        if (this.props.mode == 'time') {
            return date;
        }
        else {
            return moment(date).toISOString();
        }
    }

    getDate = () => {
        if (this.props.date) {
            return moment(this.props.date).toDate();
        }
        else if (this.props.defaultDate) {
            return moment(this.props.defaultDate).toDate();
        }
        return new Date();
    }

    setDate = (event, date) => {
        this.setState({ open: false })
        if (date) {
            if (this.props.onDateChange) {
                this.props.onDateChange(date);
            }
        }
    }

    open = () => {
        this.setState({ open: true })
    }

    close = () => {
        this.setState({ open: false })
    }

    render() {
        return (
            <React.Fragment>
                <Text
                    style={{ textAlignVertical: 'center', padding: 5, ...this.props.style }}
                    onPress={this.open}
                >
                    {this.props.date ? this.getDisplayString() : <Text style={{ color: '#888' }}>{this.props.placeholder}</Text>}
                </Text>
                {
                    this.state.open && (
                        ios ?
                            <Modal
                                isVisible={true}
                                onBackdropPress={this.close}
                                onBackButtonPress={this.close}
                                backdropColor={'#fff'}
                                backdropOpacity={1}
                                animationIn={'zoomIn'}
                                animationOut={'zoomOut'}
                                animationInTiming={200}
                                animationOutTiming={200}
                                backdropTransitionInTiming={500}
                                backdropTransitionOutTiming={500}
                            >
                                <DatePicker
                                    value={this.getDate()}
                                    mode={this.props.mode || 'date'}
                                    is24Hour={true}
                                    display="spinner"
                                    onChange={this.setDate}
                                    style={{ flex: 1 }}
                                />
                            </Modal> :
                            <DatePicker
                                value={this.getDate()}
                                mode={this.props.mode || 'date'}
                                is24Hour={true}
                                display="default"
                                onChange={this.setDate}
                                style={{ flex: 1 }}
                            />
                    )

                }
            </React.Fragment>
        )
    }
}

export default SmartDatePicker