import { Icon, Toast } from 'native-base';
import React, { Component } from 'react';
// import Toast from 'react-native-simple-toast';
import { Alert, Animated, Dimensions, Platform, StatusBar, StyleSheet, Text, View } from 'react-native';
import ActionButton from 'react-native-action-button';
import { TabBar, TabView } from 'react-native-tab-view';
import { getList as getListCustomer } from '../../actions/customer';
import * as actions from '../../actions/job';
import { getList as getListJobStatus } from '../../actions/jobstatus';
import { getList as getListUser } from '../../actions/user';
import { connect } from '../../lib/connect';
import ActionSheet from '../controls/actionSheet';
import Loading from '../controls/loading';
import MenuContext from '../controls/menuContext';
import Toolbar from '../controls/toolbars';
import MyStatusBar from '../statusBar/MyStatusBar';
import JobBox from './jobPartBox';
import JobCalendar from './jobPartCalender';
import JobFilter from './jobPartFilter';
import JobList from './jobPartList';
import JobTimeline from './jobPartTimeLine';
import Search from './search';




class JobPage extends Component {
    constructor(props, context) {
        super(props, context);

        this.routes = [
            { key: 'list', icon: 'list', title: 'Tất cả' },
            { key: 'time', icon: 'calendar-o', title: 'Theo ngày' },
            { key: 'calendar', icon: 'calendar', title: 'Theo tháng' }
        ]

        this.state = {
            showFilter: false,
            loading: false,
            currentViewIndex: 0,
            currentJob: null,
            currentBox: null,
            notification: false,
            selectedDate: null,
            ready: false,
            fadeAnim: new Animated.Value(0),
            showSearch: null,
        }
        // // console.log('context', context);
        this.canload = context.currentBranchId;
        this.canEdit = context.user.can("Job.Edit");
        this.canEditOther = context.user.can("Job.EditOther");
        this.canReport = context.user.can("Job.Report");
        this.canListStatus = context.user.can("JobStatus.Manage");
    }

    componentDidMount() {
        Animated.timing(
            this.state.fadeAnim,
            {
                toValue: 1,
                duration: 6000,
                useNativeDriver: true
            }
        ).start();
    }

    componentDidUpdate(preProps) {
        if (preProps.job.loaded && !this.props.job.loaded) {
            this.refresh();
        }
    }

    getActionMenu = () => {
        if (this.state.showSearch == "search") {
            return [
                {
                    icon: <Icon type='MaterialIcons' name='more-vert' style={{ fontSize: 22, color: '#fff' }} />,
                    menuItem: { icon: <Icon type='MaterialIcons' name='more-vert' style={{ fontSize: 22, color: '#fff', padding: 5 }} /> }
                }
            ];
        } else {
            return [

                {
                    icon: <Icon name='filter-list' type='MaterialIcons' style={{ fontSize: 22, color: '#fff' }} />,
                    onPress: () => this.showFilter(true)
                },
                {
                    icon: <Icon type='MaterialIcons' name='search' style={{ fontSize: 22, color: '#fff', paddingRight: 5 }} />,
                    onPress: () => this.showSearch('search')
                },
                {
                    icon: <Icon type='MaterialIcons' name='more-vert' style={{ fontSize: 22, color: '#fff' }} />,
                    menuItem: { icon: <Icon type='MaterialIcons' name='more-vert' style={{ fontSize: 22, color: '#fff', padding: 5 }} /> }
                }
            ];
        }
    }


    refresh = () => {
        this.setState({ loading: true });
        this.showBox(null);
        this.props.actions.getList()
            .then(() => {
                this.setState({ loading: false, ready: true });

            })
            .catch(({ error, message }) => {
                this.setState({ loading: false, ready: true });

            })
    }

    handleChangeTab = (index) => {
        this.setState({
            currentViewIndex: index,
            selectedDate: null
        });
    };

    onCalendarSelectDate = (date) => {
        this.setState({
            currentViewIndex: 1,
            selectedDate: date
        });
    }

    showBox = (job, box = 'details') => {
        this.setState({ currentJob: job, currentBox: box, notification: false });
    }

    showFilter = (show) => {
        this.setState({ showFilter: show });
    }

    showSearch = (show) => {
        this.setState({ showSearch: show });
    }

    showMenu = () => {
        this.props.navigation.openDrawer();
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
        const routes = {
            routes: this.routes,
            index: this.state.currentViewIndex,
        }

        const actions = this.getActionMenu();
        let { fadeAnim } = this.state;
        return (
            <View style={styles.page}>
                {Platform.OS === 'ios' ? <StatusBar backgroundColor='#009ABF' barStyle='light-content' /> : <MyStatusBar backgroundColor='#009ABF' barStyle='light-content' />}
                <Toolbar
                    noShadow
                    icon={<Icon type='MaterialIcons' name="menu" style={{ fontSize: 22, color: '#fff' }} />}
                    actions={actions}
                    onIconPress={this.showMenu}
                    title={
                        this.state.showSearch == 'search' ?
                            <Animated.View
                                style={{
                                    ...this.props.style,
                                    opacity: fadeAnim,
                                }}
                            >
                                <Search
                                    onRequestClose={() => this.showSearch(false)}
                                // searchJob={data => this.applyFilter(data)}
                                />
                            </Animated.View>

                            :
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>{__('Công việc')}</Text>

                    }
                    style={styles.toolbar}
                    onPressMore={() => this.showBox({}, 'menucontext')}
                ></Toolbar>

                <View style={styles.viewList}>
                    {
                        routes.routes.length > 0 &&
                        <TabView
                            style={styles.container}
                            navigationState={routes}
                            renderScene={this.renderView}
                            renderTabBar={this.renderViewHeader}
                            onIndexChange={this.handleChangeTab}
                            initialLayout={{ height: 0, width: Dimensions.get('window').width }}
                        />
                    }
                    {
                        this.state.loading &&
                        <Loading />
                    }

                    <ActionButton onPress={() => this.showBox({}, "create")} buttonColor="#00A7D0" />
                </View>

                <JobBox
                    show={this.state.currentJob != null && this.state.currentBox != "actionSheet"}
                    box={this.state.currentBox}
                    entry={this.state.currentJob}
                    showLoading={(loading) => this.setState({ loading })}
                    onRequestClose={() => this.showBox(null)}
                    canEdit={this.canEdit}
                    canEditOther={this.canEditOther}
                    canReport={this.canReport} />

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

                <MenuContext
                    open={this.state.currentJob != null && this.state.currentBox == "menucontext"}
                    onRequestClose={() => this.showBox(null)}
                    items={[
                        {
                            icon: <Icon type="MaterialIcons" name='autorenew' style={{ fontSize: 20 }} />,
                            text: __("Làm mới"),
                            onPress: this.refresh,
                        },

                    ]}
                />

                <JobFilter
                    show={this.state.showFilter}
                    onRequestClose={() => this.showFilter(false)} />

            </View>
        );
    }

    renderIcon = ({ route }) => {
        return <Icon type='FontAwesome' style={{ fontSize: 18, color: '#fff' }} name={route.icon} />
    }

    renderViewHeader = (props) => {
        return (
            <TabBar {...props}
                style={styles.tabBar}
                renderIcon={this.renderIcon}
                indicatorStyle={styles.indicator}
                renderLabel={({ route, focused, color }) => (
                    <Text style={[styles.tabLabel, { color }]} numberOfLines={1}>
                        {route.title}
                    </Text>
                )}
                scrollEnabled={false} />
        );
    };

    renderView = ({ route }) => {
        switch (route.key) {
            case 'list':

                return (
                    <JobList loading={this.state.loading} showBox={this.showBox} />
                )
            case 'time':

                return (
                    <JobTimeline loading={this.state.loading} date={this.state.selectedDate} showBox={this.showBox} />
                )
            case 'calendar':

                return (
                    <JobCalendar loading={this.state.loading} onCalendarSelectDate={this.onCalendarSelectDate} />
                )
        }
    };
}

export default connect(JobPage, state => ({
    // jobCount: state.job.items.length,
    job: state.job,
    customer: state.customer,
    user: state.user,
    jobStatus: state.jobstatus,
    branch: state.branch,
}), {
    ...actions,
    getListUser,
    getListCustomer,
    getListJobStatus
});

const styles = StyleSheet.create({
    page: {
        flex: 1,
    },
    container: {
        flex: 1
    },
    toolbar: {
        backgroundColor: '#00A7D0'
    },
    tabBar: {
        backgroundColor: '#00A7D0',
        paddingHorizontal: 0,
        zIndex: 0
    },
    indicator: {
        backgroundColor: '#fff',
    },
    tabLabel: {
        fontSize: 11,
        textAlign: 'center'
    },
    viewList: {
        flex: 1,
    },
    noConnection: {
        padding: 10,
        backgroundColor: 'red'
    },
    noConnectionMsg: {
        color: '#fff'
    },
    createButton: {
        position: 'absolute',
        bottom: 10,
        right: 10,
    }
});
