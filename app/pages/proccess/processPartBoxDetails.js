import moment from 'moment';
import { Container, Icon, Toast } from 'native-base';
// import Toast from 'react-native-simple-toast';
import React, { Component } from 'react';
import { Alert, Dimensions, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';
import * as actions from '../../actions/opportunity';
import { connect } from '../../lib/connect';
import { MenuModalContext } from '../controls/action-menu';
import Avatar from '../controls/avatar';
import Toolbar from '../controls/toolbars';
import ButtonCall from '../voip/buttoncall';
import History from './components/processHistory';
import NextStep from './components/processNextStep';
import WhoAction from './components/processWhoAction';
class ProcessDetailsBox extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: false,
            currentViewIndex: 0,
            model: {},
        }
        this.manageCap = {
            email: context.user.hasCap("Email.Manage"),
            sms: context.user.hasCap("Sms.Manage"),
            job: context.user.hasCap("Job.Manage"),
        }
    }

    componentDidMount() {
        this.loadData(this.props.entry.id);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.entry.id && nextProps.entry.id !== this.props.entry.id) {
            this.loadData(nextProps.entry.id)
        }
    }

    loadData = (id) => {
        if (id) {
            this.setState({ loading: true });
            this.props.actions.getDetail(id).then(data => {

                this.setState({
                    model: {
                        ...data
                    },
                    loading: false,
                });
                // this.props.swithProcess(data.details.processId);
            }).catch(({ error, message }) => {
                Toast.show(message, 'danger');
                this.handleClose();
            })
        }
    }

    handleClose = () => {
        this.props.onRequestClose();
    }

    updateProfile = (customer) => {
        this.setState({
            model: {
                ...this.state.model,
                details: {
                    ...this.state.model.details,
                    customer: {
                        ...this.state.model.details.customer,
                        ...customer
                    }
                }
            }
        })
    }

    openLink = (link) => {
        Linking.canOpenURL(link).then(supported => {
            if (supported) {
                Linking.openURL(link);
            } else {
                console.log('Don\'t know how to open URI: ' + link);
            }
        });
    }

    onActionPress = (entry, name, show) => {
        this.refs.drawer.close();
        if (show) {
            this.props.showBox(entry, name);
        }
    }

    transfer = () => {
        this.props.showBox(this.props.entry, 'transfer');
    }

    edit = () => {
        this.props.showBox(this.props.entry, 'edit');
    }

    delete = () => {
        Alert.alert(
            'Xóa cơ hội',
            'Bạn có chắc chắn muốn xóa không?',
            [
                {
                    text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'
                },
                {
                    text: 'OK', onPress: () => {
                        var entr = this.props.entry
                        // var id = this.props.entry.id;
                        // var processId = this.props.entry.processId;

                        this.props.showBox(null, 'delete');
                        this.props.actions.remove(entr)
                            .then(() => {
                                //this.props.showLoading(false);

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

    showName = (entry) => {
        var result = null;
        if (entry) {
            var fullName = entry.customer.fullName;
            result = <Text style={styles.fullname}> {__(fullName)}</Text>
            return result;
        }
    }

    render() {
        // // console.log('this.manageCap', this.manageCap);
        // // console.log('this.state.model', this.state.model);
        const { entry, account } = this.props;
        var titleView = this.state.currentViewIndex;
        if (titleView == 0) { titleView = __('Chi tiết cơ hội') }
        if (titleView == 1) { titleView = __('Bước tiếp theo') }
        if (titleView == 2) { titleView = __('Đã thực hiện') }
        if (titleView == 3) { titleView = __('Lịch sử') }

        var useManage = this.props.user.items.map((item, index) => {
            if (entry.managerId == item.id)
                return (item.fullName);

        })
        const price = (entry.revenue || entry.expectedRevenue || 0).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
        if (!entry) return null;

        let routes = {
            routes: [
                {
                    key: 'info',
                    icon: 'info',
                },
                {
                    key: 'nextstep',
                    icon: 'arrow-right',
                },
                {
                    key: 'whoaction',
                    icon: 'male'
                },
                {
                    key: 'history',
                    icon: 'bullseye'
                }
            ],
            index: this.state.currentViewIndex,
        };

        return (
            <MenuModalContext
                supportedOrientations={['portrait', 'landscape']}
                onRequestClose={this.props.onRequestClose}>
                <Container style={styles.container}>
                    <Toolbar
                        noShadow
                        elevation={2}
                        icon={<Icon type='MaterialIcons' name='arrow-back' style={{ fontSize: 22, color: '#fff' }} />}
                        onIconPress={this.props.onRequestClose}
                        actions={[
                            {
                                icon: <Icon type='MaterialIcons' name='more-vert' style={{ fontSize: 22, color: '#fff' }} />,
                                menuItems: [
                                    {
                                        icon: <Icon type='MaterialIcons' name='arrow-forward' style={{ fontSize: 20 }} />,
                                        text: __("Bước tiếp theo"),
                                        onPress: this.transfer,
                                    },
                                    {
                                        divider: true
                                    },
                                    {
                                        icon: <Icon type='MaterialIcons' name='edit' style={{ fontSize: 20 }} />,
                                        text: __("Chỉnh sửa"),
                                        onPress: this.edit,
                                    },
                                    {
                                        icon: <Icon type='MaterialIcons' name='delete' style={{ fontSize: 20 }} />,
                                        text: __("Xóa"),
                                        onPress: this.delete,
                                    }
                                ]
                            }
                        ]}
                        titleText={titleView}
                        style={styles.toolbar}
                    ></Toolbar>
                    <TabView
                        style={styles.container}
                        navigationState={routes}
                        renderScene={this.renderView}
                        renderTabBar={this.renderViewHeader}
                        onIndexChange={this.handleChangeTab}
                        initialLayout={{ height: 0, width: Dimensions.get('window').width }}
                    />
                </Container>
            </MenuModalContext>
        )
    }

    renderIcon = ({ route }) => {
        return <Icon type='FontAwesome' name={route.icon} style={{ fontSize: 18, color: '#fff' }} />
    }

    handleChangeTab = (index) => {
        this.setState({
            currentViewIndex: index,
            selectedDate: null
        });
    };

    renderViewHeader = (props) => {
        return (
            <TabBar {...props}
                style={styles.tabBar}
                renderIcon={this.renderIcon}
                indicatorStyle={styles.indicator}
                scrollEnabled={false} />
        );
    };

    renderView = ({ route }) => {
        if (this.state.model && this.state.model.details) {
            var { name, revenue, expectedRevenue, probability,
                customer, notes, step, reason, jobs, owner, emailCampaigns, smsCampaigns, processId } = this.state.model.details;
            var jobsCompleted = [], jobsProcessing = [], emailsProcessing = [], emailSended = [], smsProcessing = [], smsSended = [];
            var atts = {
                processId: processId,
                stepId: step.id,
                updateProfile: this.updateProfile,
                customer: customer,
                jobsCompleted: jobsCompleted,
                smsProcessing: smsProcessing,
                emailsProcessing: emailsProcessing,
                jobsProcessing: jobsProcessing,
                smsSended: smsSended,
                emailSended: emailSended
            }
            if (this.manageCap.job) {
                jobs.map(job => {
                    if (job.isCancel || job.isComplete) {
                        jobsCompleted.push(job);
                    } else {
                        jobsProcessing.push(job)
                    }
                })
            }
            if (this.manageCap.sms) {
                smsCampaigns.map(sms => {
                    if (moment().isSameOrAfter(sms.sendDate)) {
                        smsProcessing.push(sms);
                    } else {
                        smsSended.push(sms);
                    }
                });
            }
            if (this.manageCap.email) {
                emailCampaigns.map(email => {
                    if (moment().isSameOrAfter(email.sendDate)) {
                        emailsProcessing.push(email);
                    } else {
                        emailSended.push(email);
                    }
                });
            }
        }

        switch (route.key) {
            case 'info':
                return this.renderInfo();
            case 'nextstep':
                return this.state.model && this.state.model.details ? this.renderNextStep(atts) : this.renderNextStep();
            case 'whoaction':
                return this.state.model && this.state.model.details ? this.renderWhoAction(atts) : this.renderWhoAction();
            case 'history':
                return this.state.model && this.state.model.logs ? this.renderHistory(this.state.model.logs) : this.renderHistory();
        }
    };

    renderInfo = () => {
        const { entry, account } = this.props;
        const price = (entry.revenue || entry.expectedRevenue || 0).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
        return (
            <View style={styles.process}>
                <ScrollView>
                    <View style={styles.avatarContainer}>
                        <Avatar url={entry.customer.avatar} name={entry.name} id={entry.id} size={70} />
                        <Text style={styles.proccessTitle}>
                            {entry.customer.fullName}
                        </Text>
                    </View>
                    <View style={styles.processInfo}>
                        <View style={styles.processProp} >
                            <Icon type='MaterialIcons' name="attach-money" style={styles.icon} />
                            <Text style={styles.value}>
                                {__('Giá trị:')} {price.toLocaleString()} VNĐ
                            </Text>
                        </View>

                        <View style={styles.processProp} >
                            <Icon type='MaterialIcons' name="account-box" style={styles.icon} />
                            <Text style={styles.value}>{__('Người phụ trách:')}
                                {
                                    entry.owner && entry.owner.name
                                    //     useManage.map((item) => {
                                    //     if (item != undefined) { return item }
                                    // })
                                }
                            </Text>
                        </View>
                        <View style={styles.processProp} >
                            <Icon type='MaterialIcons' name="today" style={styles.icon} />
                            <Text style={styles.value}>
                                {__('Ngày tạo:')} {moment(entry.completeDate).format("DD/MM/YYYY")}
                            </Text>
                        </View>
                        {
                            !!entry.company && (
                                <View style={styles.processProp}>
                                    <Icon type='MaterialIcons' name="business" style={styles.icon} />
                                    <Text style={styles.value}>{__('Công ty:')} {entry.company}</Text>
                                </View>
                            )
                        }
                        {
                            !!entry.phone && (
                                <View style={styles.processProp}>
                                    <Icon type='MaterialIcons' name="phone" style={styles.icon} />
                                    <Text style={styles.value}>{__('Điện thoại:')} </Text>
                                    <ButtonCall text={__("Gọi : {0}", entry.phone)} phone={entry.phone || ""} />
                                </View>
                            )
                        }
                        {
                            !!entry.email && (
                                <View style={styles.processProp} >
                                    <Icon type='MaterialIcons' name="email" style={styles.icon} />
                                    <Text style={styles.value}>{__('Email: ')}</Text>
                                    <TouchableOpacity onPress={() => this.openLink("mailto:" + entry.email)}>
                                        <Text style={styles.value}>{entry.email}</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        }
                        {
                            !!entry.notes && (
                                <View style={styles.processProp}>
                                    <Icon type='MaterialIcons' name="event-note" style={styles.icon} />
                                    <Text style={styles.valueNote}>
                                        {entry.notes}</Text>
                                </View>
                            )
                        }
                        {
                            !!entry.reason && (
                                <View style={styles.processProp}>
                                    <Icon type='MaterialIcons' name="info-outline" style={[styles.icon, { color: 'red' }]} />
                                    <Text style={[styles.value, { color: 'red' }]}>
                                        {entry.reason}</Text>
                                </View>
                            )
                        }
                        {/* 
                        <View style={styles.processProp}>
                            <ButtonCall text={__("Gọi : {0}", entry.phone)} phone={'84976628867' || ""} />
                        </View>
                        */}
                    </View>
                </ScrollView>
            </View>
        )
    }

    renderNextStep = (prams) => {
        return (
            <NextStep entry={this.props.entry}
                manageCap={this.manageCap}
                pram={prams}
                processing={true}
            />
        )
    }

    renderWhoAction = (prams) => {
        return (
            <WhoAction
                entry={this.props.entry}
                manageCap={this.manageCap}
                pram={prams}
                processing={false}
            />
        )
    }

    renderHistory = (log) => {
        return (
            <History
                entry={this.props.entry}
                manageCap={this.manageCap}
                logs={log}
                logType={this.props.logType}
            />
        )
    }

}

export default connect(ProcessDetailsBox, state => ({
    user: state.user,
    host: state.account.host,
    logType: state.app.enums.logType,
}), actions);

const styles = StyleSheet.create({
    page: {
        flex: 1
    },
    container: { flex: 1 },
    sidebar: {
        backgroundColor: '#fff',
    },
    toolbar: {
        backgroundColor: '#F44336'
    },
    process: {
        flex: 1,
    },
    avatarContainer: {
        backgroundColor: '#FF5252',
        alignItems: 'center',
        flexDirection: 'row'
    },
    tabBar: {
        backgroundColor: '#F44336',
        paddingHorizontal: 0,
        zIndex: 0,
        elevation: 0,
        shadowOpacity: 0,
    },
    indicator: {
        backgroundColor: '#F44336',
    },
    AvatarText: {
        color: '#fff',
        fontSize: 30
    },
    AvatarBackground: {
        backgroundColor: '#900',
    },
    fullname: {
        paddingLeft: 5,
        color: '#fff',
        fontSize: 22,
        fontWeight: 'normal'
    },
    proccessTitle: {
        flex: 1,
        color: '#fff',
        fontSize: 20,
        padding: 10,
        fontWeight: 'bold',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1
    },

    rowname: {
        flexDirection: 'row',
        backgroundColor: '#F44336',
        alignItems: 'center',
        padding: 15
    },
    Avatar: {
        width: 70,
        height: 70,
        borderWidth: 2,
        borderColor: '#fff',
        borderRadius: 70,
        justifyContent: 'center',
        alignItems: 'center',

    },
    processInfo: {
        flex: 1,
        padding: 10,
    },
    processTitle: {
        flex: 1,
        color: '#fff',
        fontSize: 20,
        margin: 10,
        fontWeight: 'bold',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1
    },
    processProp: {
        flexDirection: 'row',
        paddingVertical: 6,
    },
    icon: {
        marginTop: 3,
        fontSize: 14,
        color: '#444',
        marginRight: 10
    },
    value: {
        fontSize: 15,
        color: '#555',
    },
    valueNote: {
        fontSize: 15,
        color: '#555',
        flex: 1
    }
});

const drawerStyles = {
    drawer: {
        backgroundColor: '#fff',
        shadowColor: '#000000',
        shadowOpacity: 0.8,
        shadowRadius: 3
    },
    main: {

    },
    mainOverlay: {
        backgroundColor: '#000',
        opacity: 0,
        zIndex: 3,
        elevation: 3
    }
};
