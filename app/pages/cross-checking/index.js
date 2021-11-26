import { Icon, Toast } from 'native-base';
import React, { Component } from 'react';
import { Dimensions, Platform, StatusBar, StyleSheet, Text, View } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';
import { connect } from '../../lib/connect';
import Loading from '../controls/loading';
import Toolbar from '../controls/toolbars';
import MyStatusBar from '../statusBar/MyStatusBar';

import Day from './day';
import Week from './week';
import Month from './month';
import Details from './list';

class IndexPage extends Component {
    constructor(props, context) {
        super(props, context);

        this.routes = [
            { key: 'day', icon: 'list', title: 'Theo ngày' },
            { key: 'week', icon: 'list-alt', title: 'Theo tuần' },
            { key: 'month', icon: 'calendar', title: 'Theo tháng' }
        ]

        this.state = {
            loading: false,
            currentViewIndex: 0
        }

        this.canManage = this.context.user.hasCap("Coupon.Manage");
    }

    handleChangeTab = (index) => {
        this.setState({
            currentViewIndex: index,
            selectedDate: null
        });
    };

    viewList = (view, date, time) => {
        this.setState({ listFilter: { view, date, time } })
    }

    render() {
        const routes = {
            routes: this.routes,
            index: this.state.currentViewIndex,
        }

        const navigationState = this.props.navigation.state;

        const backgroundColor = navigationState.params && navigationState.params.backgroundColor || '#50ba54';

        return (
            <View style={styles.page}>
                {Platform.OS === 'ios' ? <StatusBar backgroundColor={backgroundColor} barStyle='light-content' /> : <MyStatusBar backgroundColor='#009ABF' barStyle='light-content' />}
                <Toolbar
                    noShadow
                    icon={<Icon type='MaterialIcons' name="menu" style={{ fontSize: 22, color: '#fff' }} />}
                    onIconPress={this.showMenu}
                    titleText={__('Đối soát KOPO')}
                    style={{ backgroundColor }}
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

                </View>
                <Details
                    filter={this.state.listFilter}
                    onRequestClose={() => this.viewList(null)} />
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
                renderLabel={({ route, focused, color }) => (
                    <Text style={[styles.tabLabel, { color }]} numberOfLines={1}>
                        {route.title}
                    </Text>
                )}
                indicatorStyle={styles.indicator}
                scrollEnabled={false} />
        );
    };

    renderView = ({ route }) => {
        switch (route.key) {
            case 'day':
                return (
                    <Day />
                )
            case 'week':
                return (
                    <Week viewList={this.viewList} />
                )
            case 'month':
                return (
                    <Month viewList={this.viewList} />
                )
        }
        return null;
    };
}

export default connect(IndexPage, state => ({
    user: state.user,
    branch: state.branch
}));

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
    }
});
