import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, Platform, StatusBar, SectionList, RefreshControl } from 'react-native';
import { connect } from '../../../lib/connect';
import * as actions from '../../../actions/process';
import { getList as getListOpp } from '../../../actions/opportunity';
import OpportunityItem from '../../proccess/proccessPartListItem';
import OpportunityBox from '../../proccess/processPartBox';

class OpportunityList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            currentOpportunity: null,
            filter: {
                processId: 83
            },
        }
        this.process = null;
    }

    componentDidMount() {
        const { process, items } = this.props.process;
        this.process = items.find(item => item.id == process.id);
        if (this.process) {
            // console.log('componentDidMount cus optin');

            if (this.process.steps.length == 0) {
                this.onRefresh();
            }
            else {
                if (this.props.opportunities.loaded) {
                    this.props.actions.getListOpp(this.state.filter);
                }
                else {
                    this.applyFilter({
                        processId: process.id
                    });
                }
            }
        } else {
            this.props.actions.getList();
        }
    }

    UNSAFE_componentWillReceiveProps(props) {
        let propsProccess = props.process.process
        // const { process, items } = props.process;
        this.process = propsProccess ? propsProccess.steps : null;
        // // console.log('this.process', this.process);

        if (propsProccess && props.process.process.id != this.state.filter.processId) {
            // // console.log('this.processprocessprocessprocessprocess');
            this.setState({
                ...this.state,
                filter: {
                    ...this.state.filter,
                    processId: props.process.process.id
                },
            });
            this.applyFilter({
                processId: props.process.process.id
            });
        }

    }

    onRefresh = () => {
        this.setState({ loading: true });
        this.props.actions.getListOpp(this.state.filter)
            .catch(({ error, message }) => {
                alert(error, message);
            });
        this.props.actions.getList();
    }

    applyFilter = filter => {
        // // console.log('applyFilter', filter);

        filter = {
            ...this.state.filter,
            ...filter,
        };

        this.setState({ loading: true });

        this.props.actions.getListOpp(filter)
        // .then(data => {
        //     this.setState({
        //         total: data.total,
        //         filter,
        //         loading: false
        //     });
        // })
        // .catch(error => {
        //     this.setState({ loading: false })
        // })
    }

    render() {
        const opportunities = this.props.opportunities.items;
        const processes = this.props.process.items;
        // // console.log('this.proccess', opportunities);

        if (!opportunities || opportunities.length == 0) return (
            <Text style={styles.msg}>{__('Chưa có cơ hội.')}</Text>
        );
        const opp = opportunities.filter(tem => (tem.customer.id == this.props.entry.id ? tem : null))
        // // console.log('this.opp', opp);
        const sections = opp.map(item => {
            return {
                title: item.step.nameProcess,
                data: opp
            }
        })

        if (sections.length == 0) return (
            <Text style={styles.msg}>{__('Chưa có cơ hội.')}</Text>
        );

        return (
            <View style={styles.page}>
                <SectionList
                    sections={sections}
                    renderItem={({ item }) => this.renderItem(item)}
                    renderSectionHeader={({ section }) => this.renderHeader(section)}
                    refreshControl={
                        <RefreshControl
                            tintColor="#28cc54"
                            title="Loading..."
                            titleColor="#00ff00"
                            colors={['#28cc54', '#00ff00', '#ff0000']}
                            refreshing={this.props.refreshing}
                            onRefresh={this.props.onRefresh}
                        />
                    }
                    keyExtractor={(item) => 'ID' + item.id}
                />
                <OpportunityBox
                    entry={this.state.currentOpportunity}
                    show={this.state.currentOpportunity != null}
                    box="details"
                    onRequestClose={() => this.setState({ currentOpportunity: null })} />
                {/* <Text>{JSON.stringify(opportunities)}</Text> */}
            </View>
        );
    }

    renderHeader = section => {
        return (
            <Text style={styles.listHeader}>{section.title}</Text>
        )
    }

    renderItem = item => {
        if (!item) return null;
        return item ? (
            <OpportunityItem
                data={item}
                step={item.step}
                showBox={(entry) => this.setState({ currentOpportunity: entry })}
                canEdit={true}
                canDelete={true}
                hidePrice={false}
                hideActionButton={true}
            />
        ) : (
            <Text style={styles.itemLoading}>{__('Đang tải..')}</Text>
        )
    }
}

export default connect(OpportunityList, state => ({
    process: state.processes,
    host: state.account.host,
    opportunities: state.opportunity,
}), {
    ...actions,
    getListOpp
});

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: '#fff'
    },
    listView: {
        flex: 1,
    },
    listHeader: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: '#f2f2f2',
        fontWeight: 'bold'
    },
    itemLoading: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#f2f2f2',
    },
    msg: {
        padding: 15,
        color: 'red',
        textAlign: 'center'
    }
});
