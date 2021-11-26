import React, { Component } from 'react';
import Select from '../../controls/select';
import { connect } from '../../../lib/connect';
import * as actions from '../../../actions/process';

class ProcessStepSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            steps: [],
        }
    }
    componentDidMount() {
        if (this.props.processes.loaded && this.props.processId) {
            const ps = this.props.processes.items.find(pr => pr.id === this.props.processId);
            if (ps) {
                this.setState({
                    steps: ps.steps
                })
            }
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.processes.loaded !== this.props.processes.loaded || nextProps.processId != this.props.processId) {
            if (nextProps.processId) {
                const ps = nextProps.processes.items.find(pr => pr.id === nextProps.processId);
                if (ps) {
                    this.setState({
                        steps: ps.steps
                    })
                }
            } else {
                this.setState({ steps: [] })
            }
        }
    }

    onValueChange = (value) => {
        const processes = this.props.processes.items;

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


    render() {
        const { options, createable, processes, ...attributes } = this.props;
        let disabled = false;
        let lstOptions = [];
        if (this.state.steps.length === 0) {
            disabled = true;
        } else {
            lstOptions = this.state.steps.map(item => ({
                value: item.id,
                label: item.name,
                model: { ...item },
            }));
        }

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
                onSearch={this.search}
                onValueChange={this.onValueChange} />
        )
    }
}

export default connect(ProcessStepSelect, state => ({
    processes: state.processes
}), actions);