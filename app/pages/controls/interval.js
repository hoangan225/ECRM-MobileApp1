import React, { Component } from 'react';
import { View } from 'react-native';

class Interval extends Component {
    constructor(props) {
        super(props);

        this.state = {
            count: 1
        }
    }

    componentDidMount() {
        this.timer = setInterval(this.update, this.props.timeout);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    componentDidUpdate(preProps) {
        if (preProps.timeout != this.props.timeout) {
            clearInterval(this.timer);
            this.timer = setInterval(this.update, this.props.timeout);
        }
    }

    update = () => {
        this.setState({ count: this.state.count + 1 })
    }

    render() {
        if (this.props.render) {
            return this.props.render(this.state.count)
        }
        return null;
    }
}

export default Interval;