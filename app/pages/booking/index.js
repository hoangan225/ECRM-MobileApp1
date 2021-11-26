import { Icon, Toast, Button } from 'native-base';
import moment from 'moment';
import React, { Component } from 'react';
import { Dimensions, Platform, StatusBar, StyleSheet, Text, View, Linking, Alert } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';
import { connect } from '../../lib/connect';
import * as actions from '../../actions/kopo/booking';
import { getItem as getBusiness, patch as patchBusiness } from '../../actions/kopo/business';
import Loading from '../controls/loading';
import Toolbar from '../controls/toolbars';
import Interval from '../controls/interval';
import MyStatusBar from '../statusBar/MyStatusBar';
import MenuContext from '../controls/menuContext';

import List from './list';
import Reject from './reject';
import StopBooking from './stop-booking';

const tabWidth = Math.max(Dimensions.get('window').width / 5, 60)

class IndexPage extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            index: 0,
            loading: false,
            recentIndex: null,
            rejectItem: null,
            routes: [
                { key: 'active', icon: 'square-o', title: 'Mới đặt' },
                { key: 'accept', icon: 'check-square-o', title: 'Tiếp nhận' },
                { key: 'complete', icon: 'star', title: 'Hoàn thành' },
                { key: 'reject', icon: 'times', title: 'Từ chối' },
                { key: 'cancel', icon: 'user-times', title: 'Khách hủy' },
                { key: 'expiry', icon: 'clock-o', title: 'Quá hạn' }
            ]
        }
    }

    componentDidMount() {
        this.props.actions.getBusiness();
    }

    handleChangeTab = (index) => {
        this.setState({
            index: index,
            recentIndex: index
        });
    };

    call = phone => {
        Linking.canOpenURL("tel://" + phone)
            .then(() => {
                Linking.openURL("tel://" + phone)
            })
    }

    reject = (item) => {
        this.setState({ rejectItem: item })
    }

    confirmReject = (reason) => {
        const item = this.state.rejectItem;
        this.setState({ rejectItem: null, loading: true });

        this.props.actions.reject({
            id: item.id,
            reason
        }).then(() => {
            this.setState({ loading: false })
        }).catch((e) => {
            e.status != 502 && alert(e.message)
            this.setState({ loading: false })
        })
    }

    accept = (item) => {
        this.setState({ loading: true })
        this.props.actions.accept({ id: item.id })
            .then(() => {
                this.setState({ loading: false })
            }).catch((e) => {
                e.status != 502 && alert(e.message)
                this.setState({ loading: false })
            })
    }

    stopBooking = () => {
        this.setState({ showMenu: false, showStopModal: true });
    }

    cancelStopBooking = () => {
        Alert.alert(
            'Mở lại đặt bàn',
            'Bạn có chắc chắn muốn mở lại đặt bàn không?',
            [
                {
                    text: 'OK', onPress: () => {
                        this.props.actions.patchBusiness({ disabledUntil: null })
                            .catch(e => e.status != 502 && alert(e.message))
                    }
                },
            ],
            { cancelable: false }
        )
    }

    render() {
        const navigationState = this.props.navigation.state;

        const backgroundColor = navigationState.params && navigationState.params.backgroundColor || '#50ba54';
        const actions = [
            {
                icon: <Icon type='MaterialIcons' name='more-vert' style={{ fontSize: 22, color: '#fff' }} />,
                onPress: () => this.setState({ showMenu: true })
            }
        ];

        const business = this.props.business.current;

        return (
            <View style={styles.page}>
                {Platform.OS === 'ios' ? <StatusBar backgroundColor={backgroundColor} barStyle='light-content' /> : <MyStatusBar backgroundColor='#009ABF' barStyle='light-content' />}
                <Toolbar
                    noShadow
                    icon={<Icon type='MaterialIcons' name="menu" style={{ fontSize: 22, color: '#fff' }} />}
                    onIconPress={this.showMenu}
                    titleText={__('Đặt bàn KOPO')}
                    style={{ backgroundColor }}
                    actions={actions}
                ></Toolbar>

                <View style={styles.viewList}>
                    <TabView
                        style={styles.container}
                        navigationState={this.state}
                        renderScene={this.renderView}
                        renderTabBar={this.renderViewHeader}
                        onIndexChange={this.handleChangeTab}
                        initialLayout={{ height: 0, width: Dimensions.get('window').width }}
                    />
                </View>
                {
                    this.state.loading &&
                    <Loading />
                }
                {
                    this.state.rejectItem && (
                        <Reject onRequestClose={() => this.setState({ rejectItem: null })} onConfirm={this.confirmReject} />
                    )
                }

                <MenuContext
                    open={this.state.showMenu}
                    onRequestClose={() => this.setState({ showMenu: false })}
                    items={[
                        {
                            icon: <Icon type="MaterialIcons" name='pause-circle-outline' style={{ fontSize: 20 }} />,
                            text: __("Tạm dừng đặt bàn"),
                            onPress: this.stopBooking,
                        },

                    ]}
                />

                {
                    this.state.showStopModal &&
                    <StopBooking onRequestClose={() => this.setState({ showStopModal: false })} />
                }

                {
                    business && business.disabledUntil && moment().diff(business.disabledUntil) < 0 && (
                        <Interval timeout={10000} render={() => (
                            <View style={styles.disableBox} key={this.state.now}>
                                <Text style={styles.disableText}>
                                    Đặt bàn đang tạm dừng trong thời gian {moment(business.disabledUntil).fromNow()}
                                </Text>
                                <Button small style={styles.disableBtn} onPress={this.cancelStopBooking}>
                                    <Text style={styles.disableBtnText}>Mở lại</Text>
                                </Button>
                            </View>
                        )} />
                    )
                }
            </View>
        );
    }

    renderIcon = ({ route }) => {
        return <Icon type='FontAwesome' style={{ fontSize: 18, color: '#fff' }} name={route.icon} />
    }

    renderViewHeader = (props) => {
        const navigationState = this.props.navigation.state;

        const backgroundColor = navigationState.params && navigationState.params.backgroundColor || '#50ba54';

        return (
            <TabBar {...props}
                style={[styles.tabBar, { backgroundColor }]}
                renderIcon={this.renderIcon}
                indicatorStyle={styles.indicator}
                renderLabel={({ route, focused, color }) => (
                    <Text style={[styles.tabLabel, { color }]} numberOfLines={1}>
                        {route.title}
                    </Text>
                )}
                tabStyle={{ width: tabWidth }}
                scrollEnabled={true} />
        );
    };

    renderView = ({ route }) => {
        return <List status={route.key} call={this.call} reject={this.reject} accept={this.accept} />
    };
}

export default connect(IndexPage, state => ({
    user: state.user,
    branch: state.branch,
    business: state.business
}), { ...actions, getBusiness, patchBusiness });

const styles = StyleSheet.create({
    page: {
        flex: 1,
    },
    container: {
        flex: 1
    },
    tabBar: {
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
    },
    disableBox: {
        backgroundColor: '#f8e5da',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#ff7601',
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    disableText: {
        flex: 1,
        marginRight: 10,
        fontSize: 13,
        color: '#ff7601'
    },
    disableBtn: {
        backgroundColor: '#ff7601',
        borderRadius: 5,
        paddingHorizontal: 10
    },
    disableBtnText: {
        color: '#fff',
        fontSize: 13
    }
});
