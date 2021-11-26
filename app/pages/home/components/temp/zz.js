import React from 'react';
import { View, Text, ScrollView, StyleSheet, Platform, StatusBar, Dimensions, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';
import Calender from '../job/jobPartCalender';
// import JobPartList from '../job/jobPartList';
import MyStatusBar from '../statusBar/MyStatusBar';
import ActionButton from 'react-native-action-button';
import Toolbar from '../controls/toolbars';
import JobBox from '../job/jobPartBox';
import ModalJob from './components/modalJobList';
import CreateWidget from './components/createWidget';
// import Chart from './components/chart';
import Chart from './components/chartLine';
import WifiChart from './components/wifiChart';
import { connect } from '../../lib/connect';
import * as actions from '../../actions/account';
import { generatorId } from '../../lib/helpers';
// import ConversionChart from './components/conversionChart';
let screenHeight = Dimensions.get("window").height;

const defaultWidgets = {
    params: [
        { type: 'job', title: 'công việc', i: 'job', statusId: null, },
        { type: 'conversion', i: 'conversion', title: 'tỉ lệ chuyển đổi', rangeType: 1 },
        { type: 'calendar', title: 'lịch', i: 'calendar' },
        { type: 'customer', i: 'customer', title: 'khách hàng', rangeType: 2 },
        { type: 'wifi', i: 'wifi', title: 'wifi' },
    ]
};

const caps = {
    job: ["Job.Manage"],
    conversion: ["Customer.Manage", "Opportunity.Manage"],
    calendar: ["Job.Manage"],
    customer: ["Customer.Manage"],
    wifi: ["Wifi.ManageReport"],
}
class HomePage extends React.Component {

    constructor(props, context) {
        super(props, context);
        const metas = this.props.account.user.metas;
        // console.log('kdfjgdkf', metas)
        const widgets = metas.widgets || defaultWidgets;
        widgets.params = widgets.params;
        this.state = {
            showCreate: false,
            currentEdit: false,
            currentDelete: null,
            selectedDate: null,
            showListJob: false,
            currentJob: null,
            currentBox: null,
            showWidget: false,
            widgets: widgets,
        }
    }

    componentDidMount() {
        this.props.actions.getProfile().then(data => {
            const metas = data.metas;
            const widgets = metas.widgets || defaultWidgets;
            widgets.params = widgets.params;
            this.setState({
                widgets
            })
        });
    }

    hasCap = (key) => {
        const lstCaps = caps[key];
        if (!lstCaps) return false;
        // // console.log(lstCaps)
        return lstCaps.filter(cap => !this.context.user.hasCap(cap)).isEmpty();
    }

    showBox = (job, box = 'details') => {
        this.setState({ currentJob: job, currentBox: box });
    }

    onCalendarSelectDate = (date) => {
        this.setState({
            currentViewIndex: 1,
            selectedDate: date,
            showListJob: true
        });
    }

    create = () => {
        this.setState({
            showWidget: true
        });
    }

    onRequestClose = () => {
        this.setState({
            showListJob: false,
            showWidget: false
        });
    }

    showMenu = () => {
        this.props.navigation.openDrawer();
    }

    handleNewWidget = (data) => {
        const { ...widgetParams } = data;

        const id = widgetParams.type + '-' + generatorId();

        const params = [
            ...this.state.widgets.params,
            {
                ...widgetParams,
                i: id
            },
        ]

        this.setState({
            widgets: {
                params,
            }
        }, () => {
            this.setUserWidgets();
        });
    }

    setUserWidgets = () => {
        this.props.actions.changeMetas({
            id: this.context.user.id,
            metas: {
                ...this.props.account.user.metas,
                widgets: this.state.widgets
            }
        })
    }

    closeWidget = key => {
        const { params } = this.state.widgets;
        for (var i = 0; i < params.length; i++)
            if (params[i].i == key) {
                params.splice(i, 1);
            }
        // params.remove(item => item.i == key);
        this.setState({
            widgets: {
                ...this.state.widgets,
                params
            }
        }, () => {
            this.setUserWidgets();
        })
    }

    getParams = (key, type) => {
        return this.state.widgets.params[key][type];
    }

    renderWidget = (item, key) => {
        switch (this.getParams(key, 'type')) {
            case 'calendar':
                return (
                    <View>
                        <View style={styles.headerViewChart}>
                            <View style={styles.headerChildViewChart}>
                                <Icon type='FontAwesome' name="calendar" style={styles.icon} />
                                <Text style={styles.textHeader}>Calendar</Text>
                            </View>
                            <TouchableOpacity style={styles.btnCloseView} onPress={() => this.closeWidget(item.i)}>
                                <Icon type='FontAwesome' name="close" style={styles.icon} />
                            </TouchableOpacity>
                        </View>
                        <Calender onCalendarSelectDate={this.onCalendarSelectDate} />
                        {/* calendar */}
                    </View>
                )

            case 'conversion':
                return (
                    <View>
                        <View style={styles.headerViewChart}>
                            <View style={styles.headerChildViewChart}>
                                <Icon type='MaterialIcons' name="donut-large" style={styles.icon} />
                                <Text style={styles.textHeader}>Conversion rate</Text>
                            </View>
                            <TouchableOpacity style={styles.btnCloseView} onPress={() => this.closeWidget(item.i)}>
                                <Icon type='FontAwesome' name="close" style={styles.icon} />
                            </TouchableOpacity>
                        </View>
                        {/* Conversion chart */}
                    </View>
                )
            case 'customer':
                return (
                    <View>
                        <View style={styles.headerViewChart}>
                            <View style={styles.headerChildViewChart}>
                                <Icon type='FontAwesome' name="users" style={styles.icon} />
                                <Text style={styles.textHeader}>Customer</Text>
                            </View>
                            <TouchableOpacity style={styles.btnCloseView} onPress={() => this.closeWidget(item.i)}>
                                <Icon type='FontAwesome' name="close" style={styles.icon} />
                            </TouchableOpacity>
                        </View>
                        <Chart />
                        {/* customer chart */}
                    </View>
                )
            case 'wifi':
                return (
                    <View>
                        <View style={styles.headerViewChart}>
                            <View style={styles.headerChildViewChart}>
                                <Icon type='MaterialIcons' name="donut-large" style={styles.icon} />
                                <Text style={styles.textHeader}>Wifi</Text>
                            </View>
                            <TouchableOpacity style={styles.btnCloseView} onPress={() => this.closeWidget(item.i)}>
                                <Icon type='FontAwesome' name="close" style={styles.icon} />
                            </TouchableOpacity>
                        </View>
                        <WifiChart />
                        {/* WifiChart */}
                    </View>
                )
            case 'job':
                return (
                    <View>
                        <View style={styles.headerViewChart}>
                            <View style={styles.headerChildViewChart}>
                                <Icon type='FontAwesome' name="calendar" style={styles.icon} />
                                <Text style={styles.textHeader}>Job</Text>
                            </View>
                            <TouchableOpacity style={styles.btnCloseView} onPress={() => this.closeWidget(item.i)}>
                                <Icon type='FontAwesome' name="close" style={styles.icon} />
                            </TouchableOpacity>
                        </View>
                        {/* calendar */}
                    </View>
                )
            default:
                break;
        }
    }

    render() {
        const widgets = this.state.widgets;
        return (
            <View style={styles.page}>
                {Platform.OS === 'ios' ? <StatusBar backgroundColor='#4CAF50' barStyle='light-content' /> : <MyStatusBar backgroundColor='#4CAF50' barStyle='light-content' />}
                <Toolbar
                    noShadow
                    icon={<Icon type='MaterialIcons' name="menu" style={{ fontSize: 22, color: '#fff' }} />}
                    onIconPress={this.showMenu}
                    titleText={__('Trang chủ')}
                    style={styles.toolbar}
                ></Toolbar>
                <ScrollView>
                    {widgets.params && widgets.params.map((item, key) =>
                        <View key={item.i} >
                            {this.renderWidget(item, key)}
                        </View>
                    )}
                </ScrollView>
                {/*chi tiet cv */}
                <JobBox
                    show={this.state.currentJob != null && this.state.currentBox != "actionSheet"}
                    box={this.state.currentBox}
                    entry={this.state.currentJob}
                    onRequestClose={() => this.showBox(null)}
                />
                {this.state.showListJob &&
                    <ModalJob date={this.state.selectedDate} onRequestClose={this.onRequestClose} showBox={this.showBox} />
                }
                {this.state.showWidget &&
                    <CreateWidget onRequestClose={this.onRequestClose} showBox={this.showBox} onSave={data => this.handleNewWidget(data)} />
                }
                <ActionButton onRequestClose={this.onRequestClose} onPress={() => this.create()} buttonColor="#00A7D0" />
            </View>
        );
    }
}


export default (connect(HomePage, state => ({
    app: state.app,
    account: state.account,
}),
    {
        ...actions,
    }
));

const styles = StyleSheet.create({
    page: {
        flex: 1,
    },
    pageItems: {
        height: screenHeight / 2
    },
    headerViewChart: {
        flexDirection: 'row',
        borderColor: '#ccc',
        borderWidth: StyleSheet.hairlineWidth,
        paddingVertical: 5,
        alignItems: 'center',
    },
    headerChildViewChart: {
        flex: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    btnCloseView: {
        flex: 1,
        alignItems: 'flex-end'
    },
    textHeader: {
        fontWeight: 'bold',
        fontStyle: 'italic',
        color: '#333'
    },
    icon: {
        fontSize: 14,
        color: '#333',
        paddingLeft: 15,
        paddingRight: 15,
    }
})