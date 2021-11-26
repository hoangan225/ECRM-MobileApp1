import React, { Component } from 'react';
import {
    StyleSheet, View, Text, TextInput, Modal
} from 'react-native';
import { Icon } from 'native-base';
import Toolbar from '../controls/toolbars';

class ProcessSearchBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            search: null,
            onlyCurrentTab: false,
            result: [],
        };
    }

    onRequestClose = () => {
        this.props.onRequestClose();
    }

    onTyping = (value) => {
        this.setState({ search: value });
    }

    search = () => {
        const { search } = this.state;
        this.props.searchProcess({ search })
        this.onRequestClose()
    }

    render() {
        if (!this.props.show) return null;
        return (
            <Modal
                supportedOrientations={['portrait', 'landscape']}
                onRequestClose={this.onRequestClose}
                animationType="fade"
                transparent={true}>
                <View style={styles.container}>
                    <View style={styles.box}>
                        <Toolbar
                            style={styles.toolbar}
                            icon={<Icon type='MaterialIcons' name='arrow-back' style={{ fontSize: 22 }} />}
                            iconColor='#000'
                            onIconPress={this.onRequestClose}
                            title={
                                <TextInput
                                    autoFocus={true}
                                    autoCapitalize='none'
                                    placeholder={this.props.searchPlaceholder || 'Tìm kiếm..'}
                                    multiline={false}
                                    underlineColorAndroid='transparent'
                                    onChangeText={this.onTyping}
                                    returnKeyType='search'
                                    onSubmitEditing={this.search}
                                    value={this.state.search}
                                    style={styles.searchInput} />
                            }
                            actions={[
                                {
                                    icon: <Icon type='MaterialIcons' name="search" style={{ fontSize: 22 }} />,
                                    onPress: this.search
                                }
                            ]}
                        ></Toolbar>
                    </View>
                </View>
            </Modal>
        );
    }
}

export default ProcessSearchBox;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    box: {
        flex: 1,
        // backgroundColor: '#fff',
        borderRadius: 4
    },
    toolbar: {
        elevation: 1,
        shadowOpacity: 0,
        shadowRadius: 0,
        backgroundColor: '#fff',
        borderRadius: 4
    },
    searchInput: {
        fontSize: 16,
        marginLeft: 10,
        height: 35,
        paddingTop: 3,
        paddingBottom: 0
    },
    options: {
        backgroundColor: '#f9f9f9',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc',
        paddingHorizontal: 10,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    optionLable: {
        flex: 1,
        fontSize: 15
    },
    footer: {
        padding: 20,
        alignItems: 'center'
    },
    textNotResult: {
        justifyContent: 'center',
        alignItems: 'center'
    }
})