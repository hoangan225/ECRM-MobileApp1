import React, { Component } from 'react';
import {
    Modal, StyleSheet, View, Text, TextInput, FlatList, ScrollView, ActivityIndicator, Switch, RefreshControl
} from 'react-native';
import { Button, Icon } from 'native-base';
import Toolbar from '../../controls/toolbars';

import { connect } from '../../../lib/connect';
import * as actions from '../../../actions/customer';

import Loading from '../../controls/loading';
import CustomerListItem from './customerPartListItem';

class CustomerSearchBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            loading: false,
            refreshing: false,
            loadingMore: false,
            canLoadMore: false,
            search: null,
            onlyCurrentTab: false,
            result: [],
        };
        this.timer = null;
    }

    // UNSAFE_componentWillReceiveProps(props) {
    //     this.refreshResult();
    // }

    onRequestClose = () => {
        this.setState({
            page: 1,
            loading: false,
            refreshing: false,
            loadingMore: false,
            canLoadMore: false,
            search: null,
            onlyCurrentTab: false,
            result: [],
        })
        this.props.onRequestClose();
    }

    onTyping = (value) => {
        this.setState({ search: value });
    }

    refreshResult = () => {
        const { onlyCurrentTab, search } = this.state;
        var q = (search || "").trim().toLocaleLowerCase();

        if (q) {
            var list = this.props.customers.filter(item => item.fullName.indexOf(q) >= 0);
            if (onlyCurrentTab) {
                var ids = this.props.view;
                list = list.filter(item => ids.indexOf(item.id) >= 0);
            }
            this.setState({
                result: list,
                refreshing: false
            });
        }
        else {
            this.setState({
                refreshing: false
            });
        }
    }

    search = () => {
        const { onlyCurrentTab, search } = this.state;

        var q = (search || "").trim().toLocaleLowerCase();

        if (q) {
            clearTimeout(this.timer);

            this.timer = setTimeout(() => {

                this.setState({
                    page: 1,
                    loading: true,
                    canLoadMore: false,
                    result: []
                });
                var data = { ...this.props.search, search }
                this.props.actions.search(data)
                    .then(data => {
                        // // console.log('search', data);

                        this.setState({
                            loading: false,
                            canLoadMore: data.total > 20,
                            loadingMore: false,
                            result: [...this.state.result, ...data.items].filter((v, i, a) => a.indexOf(v) === i)
                        });
                    })
                    .catch(({ error, message }) => {
                        alert(error, message);
                        this.setState({
                            loadingMore: false,
                            loading: false
                            // canLoadMore: true
                        });
                    })
            }, 600);
        }
        else {
            this.setState({
                result: [],
                canLoadMore: false,
                refreshing: false
            })
        }
    }

    refresh = () => {
        this.setState({ refreshing: true });
        this.search();
    }

    loadMore = () => {
        const { canLoadMore, onlyCurrentTab, search } = this.state;

        if (canLoadMore) {
            this.setState({ loadingMore: true, canLoadMore: false });
            var page = this.state.page + 1;
            var data = { ...this.props.search, page, search }
            this.props.actions.search(data)
                .then(data => {
                    this.setState({
                        // canLoadMore: data.total > (page + 1) * 20,
                        loadingMore: false,
                        loading: false,
                        result: [...this.state.result, ...data.items].filter((v, i, a) => a.indexOf(v) === i)
                    })
                })
                .catch(({ error, message }) => {
                    alert(error, message);
                    this.setState({ loadingMore: false });
                })
        }
    }

    switchType = () => {
        this.setState({ onlyCurrentTab: !this.state.onlyCurrentTab });
        this.search();
    }

    render() {
        if (!this.props.show) return null;

        return (
            <Modal
                supportedOrientations={['portrait', 'landscape']}
                onRequestClose={this.onRequestClose}
                animationType="fade"
                transparent={true}>
                <View style={styles.container}>
                    <View style={styles.box}>
                        <Toolbar
                            style={styles.toolbar}
                            icon={<Icon type='MaterialIcons' name='arrow-back' style={{ fontSize: 22 }} />}
                            iconColor='#000'
                            onIconPress={this.onRequestClose}
                            title={
                                <TextInput
                                    autoFocus={true}
                                    autoCapitalize='none'
                                    placeholder={this.props.searchPlaceholder || 'Tìm kiếm..'}
                                    multiline={false}
                                    underlineColorAndroid='transparent'
                                    onChangeText={this.onTyping}
                                    returnKeyType='search'
                                    onSubmitEditing={this.search}
                                    value={this.state.search}
                                    style={styles.searchInput} />
                            }
                            actions={[
                                {
                                    icon: <Icon type='MaterialIcons' name="search" style={{ fontSize: 22 }} />,
                                    onPress: this.search
                                }
                            ]}
                        ></Toolbar>
                        <View style={styles.options}>
                            <Text style={styles.optionLable}>Chỉ tìm kiếm trong tab hiện tại</Text>
                            <Switch
                                value={this.state.onlyCurrentTab}
                                onValueChange={this.switchType} />
                        </View>
                        <FlatList
                            data={this.state.result}
                            renderItem={({ item }) => this.renderItem(item)}
                            keyExtractor={item => 'ID' + item.id}
                            refreshControl={
                                <RefreshControl
                                    tintColor="#28cc54"
                                    title="Loading..."
                                    titleColor="#00ff00"
                                    colors={['#28cc54', '#00ff00', '#ff0000']}
                                    refreshing={this.state.refreshing}
                                    onRefresh={this.refresh}
                                />
                            }
                            onEndReached={this.loadMore}
                            ListFooterComponent={this.renderFooter()}
                        />
                        {
                            this.state.loading &&
                            <Loading />
                        }
                        {
                            this.state.result.length == 0 &&
                            <View style={styles.textNotResult}>
                                <Text>{__('Không có kết quả tìm kiếm phù hợp')}</Text>
                            </View>
                        }
                    </View>
                </View>
            </Modal>
        );
    }

    renderItem = (item) => {
        var fields = [
            { fieldName: 'Phone' },
            { fieldName: 'Email' }
        ]
        return (
            <CustomerListItem
                fields={fields}
                customer={item}
                hideActionButton={this.props.ios}
                showBox={this.props.showBox} />
        );
    }

    renderFooter = () => {
        return (
            <View style={styles.footer}>
                {
                    this.state.loadingMore &&
                    <ActivityIndicator />
                }
            </View>
        )
    }
}

export default connect(CustomerSearchBox, state => ({
    customers: state.customer.items,
}), { ...actions });

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //padding: 10,
        //backgroundColor: 'rgba(0,0,0,0.4)',
    },
    box: {
        flex: 1,
        backgroundColor: '#fff',
        //borderRadius: 4
    },
    toolbar: {
        elevation: 1,
        //shadowOpacity: 0,
        //shadowRadius: 0,
        backgroundColor: '#fff',
        //borderRadius: 4
    },
    searchInput: {
        fontSize: 16,
        marginLeft: 10,
        height: 35,
        paddingTop: 3,
        paddingBottom: 0
    },
    options: {
        backgroundColor: '#f9f9f9',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc',
        paddingHorizontal: 10,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    optionLable: {
        flex: 1,
        fontSize: 15
    },
    footer: {
        padding: 20,
        alignItems: 'center'
    },
    textNotResult: {
        justifyContent: 'center',
        alignItems: 'center'
    }
})