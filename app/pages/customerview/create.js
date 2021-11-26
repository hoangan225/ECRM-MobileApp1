import React from 'react';
// import Toast from 'react-native-simple-toast';
import * as actions from '../../actions/customview';
import { validateComponent } from '../../lib/validate';
import {
    StyleSheet, Modal, Text, Dimensions, TextInput, TouchableWithoutFeedback, TouchableOpacity
} from 'react-native';
import { Icon, View, Header, Body, Title, Left, Right, Button, Toast } from 'native-base';
import { connect } from '../../lib/connect';

class CreateForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            model: {
                name: 'Danh sách',
                applyFor: '',
                title: '',
                type: 3,
                order: 1,
                details: [
                    {
                        viewId: 0,
                        fieldName: '',
                        label: '',
                        order: 1,
                        isMeta: false
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
        this.setValue({ title: this.props.title || 'no title', applyFor: this.props.applyFor });
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps) { this.setValue({ title: this.props.title || 'no title', applyFor: nextProps.applyFor }); }
    }


    onCancel = () => {
        this.props.onCancel();
    }


    handleSubmit = () => {
        // console.log('this.state.model', this.state.model);

        this.setState({ loading: true });
        this.props.actions.createdetail(this.state.model)
            .then(data => {
                // console.log('dataview', data);

                this.state();
                this.onCancel();
                // Toast.show(__('Thêm mới thành công'));
                Toast.show({
                    text: 'Thêm mới thành công',
                    duration: 2500,
                    position: 'bottom',
                    textStyle: { textAlign: 'center' },

                });
                this.setState({ loading: false });
            })
            .catch(error => {
                this.setState({ loading: false });
                alert(error.error, error.message, 'error');
            });

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
                                            <Icon type="MaterialIcons" name='arrow-back' size={22} />
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
                                        onPress={this.handleSubmit}>
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

export default connect(CreateForm, state => ({
    customView: state.customview,
    viewType: state.app.enums.viewType,
}), ...actions);

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