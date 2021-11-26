import React from 'react';
import moment from 'moment';
import { View, Text, StyleSheet } from 'react-native';
import LineChart from './chart/chartLine';
import { connect } from '../../../lib/connect';
import { getCustomer } from '../../../actions/widget';
import ChartSelect from '../../controls/select';

class Chart extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: false,
            rangeType: 2,
        }
    }

    componentDidMount() {
        if (this.props.customer.hasOwnProperty(`type-${this.state.rangeType}`) === false) {
            const filter = {
                rangeType: this.state.rangeType
            }
            this.loadData(filter);
        }
    }

    loadData = (filter) => {
        this.setState({ loading: true });
        this.props.actions.getCustomer(filter)
            .then(data => {
                this.setState({
                    loading: false
                });
            })
            .catch(error => {
                // alert(error.error, error.message);
                // console.log(error);
                this.setState({ loading: false })
            })
    }
    changeType = (val) => {
        this.setState({
            rangeType: val
        }, () => {
            const filter = {
                rangeType: this.state.rangeType
            }
            this.loadData(filter);
        })
    }

    render() {
        const list = this.props.ranges;
        const newCus = this.props.customer;
        var data = [];
        var categories = [];
        let total = 0;
        const labels = [];
        var date = moment.utc().add(-14, 'd');
        newCus.map((item) => {
            categories.push(`${item.minDate} - ${item.maxDate}`);
            date = date.add(1, 'd');
            data.push({
                y: item.total,
            })
            total += item.total;
        })

        return (
            <View>
                <View style={[{ backgroundColor: '#72d6abe0', paddingLeft: 15, }]}>
                    {list &&
                        <ChartSelect
                            items={list}
                            selectTextStyle={styles.selectTextStyle}
                            arrowStyle={styles.arrowStyle}
                            selectedValue={this.state.rangeType}
                            showSearchBox={false}
                            onValueChange={value => this.changeType(value)} />
                    }
                </View>
                <LineChart
                    data={data}
                    categories={categories} />
            </View>
        )
    }
}


export default connect(Chart, state => ({
    customer: state.widget.customer,
    ranges: state.app.enums.rangeType,
}), {
    getCustomer
})

const styles = StyleSheet.create({
    selectTextStyle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    arrowStyle: {
        color: '#fff',
        fontSize: 30
    },
})