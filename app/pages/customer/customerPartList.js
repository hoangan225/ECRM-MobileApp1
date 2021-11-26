import React, { Component } from 'react';
import { FlatList, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, ActivityIndicator } from "react-native";
import { List, View, Spinner, Text, Container, Content } from 'native-base';
import * as actions from '../../actions/customer';
import { connect } from '../../lib/connect';
import Loading from '../controls/loading';
import CustomerListItem from './primary/customerPartListItem';

class Customers extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            page: this.props.page,
            pagesize: 20,
            msg: null,
            refreshing: false,
            selectedValueName: null,
            curentBox: null,
            curentCustomer: null,
            canLoadMore: false
        };
        // this.view = this.props.customer.views[this.props.viewIndex] || {};
        this.timer = null;
    }

    componentDidMount() {
        // this.props.actions.getlist({ page: this.state.page, pagesize: this.state.pagesize });
    }

    _makeGetList = () => {
        let page = this.state.page;
        let pagesize = this.state.pagesize;
        this.props.actions.getlist({ page, pagesize }).then(res => {
            this.setState({
                msg: res.error || null,
                loading: false,
                refreshing: false
            });
        }).catch((error) => {
            this.setState({
                msg: error,
                refreshing: false,
                loading: false
            });
        })

    }

    handleRefresh = () => {
        this.setState({
            page: 1,
            pagesize: 20,
            refreshing: true
        },
            () => {
                // this._makeGetList()
                this.props.onRefresh(true);
                this.setState({
                    page: 1,
                    pagesize: 20,
                    refreshing: false
                })
            }
        );
    };

    handleLoadMore = () => {
        var { total, viewIndex, customer } = this.props;


        // if ((customer.items.length < total) && (this.state.tabIndex != routes.length)) {
        if ((customer.items.length < total)) {
            let pagesize = this.state.pagesize;
            this.setState({
                ...this.state,
                canLoadMore: true,
                loading: true,
                page: this.state.page,
                pagesize: pagesize + 20
            }, this.props.onChange(pagesize))
            // this.props.onPageChange(page)

        } else {
            this.setState({
                canLoadMore: false,
                loading: false,
            })
        }

    };


    renderFooter = () => {
        return (
            <View style={styles.flatlistfooter}>
                {
                    this.state.canLoadMore &&
                    <Spinner color='green' />
                }
                {
                    (!this.state.canLoadMore && this.props.customer.items.length > 0) ?
                        <Text>{__('Đã load hết dữ liệu')}</Text> :
                        <Text style={{ color: 'red' }}>{__('Đang tải..')}</Text>
                }
            </View>
        )
    };


    renderItem = ({ item }) => {

        var viewId = this.props.viewId;
        var details = [];
        var customViews = this.props.customView.items.filter(t => t.id == viewId);
        if (customViews && customViews.length > 0) {
            details = customViews[0].details;
            if (details && details.length > 0) {
                details = details.sort((t1, t2) => t1.order - t2.order);
            }
        }
        return (
            <CustomerListItem
                fields={details}
                customer={item}
                showBox={this.props.showBox} />
        );
        {/*
                <View style={styles.notData}><Text>{__('Đang tải...')}</Text></View>
                */}
    }

    render() {
        // // console.log(this.total, "total");
        const loading = this.state.loading && !this.state.refreshing && !this.state.canLoadMore && !this.props.loading;
        var lstCustomer = this.props.customer
        lstCustomer = lstCustomer.items;  //sau
        // var { customer } = this.props;
        // if (customer && customer.views.length > 0) {

        //     customer = customer.views.filter(t => t.viewId == this.props.viewId);
        //     if (customer && customer.length > 0) {
        //         if (customer[0].total) { this.total = customer[0].total; customer = customer[0].items; }
        //     }
        // }

        return (
            lstCustomer ?
                <View style={styles.page}>
                    <FlatList
                        data={lstCustomer}
                        renderItem={this.renderItem}
                        keyExtractor={item => ('ID' + item.id)}
                        refreshControl={
                            <RefreshControl
                                tintColor="#28cc54"
                                title="Loading..."
                                titleColor="#00ff00"
                                colors={['#28cc54', '#00ff00', '#ff0000']}
                                refreshing={this.state.refreshing}
                                onRefresh={this.handleRefresh}
                            />
                        }
                        onEndReached={this.handleLoadMore}
                        ListFooterComponent={this.renderFooter()}
                    />
                    {
                        loading &&
                        <Loading />
                    }
                </View>
                :
                <View style={styles.header}>
                    <Text style={styles.headerText}>{(this.state.loading || this.props.loading) ? 'Đang tải..' : 'Không có dữ liệu'}</Text>
                </View>


        );
    }
}
export default connect(Customers, state => ({
    // customer: state.customer,
    host: state.account.host,
    customField: state.customField,
    customView: state.customview,
}), actions);


const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: '#fff'
    },
    headerText: {
        color: 'red',
        textAlign: 'center',
        padding: 20
    },
    header: {
        flex: 1
    },
    flatlistfooter: {
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    notData: {
        paddingTop: 10,
        alignItems: 'center'
    }
})