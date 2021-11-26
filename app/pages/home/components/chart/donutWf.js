import React, { Component } from 'react';
import PieChart from './pieChartWf';

class DonutChart extends Component {
    render() {
        const { series, innerSize, ...atts } = this.props;

        return (
            <PieChart
                {...atts}
                series={{
                    ...series,
                    innerSize,
                }}
            />
        );
    }
}
DonutChart.defaultProps = {
    innerSize: '50%',
}

export default DonutChart;