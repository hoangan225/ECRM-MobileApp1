import React, { Component } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import ActionButton from 'react-native-action-button';
import { TabBar, TabView } from 'react-native-tab-view';
import Loading from '../controls/loading';
import JobCalendar from './jobPartCalender';
import JobList from './jobPartList';
import JobTimeline from './jobPartTimeLine';

class JobTab extends Component {
    constructor(props) {
        super(props);

        this.routes = [
            { key: 'list', icon: 'list' },
            { key: 'time', icon: 'clock-o' },
            { key: 'calendar', icon: 'calendar' }
        ]

        this.state = {
            loading: false,
            currentStepIndex: 0,
            currentOpportunity: null,
            currentBox: null,
            total: 0,
            filter: {
                processId: 83
            },
        }
        // this.process = props.process.steps.filter(st => st.status === 1).orderBy(st => st.order);
        this.process = null;
    }


    showBox = (item, box = 'details') => {
        this.props.showBox(item, box)
    }


    render() {
        // // console.log('this.process', this.process)
        if (!this.process) return null;

        const routes = {
            routes: this.routes,
            index: this.props.currentStepIndex,
        }

        return (
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
        );
    }

    renderViewHeader = (props) => {
        return (
            <TabBar {...props} style={styles.tabBar} renderIcon={this.renderIcon} indicatorStyle={styles.indicator} scrollEnabled={false} />
        );
    };

    renderView = ({ route }) => {
        switch (route.key) {
            case 'list':

                return (
                    <JobList loading={this.props.loading} showBox={this.showBox} />
                )
            case 'time':

                return (
                    <JobTimeline loading={this.props.loading} date={this.props.selectedDate} showBox={this.showBox} />
                )
            case 'calendar':

                return (
                    <JobCalendar loading={this.props.loading} onCalendarSelectDate={this.props.onCalendarSelectDate} />
                )
        }
    };
}

export default JobTab;

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