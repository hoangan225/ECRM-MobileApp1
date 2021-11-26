import React, { Component } from 'react';
import { FlatList, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { List, View, Spinner, Text, Container, Content } from 'native-base';
import * as actions from '../../../actions/customer';
import { connect } from '../../../lib/connect';
import Loading from '../../controls/loading';
import CustomerListItem from '../primary/customerPartListItem';

class CustomersNew extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            page: 1,
            pagesize: 20,
            msg: null,
            refreshing: false,
            selectedValueName: null,
            curentBox: null,
            curentCustomer: null,
        };
    }
    UNSAFE_componentWillReceiveProps(props) {
        this.props.customer.itemnews;
    }
    autoSaveImg = (item) => {
        if (item.avatar) {
            this.props.actions.updateAvatar(item.id, item.avatar)
                .catch((e) => {
                    // console.log(e);
                });
        }
    }
    renderItem = item => {
        this.autoSaveImg(item);
        var viewId = this.props.viewId;
        var details = [];
        var customViews = this.props.customView.items.filter(t => t.id == viewId);
        if (customViews && customViews.length > 0) {
            details = customViews[0].details;
            if (details && details.length > 0) {
                details = details.sort((t1, t2) => t1.order - t2.order);
            }
        }
        var fields = [
            { fieldName: 'Phone' },
            { fieldName: 'Email' }
        ]
        return (
            <CustomerListItem
                // fields={details}
                fields={fields}
                customer={item}
                showBox={this.props.showBox} />
        );
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

    render() {
        if (!this.props.customer.loaded) {
            return <Loading />
        }
        const { itemnews } = this.props.customer

        return (
            <View style={styles.page}>
                <FlatList
                    data={itemnews}
                    renderItem={({ item }) => this.renderItem(item)}
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
                    disableVirtualization
                    // ListFooterComponent={this.renderFooter}
                    // onEndReached={this.handleLoadMore}
                    onEndReachedThreshold={200}
                />

            </View>

        );
    }
}
export default connect(CustomersNew, state => ({
    customer: state.customer,
    customView: state.customview,
    host: state.account.host,
}), actions);


const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: '#fff'
    },
    flatlistfooter: {
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
    }
})