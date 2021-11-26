import React, { Component } from 'react';
// import Toast from 'react-native-simple-toast';
import { Icon, Toast } from 'native-base';
import { BackAndroid, Modal, StyleSheet, View, Text, ScrollView } from 'react-native';
import { RadioButtons } from 'react-native-radio-buttons';
import { connect } from '../../../lib/connect';
import * as actions from '../../../actions/customer';
import { getList as getListSort, updateSort } from '../../../actions/customviewsort';
import { getList as getListView } from '../../../actions/customview';
import { getList as getListCateCustomer } from '../../../actions/customercategory';
import { getList as getListUser } from '../../../actions/user';
import { getList as getListSource } from '../../../actions/customersource'
import { validateComponent } from '../../../lib/validate';
import Toolbar from '../../controls/toolbars';
import Menu from '../../controls/action-menu';
import RsTouchableNativeFeedback from '../../controls/touchable-native-feedback';

class CustomerViewFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            changed: false,
            // sort: {},
            fields: [],
            scrollEnabled: true,
            filter: {
                viewId: props.viewId || 0,
                fieldName: '',
                value: '',
                type: 1,
                typeQuery: 2,
                order: 1,
                isMeta: false,
            },
            sort: {
                viewId: props.viewId || 0,
                fieldName: 'Id',
                value: '',
                type: 1,
                order: 1,
                isMeta: false,
            },
            sortType: {
                ...this.props.sort,
            }
        };
    }

    componentDidMount() {
        this.getList();
    }

    // UNSAFE_componentWillReceiveProps(newProps) {
    //     if (newProps.view) {
    //         this.updateState(newProps);
    //     }
    // }

    getList = () => {
        if (!this.props.customViewSort.loaded) {
            this.props.actions.getListSort()
                .then(data => {
                })
                .catch(error => {
                    alert(error.error, error.message, 'error');
                });
        }
        else {
            this.props.actions.getListSort();
        }
        if (!this.props.customerCategory.loaded) {
            this.props.actions.getListCateCustomer()
                .then(data => {
                })
                .catch(error => {
                    alert(error.error, error.message, 'error');
                });
        }
        if (!this.props.user.loaded) {
            this.props.actions.getListUser()
                .then(data => {
                })
                .catch(error => {
                    alert(error.error, error.message, 'error');
                });
        }
        if (!this.props.customerSource.loaded) {
            this.props.actions.getListSource()
                .then(data => {
                })
                .catch(error => {
                    alert(error.error, error.message, 'error');
                });
        }
    }

    setSort = (data) => {
        this.setState({
            sort: { ...this.state.sort, ...data }
        })
        this.props.setSortRows({ data });
    }

    setOrder = (item) => {
        this.setState({
            sort: { ...this.state.sort, ...item }
        })
        this.props.setSortRows({ item });
    }

    onRequestClose = () => {
        this.props.onRequestClose();
    }

    onUpdate = () => {
        // var model = this.state.sort;
        // // console.log('model', model);

        // let ok = validateComponent(model);
        // if (ok) {
        //     this.setState({ loading: true });
        //     this.props.actions.updateSort(model)
        //         .then(data => {
        //             this.onRequestClose();
        //             Toast.show(__('Đã lưu mới sắp xếp'));
        //             this.props.actions.getList();
        //         })
        //         .catch(error => {
        //             this.setState({ loading: false });
        //             alert(error.error, error.message, 'error');
        //         });
        // }
        //#Set Onchange
        this.props.onChange({ sort: { ...this.state.sort }, filter: this.state.filter });
        this.props.saveFilter();
        this.onRequestClose();
    }

    onDragStart = () => {
        this.setState({ scrollEnabled: false });
    }

    onDragRelease = (rows) => {
        this.setState({ scrollEnabled: true });
    }
    render() {
        var item = this.props.sort;
        if (!this.props.show || !this.props.view) return null;
        var viewFields = this.props.customView.items.filter(t => t.applyFor == this.props.applyFor && t.type == 7);
        var details = [];

        if (viewFields && viewFields.length > 0) {
            details = viewFields[0].details;
        }

        const orderArr = [
            { ...item, type: 1, label: 'Tăng dần (A-Z)' },
            { ...item, type: 2, label: 'Giảm dần (Z-A)' }
        ]

        return (
            <Modal style={styles.filter}
                supportedOrientations={['portrait', 'landscape']}
                onRequestClose={this.onRequestClose}
                animationType="fade"
                transparent={true}>
                <Menu.MenuContext style={styles.container}>
                    <Toolbar
                        style={styles.toolbar}
                        icon={<Icon type='MaterialIcons' name='arrow-back' size={22} />}
                        iconColor='#000'
                        onIconPress={this.onRequestClose}
                        titleText='Tùy chỉnh hiển thị khách hàng'
                        titleColor='#000'
                    ></Toolbar>


                    <ScrollView style={styles.scrollView} scrollEnabled={this.state.scrollEnabled}>

                        {/* Kiểu sắp xếp */}

                        <View style={styles.formGroup}>
                            <Text style={styles.title}>{__('Kiểu sắp xếp')}</Text>
                            <RadioButtons
                                // options={orderByArr}
                                options={details}
                                onSelection={option => this.setSort(
                                    {
                                        id: item.id,
                                        viewId: item.viewId,
                                        fieldName: option.fieldName,
                                        value: item.value,
                                        // type: item.value,
                                        isMeta: option.isMeta,

                                        // fieldName: option.fieldName,
                                        // isMeta: option.isMeta,

                                    })}
                                selectedOption={this.state.sort.fieldName}
                                testOptionEqual={(selectedValue, option) => selectedValue === option.fieldName}
                                renderOption={(option, selected, onSelect, index) => (
                                    <RsTouchableNativeFeedback onPress={onSelect} key={index}>
                                        <View style={styles.radio}>
                                            <Icon type='MaterialIcons' style={styles.radioIcon} name={selected ? 'radio-button-checked' : 'radio-button-unchecked'} />
                                            <Text style={styles.radioText}>{option.label}</Text>
                                        </View>
                                    </RsTouchableNativeFeedback>
                                )}
                                renderContainer={RadioButtons.renderVerticalContainer}
                            />


                        </View>

                        {/* Thứ tự sắp xếp */}
                        <View style={styles.formGroup}>
                            <Text style={styles.title}>{__('Thứ tự sắp xếp')}</Text>
                            <RadioButtons
                                options={orderArr}
                                onSelection={option => this.setOrder(
                                    {
                                        id: option.id,
                                        viewId: option.viewId,
                                        fieldName: option.value,
                                        value: option.value,
                                        type: option.type,
                                        isMeta: option.isMeta,
                                    })}
                                selectedOption={this.state.sort.type}
                                testOptionEqual={(selectedValue, option) => selectedValue === option.type}
                                renderOption={(option, selected, onSelect, index) => (
                                    <RsTouchableNativeFeedback onPress={onSelect} key={index}>
                                        <View style={styles.radio}>
                                            <Icon type='MaterialIcons' style={styles.radioIcon} name={selected ? 'radio-button-checked' : 'radio-button-unchecked'} />
                                            <Text style={styles.radioText}>{option.label}</Text>
                                        </View>
                                    </RsTouchableNativeFeedback>
                                )}
                                renderContainer={RadioButtons.renderVerticalContainer}
                            />
                        </View>
                    </ScrollView>

                    <RsTouchableNativeFeedback onPress={this.onUpdate} >
                        <View style={styles.footer}>
                            <Icon type='MaterialIcons' name="done" size={26} style={styles.footerText} />
                            <Text style={styles.footerText}>{__('ÁP DỤNG')}</Text>
                        </View>
                    </RsTouchableNativeFeedback>
                </Menu.MenuContext>
            </Modal>
        );
    }
}

export default connect(CustomerViewFilter, state => ({
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
        flex: 1,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333',
        paddingVertical: 10
    },
    divider: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#ccc',
        marginVertical: 10
    },
    radio: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5
    },
    radioIcon: {
        fontSize: 20,
        color: '#02a8f3'
    },
    radioText: {
        marginLeft: 15
    },
    footer: {
        elevation: 1,
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
    footerText: {
        color: 'green'
    },
    field: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10
    },
    defaultField: {
        backgroundColor: '#f4f4f4',
        marginVertical: 2,
        justifyContent: 'center',
        padding: 14
    },
    rowStyle: {
        backgroundColor: '#e9e9e9',
        marginVertical: 2,
    },
    activeRowStyle: {
        backgroundColor: '#e0e0e0',
        transform: [
            { scale: 0.95 }
        ]
    },
    dragHandle: {
        marginRight: 20
    },
    removeField: {
        padding: 5,
    },
    fieldText: {
        flex: 1
    }
})