import React from 'react';
import ChartView from '../../../../lib/hight-chart';

class ChartSummary extends React.Component {
    render() {
        var dataValue = this.props.data;
        var Highcharts = 'Highcharts';
        var conf = {
            chart: {
                type: 'line',
                animation: Highcharts.svg,
                marginRight: 10,
                events: {
                    load: function () {

                        // var series = this.series[0];
                        // setInterval(function () {
                        //     var x = (new Date()).getTime(),
                        //         y = Math.random();
                        //     series.addPoint([x, y], true, true);
                        // }, 3000);
                    }
                }
            },
            title: {
                text: 'Khách hàng mới'
            },
            xAxis: {
                type: 'category',
                categories: this.props.categories,
            },
            yAxis: {
                title: {
                    text: ''
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                formatter: function () {
                    return Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                        '<b>' + this.series.name + ':' + Highcharts.numberFormat(this.y, 0) + '</b><br/>'


                }
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [{
                name: 'Khách hàng mới',
                data: [...dataValue]
            }]
        };

        const options = {
            global: {
                useUTC: false
            },
            lang: {
                decimalPoint: ',',
                thousandsSep: '.'
            }
        };

        return (
            <ChartView style={{ height: 300 }} config={conf} options={options} ></ChartView>
        );
    }
}

export default ChartSummary;