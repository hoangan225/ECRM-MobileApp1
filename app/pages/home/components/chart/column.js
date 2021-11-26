import React, { Component } from 'react';
import ChartView from '../../../../lib/hight-chart';
import colors from "./color";
import PropTypes from 'prop-types';
const defaultOptions = {
    chart: {
        type: 'column'
    },
    title: {},
    colors: Object.values(colors),
    xAxis: {
        categories: [],
        title: {
            text: null
        }
    },
    yAxis: {
        min: 0,
        title: {
            text: '',
            align: 'high'
        },
        labels: {
            overflow: 'justify'
        }
    },
    exporting: { enabled: false },
    plotOptions: {
        column: {
            dataLabels: {
                enabled: true
            },
        }
    },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        x: -40,
        y: 80,
        floating: true,
        borderWidth: 1,
        backgroundColor: '#FFFFFF',
        shadow: true
    },
    credits: {
        enabled: false
    },
    series: []
}
class ColumnChart extends Component {

    render() {
        const { title, legend, data, config, categories } = this.props;
        const options = { ...defaultOptions };
        options.title.text = title;

        options.xAxis.categories = categories;
        options.xAxis = {
            ...options.xAxis,
            // ...config.xAxis,
        }
        options.series = [
            ...data,
        ];
        options.legend = legend;
        options.plotOptions = {
            ...options.plotOptions,
            // ...config.plotOptions,
        }
        const chartConfig = {
            // ...config,
            ...options,
        }

        var Highcharts = 'Highcharts';

        const optionss = {
            global: {
                useUTC: false
            },
            lang: {
                decimalPoint: ',',
                thousandsSep: '.'
            }
        };

        return (
            <ChartView style={{ height: 300 }} config={chartConfig} options={optionss}></ChartView>
        );
    }
}

export default ColumnChart;