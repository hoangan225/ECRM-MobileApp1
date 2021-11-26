import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { connect } from '../../../lib/connect';
import * as actions from '../../../actions/wifi/report';
import { View, Text } from 'react-native';
import ColumnChart from './chart/column';
import QuickStats from './chart/countConect';
import PieChart from './chart/pieChartWf';
import moment from 'moment';

class WifiDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            filter: {
                date: ""
            },
            data: {

            }
        }
    }

    componentDidMount() {
        this.setState({ loading: true });
        this.props.actions.getDashboard().then(data => {
            this.setState({ data, loading: false });
        }).catch(err => {
            this.setState({ loading: false });
        });
    }

    render() {
        const data = this.state.data;
        if (!data.oses) return null;

        const osData = data.oses.map((it, key) => ({
            name: it.name,
            y: it.count
        }))
        const browserData = data.browseres.map((it, key) => ({
            name: it.name,
            y: it.count
        }))
        const devicesData = data.devices.map((it, key) => ({
            name: it.name,
            y: it.count
        }))

        // const dateSorted = Object.keys(data.dates).sort();
        const chartData = {
            name: __("Khách hàng"),
            data: []
        };
        const chartTrafficData = [{
            name: __("Vào wifi"),
            color: 'green',
            data: []
        },
        {
            name: __("Thấy trang chào"),
            color: 'red',
            data: []
        }];

        // dateSorted.map(d => {
        //     chartData.data.push(data.dates[d].userIds.length);
        //     chartTrafficData[0].data.push(data.dates[d].success);
        //     chartTrafficData[1].data.push(data.dates[d].fail);
        // });

        if (!data.customers) return null;

        return (
            <View>
                <View style={[styles.rowQuick, { marginTop: 6 }]}>
                    <QuickStats
                        loading={this.state.loading}
                        style={[styles.quick, { backgroundColor: '#2196F3' }]}
                        title={data.total}
                        background="blue"
                        icon="time-interval"
                        subTitle={__("Lượt kết nối")} />
                    <QuickStats
                        loading={this.state.loading}
                        style={[styles.quick, { backgroundColor: '#32c787' }]}
                        title={data.customers.total}
                        background="green"
                        icon="account"
                        subTitle={__("Người dùng")} />

                </View>
                <View style={styles.rowQuick}>
                    <QuickStats
                        loading={this.state.loading}
                        style={[styles.quick, { backgroundColor: '#00BCD4' }]}
                        title={data.customers.one}
                        background="cyan"
                        icon="n-1-square"
                        subTitle={__("Khách đến lần đầu")} />
                    <QuickStats
                        loading={this.state.loading}
                        style={[styles.quick, { backgroundColor: 'orange' }]}
                        title={data.customers.total - data.customers.one}
                        background="orange"
                        icon="plus-2"
                        subTitle={__("Khách hàng quay lại")} />
                </View>

                <PieChart
                    title={`${__("Tình trạng")}`}
                    data={[
                        { name: __("Đang hoạt động"), y: data.customers.totalActive },
                        { name: __("Đã lâu chưa quay lại"), y: data.customers.totalDeActive },
                    ]}
                />
                <PieChart
                    title={`${__("Tần suất ghé thăm")}`}
                    data={[
                        { name: __("1 lần"), y: data.customers.one },
                        { name: __("2 lần"), y: data.customers.two },
                        { name: __("3 lần"), y: data.customers.three },
                        { name: __("4 lần"), y: data.customers.four },
                        { name: __("5 lần +"), y: data.customers.fivePlus },
                    ]}
                />
                <PieChart
                    title={`${__("Giới tính")}`}
                    data={[
                        { name: __("Nam"), y: data.customers.gender.male },
                        { name: __("Nữ"), y: data.customers.gender.female },
                        { name: __("Chưa biết"), y: data.customers.gender.other },
                    ]}
                />
                <PieChart
                    title={`${__("Người dùng trong 30 ngày qua")}`}
                    data={[
                        { name: __("Khách đến lần đầu"), y: data.customers.newIn30Days },
                        { name: __("Khách quay lại"), y: data.customers.backIn30Days },
                    ]}
                />
                {/* <ColumnChart
                    title={`${__("Số người dùng theo từng ngày")}`}
                    categories={dateSorted}
                    data={[chartData]}
                /> */}
                <PieChart
                    title={`${__("Lượt truy cập 30 ngày qua")}`}
                    data={[
                        { name: __("Vào Wifi"), y: data.strict30.landing, color: 'green' },
                        { name: __("Thấy trang chào"), y: data.strict30.splash, color: 'red' },
                    ]}
                />
                {/* <ColumnChart
                    title={`${__("Lượt truy cập từng ngày")}`}
                    config={{
                        plotOptions: {
                            column: {
                                stacking: 'normal',
                                dataLabels: {
                                    enabled: true,
                                }
                            }
                        }
                    }}
                    categories={dateSorted}
                    data={chartTrafficData}
                /> */}
                <PieChart
                    title={`${__("Hệ điều hành")}`}
                    data={osData}
                />
                <PieChart
                    title={`${__("Trình duyệt")}`}
                    data={browserData}
                />
                <PieChart
                    title={`${__("Thiết bị")}`}
                    data={devicesData}
                />
            </View>
        );
    }
}

export default connect(WifiDashboard, state => ({
    wifiLocation: state.wifiLocation,
    gender: state.app.enums.gender
}), actions);

const styles = StyleSheet.create({
    quick: { flex: 1, backgroundColor: "blue", margin: 3, padding: 5, borderRadius: 4 },
    rowQuick: { flexDirection: 'row', marginLeft: 10, marginRight: 10 }
})