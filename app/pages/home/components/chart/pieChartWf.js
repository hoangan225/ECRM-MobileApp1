import React, { Component } from 'react';
import ChartView from '../../../../lib/hight-chart';
import PropTypes from 'prop-types';
const Highcharts = ChartView.Highcharts;
const defaultOptions = {
    title: {
        text: ''
    },
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        options3d: {
            enabled: false,
            alpha: 45,
            beta: 0
        }
    },
    exporting: { enabled: false },
    tooltip: {
        headerFormat: '',
        pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>',
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            showInLegend: true,
            cursor: 'pointer',
            depth: 35,
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                style: {
                    color: 'black'
                },
            }
        }
    },
    series: [{
        data: []
    }],
    credits: {
        enabled: false
    },
}

class PieChart extends Component {
    pieColors = () => {
        const colors = [];
        const base = Highcharts.getOptions().colors[0];

        for (let i = 0; i < 10; i++) {
            // Start out with a darkened base color (negative brighten), and end
            // up with a much brighter color
            colors.push(Highcharts.Color(base).brighten((i - 3) / 7).get());
        }
        return colors;
    }

    render() {

        const { title, series, legend, data, config, size, center, monochrome, shadow } = this.props;
        const options = { ...defaultOptions };

        options.title.text = title;

        options.plotOptions.pie.shadow = shadow;
        options.plotOptions.pie.size = size;
        options.plotOptions.pie.center = center;
        if (monochrome) {
            options.plotOptions.pie.colors = this.pieColors();
        }

        let total = 0;

        data.map(i => total += i.y);
        const chartData = data.map((item, index) => ({
            ...item,
            y: item.y * 100 / total,
        })
        );

        options.series[0] = {
            ...series,
            data: chartData,
        };

        options.legend = legend;

        const chartConfig = {
            ...config,
            ...options,
        }

        return (
            <ChartView config={chartConfig} style={{ height: 300 }} />
        );
    }
}

PieChart.defaultProps = {
    title: '',
    legend: {
        enabled: true,
        align: 'center',
        verticalAlign: 'bottom'
    },
    series: {},
    config: {},
    size: '80%',
    monochrome: false,
    shadow: true,
    center: ['50%', '50%']
}

PieChart.propTypes = {
    monochrome: PropTypes.bool,
    shadow: PropTypes.bool,
    '3d': PropTypes.bool,
    colors: PropTypes.arrayOf(PropTypes.string),
    title: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    center: PropTypes.arrayOf(PropTypes.string),
    config: PropTypes.object,
    legend: PropTypes.shape({
        enabled: PropTypes.bool,
        align: PropTypes.oneOf(['center', 'left', 'right']),
        verticalAlign: PropTypes.oneOf(['top', 'bottom', 'middle']),
    }),
    data: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        y: PropTypes.number.isRequired,
        color: PropTypes.string,
        selected: PropTypes.bool,
    })).isRequired,
    series: PropTypes.shape({
        name: PropTypes.string,
    })
}
export default PieChart;