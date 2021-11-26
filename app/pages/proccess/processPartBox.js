import React, { Component } from 'react';
import {
    StyleSheet, View, Text, Modal
} from 'react-native';
import * as actions from '../../actions/process';
import { connect } from '../../lib/connect';
import ProcessDetailsBox from './processPartBoxDetails';
import ProcessEditBox from './processPartBoxEdit';
import ProcessCreateBox from './processPartBoxCreate';
import ProcessTransferBox from './processPartBoxTranfer';

import Loading from '../controls/loading';


class ProcessBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            changed: false,
            box: this.props.box
        }
        // 
    }

    UNSAFE_componentWillReceiveProps(props) {
        if (!this.state.changed) {
            this.setState({ box: props.box });
        }
    }

    showBox = (entry, box) => {
        if (entry != null) {
            this.setState({ box: box, changed: true });
        }
        else {
            this.onRequestClose();
        }
    }

    onRequestClose = () => {
        this.setState({ changed: false });
        this.props.onRequestClose();
    }

    render() {
        var { show, entry } = this.props;
        // // console.log('entry',entry)
        if (!show) return null;

        if (!entry) {
            return (
                <Modal onRequestClose={this.onRequestClose}>
                    <View style={{ flex: 1 }}><Loading /></View>
                </Modal>
            );
        }

        let steps = this.props.steps;

        // if (!steps) {
        //     const process = this.props.process.process.find(item => item.id == entry.stepId);
        //     steps = process ? process.step : [];
        // }

        this.loading = false;

        if (this.state.box == 'details') {
            return <ProcessDetailsBox
                entry={entry}
                showBox={this.showBox}
                onRequestClose={this.onRequestClose} />;
        }

        if (this.state.box == 'edit') {
            return <ProcessEditBox
                entry={entry}
                onRequestClose={this.onRequestClose} />;
        }

        if (this.state.box == 'create') {
            return <ProcessCreateBox
                entry={entry}
                stepIndex={this.props.stepIndex}
                steps={steps}
                onRequestClose={this.onRequestClose} />;
        }

        if (this.state.box == 'transfer') {
            return <ProcessTransferBox
                entry={entry}
                steps={steps}
                onRequestClose={this.onRequestClose} />;
        }
        return null;
    }
}


export default connect(ProcessBox, state => ({
    process: state.processes,
}), actions);


const styles = StyleSheet.create({
    pending: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 100
    }
});