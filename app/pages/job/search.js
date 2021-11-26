import React, { Component } from 'react';
import {
    StyleSheet, View, Text, TextInput, Modal, TouchableOpacity
} from 'react-native';
import { Icon, Input, InputGroup, Button } from 'native-base';
import { connect } from '../../lib/connect';
import * as actions from '../../actions/job';

class SearchBox extends Component {
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
        if (this.state.search) {
            this.setState({
                search: null,
            });
            this.props.actions.getList({ search: null }).then(() => {
                this.props.onRequestClose();
            }).catch(() => {
                this.props.onRequestClose();
            })
        } else {
            this.props.onRequestClose();
        }

    }

    onTyping = (value) => {
        var filter = { search: value };
        this.setState({ search: value });
        this.props.actions.getList(filter);
    }

    search = () => {
        const { search } = this.state;
        this.props.actions.getList({ search });
    }

    render() {
        return (
            <View searchBar style={{ flexDirection: 'row', padding: 10 }}>
                <InputGroup rounded style={{ flex: 1, backgroundColor: '#fff', height: 30, paddingLeft: 10, paddingRight: 10 }}>
                    <Input
                        // style={{ height: 20 }}
                        placeholder="Tìm kiếm"
                        onChangeText={this.onTyping}
                        returnKeyType='search'
                        onSubmitEditing={this.search}
                        value={this.state.search}
                        autoFocus={true}
                        autoCapitalize='none'
                    />
                    <TouchableOpacity style={{ height: 30, justifyContent: 'center', alignItems: 'center' }} onPress={this.onRequestClose}>
                        <Icon type='MaterialIcons' name="close" style={{ fontSize: 25 }} />
                    </TouchableOpacity>
                </InputGroup>
            </View>
        );
    }
}

export default connect(SearchBox, state => ({
    customers: state.customer.items,
    job: state.job,
    jobStatus: state.jobstatus,
}), { ...actions });