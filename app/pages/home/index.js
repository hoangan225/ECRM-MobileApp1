import React from 'react';
import moment from 'moment';
import { View, Text, ScrollView, FlatList, StyleSheet, Platform, StatusBar, Dimensions, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';
import Calender from '../job/jobPartCalender';
// import JobPartList from '../job/jobPartList';
import JobPartList from './components/jobPartList';
import MyStatusBar from '../statusBar/MyStatusBar';
import ActionButton from 'react-native-action-button';
import Toolbar from '../controls/toolbars';
import ActionSheet from '../controls/actionSheet';
import JobBox from '../job/jobPartBox';
import ModalJob from './components/modalJobList';
import CreateWidget from './components/createWidget';
// import Chart from './components/chart';
import Chart from './components/chartLine';
import WifiChart from './components/wifiChart';
import { connect } from '../../lib/connect';
import * as actions from '../../actions/account';
import * as appActions from '../../actions/app';
import { generatorId } from '../../lib/helpers';
import defaultLayout from './defaultLayout';
import ConversionChart from './components/conversionChart';
let screenHeight = Dimensions.get("window").height;

const defaultWidgets = {
    layout: [
        { i: 'job-default', x: 6, y: 0, ...defaultLayout.job },
        { i: 'conversion-default', x: 0, y: 0, ...defaultLayout.conversion },
        { i: 'calendar-default', x: 0, y: 6, ...defaultLayout.calendar },
        { i: 'customer-default', x: 6, y: 6, ...defaultLayout.customer },
    ],
    params: [
        { type: 'job', title: __('công việc'), i: 'job-default', statusId: null, },
        { type: 'conversion', i: 'conversion-default', title: __('tỉ lệ chuyển đổi'), rangeType: 1 },
        { type: 'calendar', title: __('lịch'), i: 'calendar-default' },
        { type: 'customer', i: 'customer-default', title: __('khách hàng'), rangeType: 2 },
    ]
};

const caps = {
    job: ["Job.Manage"],
    conversion: ["Customer.Manage", "Opportunity.Manage"],
    calendar: ["Job.Manage"],
    customer: ["Customer.Manage"],
}
class HomePage extends React.Component {

    constructor(props, context) {
        super(props, context);
        const metas = this.props.account.user && this.props.account.user.metas;
        // // console.log('kdfjgdkf', metas)
        const widgets = metas && metas.widgets || defaultWidgets;
        widgets.layout = widgets.layout || [];
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
            today: moment().startOf('day'),
        }
    }

    componentDidMount() {
        this.props.actions.getProfile().then(data => {
            this.props.actions.getEnums()
            const metas = data.metas;
            const widgets = metas && metas.widgets || defaultWidgets;
            widgets.layout = widgets.layout || [];
            widgets.params = widgets.params;
            this.setState({
                widgets
            })
        });
    }

    componentWillUnmount() {
        // console.log('home unmount');
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
        const { layout, ...widgetParams } = data;

        const id = widgetParams.type + '-' + generatorId();

        const dataLayout = [
            ...this.state.widgets.layout,
            { i: id, x: (this.state.widgets.layout.length % 2) * 6, y: Infinity, ...layout }
        ]

        const params = [
            ...this.state.widgets.params,
            {
                ...widgetParams,
                i: id
            },
        ]

        this.setState({
            widgets: {
                layout: dataLayout,
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
        var { layout, params } = this.state.widgets;

        params = params.filter(item => item.i != key);
        layout = layout.filter(item => item.i != key);

        this.setState({
            widgets: {
                ...this.state.widgets,
                params,
                layout,
            }
        }, () => {
            this.setUserWidgets();
        })
    }

    getParams = (key) => {
        const { params } = this.state.widgets;
        return params.find(item => item.i == key) || {};
    }

    linkTo = () => {
        this.props.navigation.navigate("Job");
    }

    renderWidget = ({ item, index }) => {
        const params = this.getParams(item.i);
        const title = params.title;
        switch (params.type) {
            case 'job':
                return (
                    <View style={styles.widget} key={index}>
                        <View style={styles.headerViewChart}>
                            <View style={styles.headerChildViewChart}>
                                <Icon type='FontAwesome' name="calendar" style={styles.icon} />
                                <Text style={styles.textHeader}>Công việc đang thực hiện</Text>
                            </View>
                            <TouchableOpacity style={styles.btnCloseView} onPress={() => this.closeWidget(item.i)}>
                                <Icon type='FontAwesome' name="close" style={styles.icon} />
                            </TouchableOpacity>
                        </View>
                        <JobPartList showBox={this.showBox} onCalendarSelectDate={this.state.today} linkTo={this.linkTo} />
                    </View>
                )

            case 'calendar':
                return (
                    <View style={styles.widget} key={index}>
                        <View style={styles.headerViewChart}>
                            <View style={styles.headerChildViewChart}>
                                <Icon type='FontAwesome' name="calendar" style={styles.icon} />
                                <Text style={styles.textHeader}>{title}</Text>
                            </View>
                            <TouchableOpacity style={styles.btnCloseView} onPress={() => this.closeWidget(item.i)}>
                                <Icon type='FontAwesome' name="close" style={styles.icon} />
                            </TouchableOpacity>
                        </View>
                        <Calender onCalendarSelectDate={this.onCalendarSelectDate} />
                    </View>
                )

            case 'customer':
                return (
                    <View style={styles.widget} key={index}>
                        <View style={styles.headerViewChart}>
                            <View style={styles.headerChildViewChart}>
                                <Icon type='FontAwesome' name="users" style={styles.icon} />
                                <Text style={styles.textHeader}>{title}</Text>
                            </View>
                            <TouchableOpacity style={styles.btnCloseView} onPress={() => this.closeWidget(item.i)}>
                                <Icon type='FontAwesome' name="close" style={styles.icon} />
                            </TouchableOpacity>
                        </View>
                        <Chart />
                    </View>
                )
            default:
                break;
        }
    }

    open = () => {
        this.setState({ currentBox: 'details' });
    }

    edit = () => {
        this.setState({ currentBox: 'edit' });
    }

    delete = () => {
        Alert.alert(
            __('Xóa công việc'),
            __('Bạn có chắc chắn muốn xóa không?'),
            [
                {
                    text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'
                },
                {
                    text: 'OK', onPress: () => {
                        var id = this.state.currentJob.id;
                        this.setState({ currentJob: null });
                        this.props.actions.remove(id)
                            .then(() => {
                                // Toast.show("Xóa thành công");
                                Toast.show({
                                    text: 'Xóa thành công',
                                    duration: 2500,
                                    position: 'bottom',
                                    textStyle: { textAlign: 'center' },

                                });
                            })
                            .catch(({ error, message }) => {
                                //this.props.showLoading(false);
                                alert(error, message);
                            })
                    }
                },
            ],
            { cancelable: false }
        )
    }


    render() {
        // // console.log(this.state.selectedDate, "hksdgus");
        const widgets = this.state.widgets;
        return (
            <View style={styles.page}>
                {Platform.OS === 'ios' ? <StatusBar backgroundColor='#ffb400' barStyle='light-content' /> : <MyStatusBar backgroundColor='#ffb400' barStyle='light-content' />}
                <Toolbar
                    noShadow
                    icon={<Icon type='MaterialIcons' name="menu" style={{ fontSize: 22, color: '#fff' }} />}
                    onIconPress={this.showMenu}
                    titleText={__('Trang chủ')}
                    style={styles.toolbar}
                ></Toolbar>
                <FlatList
                    data={widgets.layout}
                    keyExtractor={item => item.i}
                    renderItem={this.renderWidget} />
                <JobBox
                    show={this.state.currentJob != null && this.state.currentBox != "actionSheet"}
                    box={this.state.currentBox}
                    entry={this.state.currentJob}
                    onRequestClose={() => this.showBox(null)}
                />
                <ActionSheet
                    open={this.state.currentJob != null && this.state.currentBox == "actionSheet"}
                    onRequestClose={() => this.showBox(null)}
                    title={this.state.currentJob != null && this.state.currentJob.name}
                    items={[
                        {
                            icon: <Icon type='MaterialIcons' name="info-outline" />,
                            text: __('Xem chi tiết'),
                            onPress: this.open
                        },
                        {
                            icon: <Icon name="edit" type='MaterialIcons' />,
                            text: __('Chỉnh sửa'),
                            onPress: this.edit
                        },
                        {
                            icon: <Icon name="delete" type='MaterialIcons' />,
                            text: __('Xóa'),
                            onPress: this.delete
                        }
                    ]} />
                {this.state.showListJob &&
                    <ModalJob date={this.state.selectedDate} onRequestClose={this.onRequestClose} showBox={this.showBox} />
                }
                {this.state.showWidget &&
                    <CreateWidget
                        onRequestClose={this.onRequestClose}
                        showBox={this.showBox}
                        onSave={this.handleNewWidget}
                        caps={caps}
                        canCreateWidget={widgets}
                        param={this.state.widgets}
                    />
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
        ...actions, ...appActions
    }
));

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: "#ddd"
    },
    scrollView: {
        paddingBottom: 100
    },
    pageItems: {
        height: screenHeight / 2
    },
    widget: {
        backgroundColor: '#fff'
    },
    headerViewChart: {
        flexDirection: 'row',
        // borderColor: '#ccc',
        // borderWidth: StyleSheet.hairlineWidth,
        paddingVertical: 5,
        alignItems: 'center',
        backgroundColor: '#ddd'
    },
    headerChildViewChart: {
        flex: 5,
        flexDirection: 'row',
        alignItems: 'center',
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