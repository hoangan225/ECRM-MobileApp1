import React, { Component } from 'react';
import ChartView from '../../../../lib/hight-chart';
import PropTypes from 'prop-types';
const defaultOptions = {
    chart: {
        type: 'funnel'
    },
    title: {},
    legend: {},
    series: [{
        allowPointSelect: true,
    }],
    tooltip: {
        headerFormat: '<span style="color:{point.color};display:inline-block;">\u25CF</span> <span style="font-size: 10px">{point.key}</span>',
        pointFormat: ' <b> ({point.y})</b>',
    },
    exporting: { enabled: false },
    plotOptions: {
        series: {
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b> ({point.y:,.0f})',
                color: 'black',
                softConnector: true
            },
        }
    },
    credits: {
        enabled: false
    },
}
class FunnelChart extends Component {

    render() {
        const { title, series, legend, data, config, width, height, center, } = this.props;
        const options = { ...defaultOptions };
        options.title.text = title;

        options.plotOptions.series.width = width;
        options.plotOptions.series.height = height;
        options.plotOptions.series.center = center;

        options.series[0] = {
            ...series,
            data: data,
        };
        options.legend = legend;

        const chartConfig = {
            ...config,
            ...options,
        }
        return (
            <ChartView funnel config={chartConfig} style={{ height: 300 }} />
        );
    }
}
FunnelChart.defaultProps = {
    title: '',
    type: 'funnel',
    legend: {
        enabled: true,
        align: 'center',
    },
    series: { name: '', },
    config: {},
    width: '80%',
    height: '100%',
    center: ['50%', '50%']
}

FunnelChart.propTypes = {
    title: PropTypes.string,
    type: PropTypes.oneOf(['pyramid', 'funnel']), //pyramid = tam giác
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    center: PropTypes.arrayOf(PropTypes.string),
    config: PropTypes.object,
    legend: PropTypes.shape({
        enabled: PropTypes.bool,
        align: PropTypes.oneOf(['center', 'left', 'right']),
    }),
    data: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        y: PropTypes.number.isRequired,
        color: PropTypes.string,
        selected: PropTypes.bool,
        sliced: PropTypes.bool,
    })).isRequired,
    series: PropTypes.shape({
        name: PropTypes.string,
    })
}
export default FunnelChart;