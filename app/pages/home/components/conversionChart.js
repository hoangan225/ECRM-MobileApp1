import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from '../../../lib/connect';
import { getConversion } from '../../../actions/widget';
import FunnelChart from './chart/funelConversionChart';
import Loading from '../../controls/loading';

class WidgetConversion extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: false,
            data: null,
        }
        var user = this.context.user;
        this.canConversion = user.hasCap("Customer.Manage") || user.hasCap("Opportunity.Manage");
    }

    componentDidMount() {
        const filter = {
            rangeType: this.props.rangeType
        }
        if (this.props.conversion.hasOwnProperty(`type-${this.props.rangeType}`) === false) {
            // console.log('componentDidMount')
            this.setState({ loading: true });

            this.props.actions.getConversion(filter)
                .then(data => {
                    // // console.log('dataaaaaa', data)
                    this.setState({
                        loading: false,
                        // data: data
                    });
                })
                .catch(error => {
                    // alert(error.error, error.message);
                    // console.log(error);
                    this.setState({ loading: false })
                })
        } else {
            if (this.canConversion) {
                this.props.actions.getConversion(filter)
            }
        }
    }


    filterOpp = (percent) => {
        if (percent) {
            this.props.conversion[`type-${this.props.rangeType}`].filter(conv => conv.opportunities.filter)
        }
    }

    render() {
        // // console.log(this.props.conversion[`type-${this.props.rangeType}`], 'conversion===');
        if (this.props.conversion.hasOwnProperty(`type-${this.props.rangeType}`) === false
            || this.state.loading) {
            return null;
        }

        const { title } = this.props;
        let oppSuccess = 0;
        let oppFail = 0;
        let oppInteractive = 0;
        this.props.conversion[`type-${this.props.rangeType}`].items.map(conversion => {
            conversion.opportunities.map(opp => {
                if (opp.percent === 100) {
                    oppSuccess++;
                } else if (opp.percent === 0) {
                    oppFail++;
                } else {
                    oppInteractive++;
                }
            });
        })
        const data = [
            {
                name: __("khách hàng tiềm năng"),
                y: this.props.conversion[`type-${this.props.rangeType}`].total,
                color: '#2196F3',
            },
            {
                name: __("cơ hội đang tương tác"),
                y: oppInteractive,
                color: 'deepOrange'
            },
            {
                name: __("cơ hội thành công"),
                y: oppSuccess,
                color: '#32c787'
            },
            {
                name: __("cơ hội thất bại"),
                y: oppFail,
                color: 'red'
            },
        ];
        // console.log('opppp', data)
        return (
            <View>
                {
                    (oppInteractive === 0 && oppFail === 0 && oppSuccess === 0) ?
                        <Text style={{ textAlign: 'center', padding: 20, color: "red" }}>{"Không có dữ liệu hiển thị"}</Text>
                        : <FunnelChart
                            width="50%"
                            height="80%"
                            center={['30%', '40%']}
                            data={data}
                        />
                }
            </View>
        );
    }
}

export default connect(WidgetConversion, state => ({
    conversion: state.widget.conversion,
}), {
    getConversion
});