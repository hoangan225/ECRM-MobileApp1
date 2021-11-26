import React, { Component } from 'react';
import CustomerBox from '../customer/primary/customerPartBox';

class jobPartBoxCustomer extends Component {
    constructor(props) {
        super(props);
    }

    onRequestClose = () => {
        this.props.onCloseDetailCus();
    }

    render() {
        const { jobCus, show } = this.props;

        if (!show) return null;

        return <CustomerBox
            entityId={jobCus.valCustomer}
            show={true}
            onRequestClose={this.onRequestClose}
            box='details' />

    }
}

export default jobPartBoxCustomer;