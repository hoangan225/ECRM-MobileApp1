import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from '../../../lib/connect';
import * as actions from '../../../actions/wifi/report';
import DatePicker from '../../controls/datepicker';
import LineChart from './chart';
import PieChart from './pieChartWf';
import moment from 'moment';
const styles = {
    table: {
        maxWidth: 300,
    },
    colorBox: {
        width: 30,
        height: 15,
    }
}
class WifiLocation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            filter: {
                range: [moment(new Date()).subtract(1, "months").toDate(), moment().toDate()]
            },
            data: []
        }
        this.ajax = false;
    }

    refresh = () => {
        if (this.state.filter.range && !this.ajax) {
            this.setState({ loading: true });
            this.ajax = true;
            this.props.actions.getUserRange(this.state.filter).then(data => {
                this.setState({ data, loading: false })
                this.ajax = false;
            }).catch((e) => {
                // console.log('====================================')
                // console.log(e, 'error')
                // console.log('====================================')
            });
        }
    }
    setFilter = (filter) => {
        this.setState({
            filter: {
                ...this.state.filter,
                ...filter
            }
        }, () => this.refresh())
    }

    componentDidMount() {
        this.refresh();
    }

    render() {
        const all = {
            new: 0,
            back: 0,
            success: 0,
            fail: 0
        };
        const date = {}, locations = {}, userIds = [];
        this.state.data.map(item => {
            const key = moment(item.dateTime).format("L");
            const locationKey = item.location;
            if (!date[key]) {
                date[key] = 0
            }
            if (!locations[locationKey]) {
                locations[locationKey] = {
                    new: 0,
                    back: 0,
                    success: 0,
                    userIds: []
                }
            }
            date[key]++;
            if (!userIds.contains(item.customerId)) {
                userIds.push(item.customerId);
                if (item.isNewGlobal) {
                    all.new++;
                } else {
                    all.back++;
                }
            }
            if (!locations[locationKey].userIds.contains(item.customerId)) {
                locations[locationKey].userIds.push(item.customerId);
                if (item.isNewGlobal) {
                    locations[locationKey].new++;
                } else {
                    locations[locationKey].back++;
                }
            }
            if (item.isSuccess) {
                all.success++;
                locations[locationKey].success++;
            }
        });
        all.fail = this.state.data.length - all.success;
        return (
            <View>
                {/*
                <View style={{ flexDirection: 'row-reverse' }}>
                    <DatePicker
                        date={this.state.filter.range}
                        customInputStyle={{ alignItems: 'center' }}
                        onDateChange={(date) => { this.setFilter({ range: moment(date) }) }}
                    />
                </View>
                    */}
                <PieChart
                    title={__("Người dùng")}
                    data={[
                        { name: __("Mới"), y: all.new, color: 'green' },
                        { name: __("Quay lại"), y: all.back, color: 'blue' },
                    ]}
                />
                <View>
                    <Text style={{ textAlign: 'center' }}>Mới: {all.new}</Text>
                </View>
                <View>
                    <Text style={{ textAlign: 'center' }}>Quay lại: {all.back}</Text>
                </View>
                <PieChart
                    title={__("Tỉ lệ kết nối")}
                    data={[
                        { name: __("Thành công"), y: all.success, color: 'green' },
                        { name: __("Khách hàng thấy trang chào"), y: all.fail, color: 'orange' },
                    ]}
                />
                <View>
                    <Text style={{ textAlign: 'center' }}>Thành công: {all.success}</Text>
                </View>
                <View>
                    <Text style={{ textAlign: 'center' }}>Thất bại: {all.fail}</Text>
                </View>

                <LineChart
                    categories={Object.keys(date)}
                    data={[
                        { type: "line", data: Object.values(date), name: __("Lượt truy cập") },
                    ]}
                />
                {/**/}
            </View>
        );
    }
}

export default connect(WifiLocation, state => ({
    wifiLocation: state.wifiLocation,
    gender: state.app.enums.gender
}), actions);