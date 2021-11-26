import { Icon } from 'native-base';
import React, { Component } from 'react';
import { Animated, Platform, StatusBar, StyleSheet, Text, View } from 'react-native';
import { patch as patchOpp, remove as removeOpp, updateStep } from '../../actions/opportunity';
// import { TabView, TabBar } from 'react-native-tab-view';
import * as actions from '../../actions/process';
import { connect } from '../../lib/connect';
import Loading from '../controls/loading';
import MenuContext from '../controls/menuContext';
import Select from '../controls/select';
import Toolbar from '../controls/toolbars';
import MyStatusBar from '../statusBar/MyStatusBar';
import ProcessTabs from './proccessTab';
import ProcessDataFilter from './processPartBoxFilters';
import ProcessSearch from './search';



class ProcessPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            ready: false,
            showFilter: false,
            sort: {
                key: 'createDate',
                type: 'desc'
            },
            filter: {
                ownerId: null,
                search: null,
                stepId: null,
            },
            fadeAnim: new Animated.Value(0),
        }
    }

    componentDidMount() {
        if (this.props.process.items.length == 0) {
            this.refresh();
        }
        // else {
        //     this.props.actions.getList().catch(() => 1).then(() => {
        //         this.setState({ ready: true });
        //     });
        // }

        Animated.timing(
            this.state.fadeAnim,
            {
                toValue: 1,
                duration: 6000,
                useNativeDriver: true
            }
        ).start();
    }

    UNSAFE_componentWillReceiveProps(props) {
        if (props.branch.currentId != this.props.branch.currentId) {
            if (this.props.process.items.length == 0) {
                this.refresh();
            }
        }
        else if (this.props.process.process && props.process.process) {
            // // console.log('this.props.process.process', this.props.process.process);
            // // console.log('props.process.process', props.process.process);
            if (this.props.process.process.id != props.process.process.id) {
                // console.log('refresh')
                this.refresh();
            }
        }
    }

    refresh = () => {
        this.setState({ loading: true });
        this.showBox(null);
        this.props.actions.getList()
            .then(() => {
                // console.log("then");
                this.setState({ loading: false });
            })
            .catch(({ error, message }) => {
                // console.log("catch");
                this.setState({ loading: false });
            })
    }

    showBox = (process, box = 'details', cb = null) => {
        // this.setState({ currentProcess: process, currentBox: box, notification: false });
        if (cb) {
            this.setState({ currentProcess: process, currentBox: box, notification: false }, () => {
                setTimeout(cb, 300);
            });
        }
        else {
            this.setState({ currentProcess: process, currentBox: box, notification: false });
        }
    }

    showFilter = (show) => {
        if (Platform.OS === 'ios') {
            this.showBox(null, null, () => {
                this.setState({ showFilter: show })
            });
        } else {
            this.setState({ showFilter: show });
            this.showBox(null);
        }

    }

    getActionMenu = () => {
        if (this.state.showFilter == 'search') {
            return [
                {
                    icon: <Icon type='MaterialIcons' name='more-vert' style={{ fontSize: 22, color: '#fff' }} />,
                    menuItem: { icon: <Icon type='MaterialIcons' name='more-vert' style={{ fontSize: 22, color: '#fff', padding: 5 }} /> }
                }
            ];
        } else {
            return [
                {
                    icon: <Icon type='MaterialIcons' name='search' style={{ fontSize: 22, color: '#fff', paddingRight: 5 }} />,
                    onPress: () => this.showFilter('search')
                },
                {
                    icon: <Icon type='MaterialIcons' name='more-vert' style={{ fontSize: 22, color: '#fff' }} />,
                    menuItem: { icon: <Icon type='MaterialIcons' name='more-vert' style={{ fontSize: 22, color: '#fff', padding: 5 }} /> }
                }
            ];
        }

    }

    applyFilter = (filter) => {
        this.setState({
            filter: {
                ...this.state.filter,
                ...filter,
            }
        })
    }

    showMenu = () => {
        this.props.navigation.openDrawer();
    }

    changeProcessId = id => {
        // console.log(id, '===');
        this.props.actions.swithProcess(id);
    }

    render() {
        let { fadeAnim } = this.state;
        // const processes = this.props.process.items
        const { items, process } = this.props.process;
        // // console.log('process', this.state.loading);

        const list = items.map(item => ({
            label: item.name,
            value: item.id
        }));

        const actions = this.getActionMenu();

        return (
            <View style={styles.page}>
                {Platform.OS === 'ios' ? <StatusBar backgroundColor='#AD2F1F' barStyle='light-content' /> : <MyStatusBar backgroundColor='#AD2F1F' barStyle='light-content' />}
                {
                    items.length > 0 ? (
                        <Toolbar
                            actions={actions}
                            onPressMore={() => this.showBox({}, 'menucontext')}
                            noShadow={true}
                            icon={<Icon type='MaterialIcons' name="menu" style={{ fontSize: 22, color: '#fff' }} />}
                            onIconPress={this.showMenu}
                            title={
                                this.state.showFilter == 'search' ?
                                    <Animated.View
                                        style={{
                                            ...this.props.style,
                                            opacity: fadeAnim,
                                        }}
                                    >
                                        <ProcessSearch
                                            onRequestClose={() => this.showFilter(false)}
                                            searchProcess={data => this.applyFilter(data)}
                                        />
                                    </Animated.View>

                                    :
                                    <Select
                                        items={list}
                                        selectTextStyle={styles.selectTextStyle}
                                        arrowStyle={styles.arrowStyle}
                                        selectedValue={process ? process.id : null}
                                        showSearchBox={false}
                                        onValueChange={id => this.changeProcessId(id)} />

                            }
                            style={styles.toolbar}
                        ></Toolbar>
                    ) :
                        (
                            <Toolbar
                                noShadow={true}
                                icon={<Icon type='MaterialIcons' name="menu" style={{ fontSize: 22, color: '#fff' }} />}
                                onIconPress={this.showMenu}
                                style={styles.toolbar}
                                title={<Text style={{ color: '#fff', fontWeight: 'bold' }}>{__('Quy trình hoạt động')}</Text>}
                            ></Toolbar>
                        )

                }
                {
                    this.state.loading &&
                    <Loading />
                }
                {
                    items.length > 0 &&
                    <View style={styles.viewList}>
                        <ProcessTabs
                            filter={this.state.filter}
                            sort={this.state.sort}
                            items={items}
                            process={process}
                        />
                    </View>
                }
                <MenuContext
                    open={this.state.currentProcess != null && this.state.currentBox == "menucontext"}
                    onRequestClose={() => this.showBox(null)}
                    items={[
                        {
                            icon: <Icon type="MaterialIcons" name='autorenew' style={styles.sizeIcon} />,
                            text: __("Làm mới"),
                            onPress: () => this.refresh(),
                        },
                        {
                            text: __("Lọc dữ liệu"),
                            icon: <Icon type="MaterialIcons" name="sort" style={styles.sizeIcon} />,
                            onPress: () => this.showFilter('data'),
                        },
                    ]}
                />
                <ProcessDataFilter
                    show={this.state.showFilter == "data"}
                    onRequestClose={() => this.showFilter(null)}
                    // filters={this.state.filters}
                    title={__('Quy trình hoạt động')}
                    valueFilter={this.state.filter.ownerId}
                    onChange={data => this.applyFilter(data)}
                    sort={this.state.sort}
                    onSortChange={(params) => this.setState({
                        sort: {
                            ...params
                        }
                    })}
                />
            </View>
        );
    }
}

export default connect(ProcessPage, state => ({
    process: state.processes,
    host: state.account.host,
    opportunity: state.opportunity,
    branch: state.branch
}), {
    ...actions,
    updateStep,
    removeOpp,
    patchOpp
});

const styles = StyleSheet.create({
    page: {
        flex: 1,
    },
    container: {
        flex: 1
    },
    toolbar: {
        backgroundColor: '#DB4437'
    },
    selectProcess: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 5
    },
    selectTextStyle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    arrowStyle: {
        color: '#fff',
        fontSize: 30
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
    sizeIcon: {
        fontSize: 20
    }
});