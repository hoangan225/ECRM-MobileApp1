import React from 'react';
import * as actions from '../../actions/customview';
import { validateComponent } from '../../lib/validate';
import {
    StyleSheet, Modal, Text, Dimensions, TextInput, TouchableWithoutFeedback, TouchableOpacity
} from 'react-native';
import { Icon, View, Header, Body, Title, Left, Right, Button } from 'native-base';
import { connect } from '../../lib/connect';

class EditForm extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.initState();
    }

    initState = () => {
        this.state = {
            model: {
                name: 'Danh sách',
                applyFor: '',
                title: '',
                type: 3,
                order: 1,
                // userId: this.context.user.id,
                details: [
                    {
                        viewId: 0,
                        fieldName: '',
                        label: '',
                        order: 1,
                        isMeta: true
                    }
                ],
            },
            onOpen: false,
            loading: false
        }
    }

    setValue = data => {
        this.setState({
            model: { ...this.state.model, ...data }
        });
    }

    componentDidMount() {
        this.setValue({ title: this.props.title || 'no title', applyFor: this.props.applyFor, viewId: this.props.promptViewId });
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps) { this.setValue({ title: this.props.title || 'no title', applyFor: nextProps.applyFor, viewId: this.props.promptViewId }); }
    }


    onCancel = () => {
        this.props.onCancel();
    }

    onSubmit = () => {
        this.handleSubmit();
    }


    checkDetails(model) {

        if ((!model.details) || model.details.length <= 0) {
            alert(__('Chưa có cột nào được chọn trên view này'), 'danger')
            return false;
        }
        return true;
    }
    handleSubmit = () => {
        let ok = validateComponent(this)
        if (ok) {
            this.setState({ loading: true });
            this.props.actions.updateDetail(this.state.model)
                .then(data => {
                    this.initState();
                    this.onCancel();
                    // alert(__('Thêm mới thành công'));
                    this.setState({ loading: false });
                })
                .catch(error => {
                    this.setState({ loading: false });
                    alert(error.error, error.message, 'error');
                });
        }
    }



    render() {
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
                                <Header>
                                    <Left>
                                        <Button transparent onPress={this.onCancel}>
                                            <Icon type='MaterialIcons' name='arrow-back' size={22} />
                                        </Button>
                                    </Left>
                                    <Body>
                                        <Title>
                                            {this.props.title}
                                        </Title>

                                    </Body>
                                </Header>

                                <View style={styles.sheet}>
                                    <TextInput
                                        autoFocus={true}
                                        underlineColorAndroid='transparent'
                                        style={styles.input}
                                        placeholder={this.props.placeholder}
                                        value={this.state.model.name}
                                        onChangeText={text => this.setValue({ name: text })} />
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

export default connect(EditForm, state => ({
    customView: state.customview,
    viewType: state.app.enums.viewType,
}), actions);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,.4)',
    },
    toolbar: {
        backgroundColor: '#fff',
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