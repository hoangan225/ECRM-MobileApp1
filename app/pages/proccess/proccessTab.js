import { orderBy } from 'lodash';
import { Icon, Toast } from 'native-base';
// import Toast from 'react-native-simple-toast';
import React, { PureComponent } from 'react';
import { Alert, Dimensions, StyleSheet, Text, View } from 'react-native';
import ActionButton from 'react-native-action-button';
import { TabBar, TabView } from 'react-native-tab-view';
import * as actions from '../../actions/opportunity';
import { connect } from '../../lib/connect';
import ActionSheet from '../controls/actionSheet';
import ProcessList from './proccessPartList';
import ProcessBox from './processPartBox';



class ProcessTabs extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            currentStepIndex: 0,
            currentOpportunity: null,
            currentBox: null,
            total: 0,
            filter: {
                processId: props.process.id
            },
        }
        this.process = props.process.steps.filter(st => st.status === 1);
    }

    componentDidMount() {
        const { process, items } = this.props;
        if (this.props.opportunity.loaded) {
            this.props.actions.getList(this.state.filter);
        }
        else {
            this.applyFilter();
        }
    }

    UNSAFE_componentWillReceiveProps(props) {
        let propsProccess = props.process
        if (props.items.length > 0) {
            this.process = propsProccess ? propsProccess.steps : null;
            if (propsProccess && (props.process.id != this.state.filter.processId)) {
                this.applyFilter({
                    processId: props.process.id
                });
            }
        }

    }

    applyFilter = filter => {
        // // console.log('filter---', filter);

        filter = {
            ...this.state.filter,
            ...filter,
        };

        this.setState({ loading: true });

        this.props.actions.getList(filter)
            .then(data => {
                this.setState({
                    total: data.total,
                    filter,
                    loading: false
                });
            })
            .catch(error => {
                // alert(error.error);

                this.setState({ loading: false })
            })
    }

    showBox = (item, box = 'details') => {
        this.setState({ currentOpportunity: item, currentBox: box });
    }

    create = () => {
        this.setState({ currentOpportunity: {}, currentBox: 'create' });
    }

    open = () => {
        this.setState({ currentBox: 'details' });
    }

    edit = () => {
        this.setState({ currentBox: 'edit' });
    }

    transfer = () => {
        this.setState({ currentBox: 'transfer' });
    }

    refresh = () => {
        this.setState({ loading: true });
        this.props.actions.getList(this.state.filter).then(() => {
            this.setState({ loading: false });
        })
            .catch(({ error, message }) => {
                this.setState({ loading: false });
                alert(error, message);
            });
    }

    onListRefresh = (callback) => {
        this.props.actions.getList(this.state.filter)
            .catch(() => 1)
            .then(callback);
    }

    handleChangeTab = (index) => {
        this.setState({
            currentStepIndex: index
        });
    };

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
                        var entr = this.state.currentOpportunity
                        // var id = this.state.currentOpportunity.id;
                        // var processId = this.state.currentOpportunity.id;
                        //this.props.showLoading(true);
                        this.setState({ currentOpportunity: null });
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


    render() {
        if (!this.process) return null;
        this.routes = this.process.map(item => ({
            ...item,
            key: item.id + "",
            title: item.name
        }));
        const routes = {
            routes: this.routes,
            index: this.state.currentStepIndex,
        }

        return (
            <View style={styles.container}>
                <TabView
                    navigationState={routes}
                    renderScene={this.renderView}
                    renderTabBar={this.renderViewHeader}
                    onIndexChange={this.handleChangeTab}
                    initialLayout={{ height: 0, width: Dimensions.get('window').width }}
                />

                <ActionSheet
                    open={this.state.currentOpportunity != null && this.state.currentBox == "actionSheet"}
                    onRequestClose={() => this.showBox(null)}
                    title={this.state.currentOpportunity != null && this.state.currentOpportunity.name}
                    items={[
                        {
                            icon: <Icon type='MaterialIcons' name="arrow-forward" />,
                            text: __('Bước tiếp theo'),
                            onPress: this.transfer
                        },
                        {
                            icon: <Icon type='MaterialIcons' name="info-outline" />,
                            text: __('Xem chi tiết'),
                            onPress: this.open
                        },
                        {
                            icon: <Icon type='MaterialIcons' name="edit" />,
                            text: __('Chỉnh sửa'),
                            onPress: this.edit
                        },
                        {
                            icon: <Icon type='MaterialIcons' name="delete" />,
                            text: __('Xóa'),
                            onPress: this.delete
                        }
                    ]} />

                <ProcessBox
                    show={this.state.currentOpportunity != null && this.state.currentBox != "actionSheet"}
                    box={this.state.currentBox}
                    entry={this.state.currentOpportunity}
                    stepIndex={routes.index}
                    steps={this.process}
                    showLoading={(loading) => this.setState({ loading })}
                    onRequestClose={() => this.showBox(null)} />

                <ActionButton onPress={this.create} buttonColor="#DB4437" />

            </View>
        );
    }

    renderViewHeader = (item) => {
        return (
            <TabBar {...item}
                style={styles.tabBar}
                indicatorStyle={styles.indicator}
                renderLabel={({ route, focused, color }) => (
                    <Text style={[styles.tabLabel, { color }]} numberOfLines={1}>
                        {route.title}
                    </Text>
                )}
                scrollEnabled={true}
            />
        );
    };


    renderView = ({ route }) => {
        const { search, ownerId, stepId } = this.props.filter;
        let allItems = this.props.opportunity.items;
        if (!String.prototype.contains) {
            String.prototype.contains = function (arg) {
                var reg = new RegExp(arg, "i")
                return this.match(reg);
            };
        }
        if (search != null && allItems.length > 0) {
            allItems = allItems.filter(item => {
                let flag = true;
                if (search != null) {
                    flag = item.name.contains(search) || item.email.contains(search) || item.phone.contains(search);
                }
                if (flag && ownerId != null) {
                    flag = item.ownerId == ownerId
                }
                if (flag && stepId != null) {
                    flag = item.stepId == stepId;
                }
                return flag;
            })
        }

        if (this.props.sort) {
            allItems = orderBy(allItems, this.props.sort.key, this.props.sort.type)
        }


        const list = allItems.filter(item => item.stepId == route.id)
        // // console.log('list', list.length);
        const { hidePrice } = this.process;

        return (
            <ProcessList
                loading={this.state.loading}
                entryField={this.state.currentOpportunity}
                data={list}
                percent={route.percent}
                {...{ hidePrice }}
                onRefresh={this.onListRefresh}
                showBox={this.showBox} />
        )
    };
}

export default connect(ProcessTabs, state => ({
    // process: state.processes,
    opportunity: state.opportunity,
    host: state.account.host,
}), actions);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    tabBar: {
        backgroundColor: '#DB4437',
        maxHeight: 70
    },
    indicator: {
        backgroundColor: '#fff',
    },
    tabLabel: {
        fontSize: 15,
        textAlign: 'center'
    },
});