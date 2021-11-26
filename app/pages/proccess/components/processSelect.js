import React, { Component } from 'react';
import Select from '../../controls/select';
import { connect } from '../../../lib/connect';
import * as actions from '../../../actions/process';

class ProcessSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    }

    componentDidMount() {
        if (!this.props.processes.loaded) {
            this.setState({
                loading: true
            })
            this.props.actions.getList().then(data => {
                this.setState({
                    loading: false
                })
            }).catch(err => {
                this.setState({ loading: false });
            });
        }
    }

    onValueChange = (value) => {
        const processes = this.props.processes.items;
        if (processes.length > 0) {
            if (this.props.multiple) {
                var items = processes.filter(item => value.indexOf(item.id) >= 0);
                if (this.props.onValueChange) {
                    this.props.onValueChange(value, items);
                }
            }
            else {
                var item = processes.find(item => item.id == value);
                if (this.props.onValueChange) {
                    this.props.onValueChange(value, item);
                }
            }
        }
    }

    render() {
        const { options, createable, processes, ...attributes } = this.props;

        let lstOptions = processes.items.map(item => ({
            value: item.id,
            label: item.name,
            model: { ...item },
        }));
        if (options) {
            if (options instanceof Array) {
                lstOptions = [...lstOptions, ...options];
            } else {
                lstOptions = [...lstOptions, options];
            }
        }

        return (
            <Select
                {...this.props}
                items={lstOptions}
                // autoSearch={true}
                // onSearch={this.search}
                showSearchBox={false}
                onValueChange={this.onValueChange} />
        )
    }
}

export default connect(ProcessSelect, state => ({
    processes: state.processes
}), actions);