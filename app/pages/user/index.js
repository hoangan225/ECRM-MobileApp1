import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import Select from '../controls/select';
import { connect } from '../../lib/connect';
import * as actions from '../../actions/user';

class UserSelect extends Component {
    constructor(props) {
        super(props);

        this.state = {
            keyword: "",
            loading: false
        }

        this.data = [];
    }

    componentDidMount() {
        if (this.props.user.items.length == 0) {
            this.props.actions.getList();
        }
        // else {
        //     this.props.actions.getList(true);
        // }
    }

    getData = () => {
        var list = this.props.user.items;

        return list.map(item => ({ label: item.fullName, value: item.id }));
    }

    search = (keyword) => {
        this.setState({ keyword: (keyword || "").toLowerCase() })
    }

    onValueChange = (value) => {
        // // console.log('valueuser', value);

        const users = this.props.user.items;

        if (this.props.multiple) {
            var items = users.filter(item => value.indexOf(item.id) >= 0);
            if (this.props.onValueChange) {
                this.props.onValueChange(value, items);
            }
        }
        else {
            var item = users.find(item => item.id == value);
            if (this.props.onValueChange) {
                this.props.onValueChange(value, item);
            }
        }
    }

    render() {
        this.data = this.getData();

        return (
            <Select
                {...this.props}
                items={this.data}
                autoSearch={true}
                onSearch={this.search}
                onValueChange={this.onValueChange} />
        )
    }
}

UserSelect.propTypes = {
    selectedValue: PropTypes.any,
    multiple: PropTypes.bool,
    onValueChange: PropTypes.func,
    style: PropTypes.any,
    dropdownStyle: PropTypes.any,
    selectStyle: PropTypes.any,
    searchPlaceholder: PropTypes.string,
    placeholder: PropTypes.string,
}
export default connect(UserSelect, state => ({
    user: state.user,
}), {
    ...actions,
    // getListUser,
});