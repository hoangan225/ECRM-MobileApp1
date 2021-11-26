
import React, { Component } from 'react';
import { BackAndroid, Modal, StyleSheet, View, Text, TextInput, ScrollView } from 'react-native';
import { Icon, Toast } from 'native-base';
// import Toast from 'react-native-simple-toast';
import Toolbar from '../../controls/toolbars';
import Loading from '../../controls/loading';
import { connect } from '../../../lib/connect';

import * as actions from '../../../actions/customviewfilter';
import { getList as getListSort, updateSort } from '../../../actions/customviewsort';
import { getList as getListView } from '../../../actions/customview';
import { getList as getListCateCustomer } from '../../../actions/customercategory';
import { getList as getListUser } from '../../../actions/user';
import { getList as getListSource } from '../../../actions/customersource'

import { validateComponent } from '../../../lib/validate';
import RsTouchableNativeFeedback from '../../controls/touchable-native-feedback';
import CustomerDataFilterItem from './customerPartDataFilterItem';

class CustomerDataFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            changed: false,
            filters: [...this.props.filters],
            loading: false,
            viewId: this.props.viewId
        };

        this.fields = [];
        this.filters = [];
    }

    componentDidMount() {
        if (!this.props.customView.loaded) {
            this.refresh();
        }
        // if (this.filters && this.filters.length > 0) {
        //     this.state.filters.concat(this.filters);
        // }

    }

    renderSingle = (filter, index) => {
        return filter;
        // this.filters = [
        //     ...this.state.filters,
        //     {
        //         viewId: this.props.viewId || 0,
        //         fieldName: filter.fieldName,
        //         value: filter.value,
        //         type: filter.type,
        //         typeQuery: filter.typeQuery,
        //         order: filter.order,
        //         isMeta: filter.isMeta,
        //     }
        // ]
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        var customView = this.props.customView;
        if (customView && customView.items) {
            viewFilter = customView.items.filter(t => t.applyFor == this.props.applyFor && t.type == 5);
            if (viewFilter && viewFilter.length > 0) {
                viewFilter = viewFilter[0].details.sort((t1, t2) => t1.order - t2.order);
            }
            if (viewFilter && viewFilter.length > 0) {
                var dismiss = ["IsRecommender", "Categories", "ManagerId", "IsCompany"];
                viewFilter = viewFilter.filter(t => !dismiss.contains(t.fieldName))
            }
            viewFilter.filter(t => !t.isMeta).map(u => ({
                fieldName: u.fieldName,
                label: u.label
            }))
            this.fields = viewFilter
            // details = viewFilter.map((tem) => {
            //     this.fields = tem.details
            // })
            if (this.props.applyFor == 'Customer') {
                this.fields = [...this.fields,
                // this.fields.push(
                {
                    fieldName: 'CategoryId',
                    label: 'Tên nhóm KH',
                    isMeta: false,
                },
                {
                    fieldName: 'Category',
                    label: 'Từ khóa nhóm KH'
                },
                {
                    fieldName: 'SourceId',
                    label: 'Tên nguồn KH',
                    isMeta: false,
                },
                {
                    fieldName: 'Source',
                    label: 'Từ khóa nguồn KH'
                },

                {
                    fieldName: 'ManagerId',
                    label: 'Tên người phụ trách',
                    isMeta: false,
                },
                {
                    fieldName: 'Manager',
                    label: 'Từ khóa người phụ trách'
                },
                {
                    fieldName: 'CompanyId',
                    label: 'Tên công ty',
                    isMeta: false,
                },
                {
                    fieldName: 'Company',
                    label: 'Từ khóa công ty'
                }
                    // )
                ]
            }


        }

        this.setState({
            ...this.state,
            filters: [...newProps.filters]
        })

    }

    setFilterTypeQuery = (item) => {
        this.props.setFilterTypeQuery(item);
    }

    setFilterSelect = (item) => {
        this.props.setFilterSelect(item);
    }

    setFilterValue = (item) => {
        this.props.setFilterValue(item);
    }



    // addFilter = () => {
    //     this.state.changed = true;
    //     this.state.filters.push({
    //         type: 1,
    //         typeQuery: 2,
    //         order: 1,
    //     });
    // }

    addFilter = () => {

        this.setState({
            changed: true,
            ...this.state,
            filters: [
                ...this.state.filters,
                {
                    viewId: this.props.viewId || 0,
                    fieldName: '',
                    value: '',
                    type: 1,
                    typeQuery: 1,
                    order: 1,
                    isMeta: false,
                }
            ]
        })

    }


    removeFilter = (index, item) => {
        this.state.changed = true;
        this.state.filters.splice(index, 1);
        this.forceUpdate();
        this.props.removeFilter({ fieldName: item.fieldName, index: item.index })
    }

    // removeFilter = (item) => {
    //     // console.log(item);

    //     this.props.removeFilter({ fieldName: item.fieldName, index: item.id })

    // }

    updateFilter = (index, filter) => {

        if (filter.valueText) {
            this.props.setFilterValue(filter);
        } else {
            this.props.setFilterSelect(filter);
        }
        this.state.changed = true;
        // this.state.filters[index] = filter;
    }

    onUpdate = () => {
        this.props.saveFilter();

        this.setState({ changed: false });
        this.onRequestClose();

    }

    refresh = () => {
        this.setState({ loading: true });
        this.props.actions.getList()
            .then(data => {
                this.setState({ loading: false });
            })
            .catch(error => {
                this.setState({ loading: false });
                alert(error.error);
            });
    }

    onRequestClose = () => {

        this.props.onRequestClose();
    }

    render() {
        // // console.log('this.filters', this.state.filters);

        var filters = this.props.filters;
        if (filters && filters.length > 0) {
            filters = filters.sort((t1, t2) => t1.order - t2.order);
            filters.map((filter, index) => {
                return this.renderSingle(filter, index);
            })
        }
        const listFlt = this.state.filters.concat(filters)
        // // console.log('this.filters', filters);
        // // console.log(this.props.view, "33")
        if (!this.props.show) return null;

        return (
            <Modal style={styles.filter}
                supportedOrientations={['portrait', 'landscape']}
                onRequestClose={this.onRequestClose}
                animationType="fade"
                transparent={true}>
                <View style={styles.container}>
                    <Toolbar
                        style={styles.toolbar}
                        icon={<Icon type='MaterialIcons' name='arrow-back' style={{ fontSize: 22 }} />}
                        iconColor='#000'
                        onIconPress={this.onRequestClose}
                        titleText='Lọc dữ liệu khách hàng'
                        titleColor='#000'
                    ></Toolbar>

                    <ScrollView style={styles.scrollView} keyboardShouldPersistTaps='always'>
                        <Text style={styles.title}></Text>
                        {

                            this.state.filters.map((item, index) => (
                                // listFlt.map((item, index) => (
                                item.viewId == this.props.view.viewId &&
                                <CustomerDataFilterItem
                                    key={index}
                                    index={index}
                                    data={item}
                                    fields={this.fields}
                                    removeFilter={this.removeFilter}
                                    updateFilter={this.updateFilter}
                                    addValue={this.addValue}
                                    viewId={this.props.viewId}
                                    filters={filters}
                                    setFilterValue={this.setFilterValue}
                                    setFilterSelect={this.setFilterSelect}
                                    setFilterTypeQuery={this.setFilterTypeQuery}
                                />
                            ))

                        }
                        <RsTouchableNativeFeedback onPress={this.addFilter}>
                            <View style={styles.addFilter}>
                                <Icon type='MaterialIcons' name="add" style={{ fontSize: 38 }} />
                            </View>
                        </RsTouchableNativeFeedback>
                    </ScrollView>
                    <RsTouchableNativeFeedback onPress={this.onUpdate} >
                        <View style={styles.footer}>
                            <Icon type='MaterialIcons' name="done" style={styles.footerText} />
                            <Text style={styles.footerText}>{__('ÁP DỤNG')}</Text>
                        </View>
                    </RsTouchableNativeFeedback>
                </View>
            </Modal>
        );
    }
}

export default connect(CustomerDataFilter, state => ({
    customView: state.customview,
    customerCategory: state.customerCategory,
    user: state.user,
    customerSource: state.customerSource,
    customViewSort: state.customViewSort,
    customer: state.customer,
    product: state.product,
    contract: state.contract,
    customViewFilter: state.customViewFilter,
    fields: state.app.fields,
    filterType: state.app.enums.filterType,
    typeQuery: state.app.enums.typeQuery,
    viewType: state.app.enums.viewType,
    sortType: state.app.enums.sortType,
    customField: state.customField
}), { ...actions, getListSort, getListCateCustomer, getListUser, getListSource, updateSort, getListView });


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    toolbar: {
        backgroundColor: '#fff',
        elevation: 1,
    },
    scrollView: {
        paddingHorizontal: 10,
        paddingBottom: 160,
        backgroundColor: '#fff'
    },
    title: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333',
        paddingVertical: 10
    },
    addFilter: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        backgroundColor: '#f9f9f9'
    },
    footer: {
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: '#f2f2f2',
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        //borderBottomLeftRadius: 4,
        //borderBottomRightRadius: 4,
    },
    footertext: {
        fontSize: 26,
        color: 'green'
    },
    searchInput: {
        fontSize: 16
    }
})