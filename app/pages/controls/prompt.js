import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet, View, Modal, Text, Dimensions, TextInput, TouchableWithoutFeedback, TouchableOpacity
} from 'react-native';
import { Icon } from 'native-base';
import Toolbar from './toolbars';

class Prompt extends Component {
    constructor(props) {
        super(props);
        this.initState();

    }

    initState = () => {
        var view = {};
        // // console.log('this.props.customerView', this.props.customerView);
        // // console.log('this.props.customerView', this.props.viewId);
        if (this.props && this.props.viewId && this.props.customerView) {
            var list = this.props.customerView.filter(t => t.id == this.props.viewId);
            // // console.log('list', list);
            if (list) {
                view = list[0];
            }
        }

        this.state = {
            model: {
                // id: view.id || null,
                title: 'no title',
                name: view.name || this.props.defaultValue,
                applyFor: view.applyFor || '',
                type: view.type || 3,
                order: view.order || 1,
                details: view.details || [{
                    viewId: 0,
                    fieldName: '',
                    label: '',
                    order: 1,
                    isMeta: false
                }],
                filter: [],
                sorts: []
            },
            onOpen: false,
            loading: false
        }
    }

    setValue = data => {
        if (this.props.viewId) {
            this.setState({
                model: { ...this.state.model, ...data, id: this.props.viewId }
            });
        } else {
            this.setState({
                model: { ...this.state.model, ...data }
            })
        }

    }

    componentDidMount() {
        this.setValue({ title: this.props.title || 'no title', applyFor: this.props.applyFor });
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps) { this.setValue({ title: this.props.title || 'no title', applyFor: nextProps.applyFor }); }
    }


    onCancel = () => {
        this.props.onCancel();
        this.props.onRequestClose();
    }

    onSubmit = () => {
        this.props.onSubmit(this.state.model);
    }

    render() {
        // // console.log('view prompt', this.props.viewId);
        // // console.log('customew', this.props.customerView);
        return (
            <Modal
                supportedOrientations={['portrait', 'landscape']}
                visible={this.props.show}
                onRequestClose={this.onCancel}
                transparent={true}
                animationType='fade'>
                <TouchableWithoutFeedback onPress={this.onCancel}>
                    <View style={styles.container}>
                        <TouchableWithoutFeedback>
                            <View style={styles.actionSheet}>
                                <Toolbar
                                    style={styles.toolbar}
                                    noShadow noPadding
                                    icon={<Icon type='MaterialIcons' name='arrow-back' style={{ fontSize: 22, color: '#fff' }} />}
                                    iconColor='#fff'
                                    onIconPress={this.onCancel}
                                    titleText={this.props.title}
                                    titleColor='#fff'
                                ></Toolbar>
                                <View style={styles.sheet}>
                                    <TextInput
                                        autoFocus={true}
                                        underlineColorAndroid='transparent'
                                        style={styles.input}
                                        placeholder={this.props.placeholder}
                                        value={this.state.model.name}
                                        // onChangeText={text => this.setValue({ name: text, id: this.props.viewId ? this.props.viewId : null })} 
                                        onChangeText={text => this.setValue({ name: text })}
                                    />
                                </View>
                                <View style={styles.footer}>
                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={this.onCancel}>
                                        <Text style={styles.buttonText}>{this.props.cancelText || 'Cancel'}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={this.onSubmit}>
                                        <Text style={styles.buttonText}>{this.props.okText || 'OK'}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }
}

Prompt.propTypes = {
    title: PropTypes.string,
    placeholder: PropTypes.string,
    cancelText: PropTypes.string,
    okText: PropTypes.string,
    defaultValue: PropTypes.string,
    show: PropTypes.bool,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
}

export default Prompt;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,.4)',
    },
    toolbar: {
        backgroundColor: 'green',
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
    },
    actionSheet: {
        width: Dimensions.get('window').width - 20,
        maxWidth: 300,
        borderRadius: 4,
        backgroundColor: '#fff'
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#ccc'
    },
    input: {
        padding: 10,
        fontSize: 16,
        height: 44
    },
    button: {
        flex: 1,
        alignItems: 'center'
    },
    buttonText: {
        color: '#222',
        fontSize: 16
    }
});