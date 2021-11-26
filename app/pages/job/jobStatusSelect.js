import tvkd from 'tieng-viet-khong-dau';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import { connect } from '../../lib/connect';
import * as actions from '../../actions/jobstatus';
import Select from '../controls/select'

class JobStatusSelect extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.jobStatus.items.length == 0) {
            this.props.actions.getList();
        }
    }

    getData = () => {
        var result = [];

        if (this.props.allowEmpty) {
            result = [{
                label: "Tất cả",
                value: "0",
            }];
        }

        var list = this.props.jobStatus.items.filter(item => item.status == 1);

        list.forEach(item => {

            let xitem = {
                label: item.name,
                value: item.id,
            }

            result.push(xitem);
        });

        return result;
    }

    onValueChange = (value) => {
        // // console.log('this.props.jobStatus',this.props.jobStatus)
        const status = this.props.jobStatus.items;

        if (this.props.multiple) {
            var items = status.filter(item => value.indexOf(item.id) >= 0);
            if (this.props.onValueChange) {
                this.props.onValueChange(value, items);
            }
        }
        else {
            var item = status.find(item => item.id == value);
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
                showSearchBox={false}
                placeholder="Tất cả"
                onValueChange={this.onValueChange} />
        )
    }
}

JobStatusSelect.propTypes = {
    selectedValue: PropTypes.any,
    multiple: PropTypes.bool,
    onValueChange: PropTypes.func,
    style: PropTypes.any,
    dropdownStyle: PropTypes.any,
    selectStyle: PropTypes.any,
    searchPlaceholder: PropTypes.string,
    placeholder: PropTypes.string,
    allowEmpty: PropTypes.bool
}

export default connect(JobStatusSelect, state => ({
    job: state.job,
    jobStatus: state.jobstatus,
}), { ...actions });
