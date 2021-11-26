// import Constants from 'expo-constants'
// import { Container, Icon, Toast } from 'native-base';
// import React from 'react';
// import { Alert, Dimensions, Platform, StatusBar, StyleSheet } from 'react-native';
// import ActionButton from 'react-native-action-button';
// import { TabBar, TabView } from 'react-native-tab-view';
// import { DrawerActions } from 'react-navigation';
// // import Toast from 'react-native-simple-toast';
// import * as actions from '../../../actions/customer';
// import { getList as getListCateCustomer } from '../../../actions/customercategory';
// import { getList as getListSource } from '../../../actions/customersource';
// import { getList as getListField } from '../../../actions/customfield';
// import { createdetail as createdetailView, getList as getListView, remove as removeView, updateDetail as updateDetailView, updateList } from '../../../actions/customview';
// import { getList as getListFilter } from '../../../actions/customviewfilter';
// import { getList as getListUser } from '../../../actions/user';
// import { connect } from '../../../lib/connect';
// import MenuContext from '../../controls/menuContext';
// import Prompt from '../../controls/prompt';
// import Toolbar from '../../controls/toolbars';
// // import FormCreateView from '../../customerview/create';
// // import FormEditView from '../../customerview/edit';
// import CustomerListNew from '../components/customerPartListNew';
// import MyStatusBar from './../../statusBar/MyStatusBar';
// import ActionSheet from './customerBoxActionSheet';
// import CustomerBox from './customerPartBox';
// import CustomerDataFilter from './customerPartDataFilter';
// import CustomerList from './customerPartList';
// import CustomerSearchBox from './customerPartSearch';
// import CustomerViewFilter from './customerSortDisplay';
// var details = [
//     { id: 0, fieldName: "FullName", viewId: 0, label: __("Họ tên"), order: 1, isMeta: false },
//     { id: 0, fieldName: "Birthdate", viewId: 0, label: __("Ngày sinh"), order: 2, isMeta: false },
//     { id: 0, fieldName: "Phone", viewId: 0, label: __("Điện thoại"), order: 3, isMeta: false },
//     { id: 0, fieldName: "Address", viewId: 0, label: __("Địa chỉ"), order: 4, isMeta: false },
//     { id: 0, fieldName: "CategoryId", viewId: 0, label: __("Nhóm khách hàng"), order: 5, isMeta: false }
// ];
// var branchId = context.currentBranchId;
// this.state = {
//     loading: false,
//     currentCustomer: null,
//     currentBox: null,
//     currentViewIndex: 0,
//     showFilter: null,
//     promptTitle: "no title",
//     promptPlaceholder: null,
//     promptViewId: null,
//     ready: false,
//     applyFor: 'Customer',
//     search: {
//         page: 1,
//         pageSize: 20,
//         search: '',
//         getAll: false,
//         applyFor: 'Customer',
//         viewId: 0,
//         branchId: branchId,
//         filters: [],
//         sort: {
//             viewId: 0,
//             fieldName: 'Id',
//             value: '',
//             type: 1,
//             order: 1,
//             isMeta: false,
//         },
//         details: [],
//         typeBirhday: '',
//         eventValue: '',
//         eventName: ''
//     },
//     showFilters: false,
//     viewNew: {
//         filter: [],
//         details: details,
//         items: []
//     }

// }
// this.routes = [];
// var user = this.context.user;
// //Danh mục 
// this.canGetListCateCustomer = user.hasCap("CustomerCategory.Manage");
// this.canGetListSource = user.hasCap("CustomerSource.Manage");
// //Customer
// this.canList = user.hasCap("Customer.Manage", this.context.currentBranchId);
// this.canload = context.currentBranchId;
//     }

// setFilter = (data) => {
//     this.setState({
//         search: {
//             ...this.state.search,
//             filter: {
//                 ...this.state.search.filter, ...data
//             }
//         }
//     });
// }

// onChangeFilter = (data) => {
//     this.applySearch({ filter: data.filter, sort: data.sort }, false);
// }

// setSortRows = (item) => {
//     this.applySearch({ sort: item }, false);
// }

// onSearch = search => {
//     this.applySearch({ search }, false);
// }

// componentDidMount() {
//     this.props.actions.getListView({ applyFor: 'Customer' }).then(data => {
//         // this.preload = true;
//         this.updateView(data);
//     });
//     this.refresh();
//     this.getList();
// }

// UNSAFE_componentWillReceiveProps(props) {
//     this.sortView(false, props);
// }

// refresh = (isRefresh) => {
//     this.setState({ loading: true });
//     if ((!!isRefresh)) {
//         // console.log('isrefresh customer nt')
//         this.setState({
//             ...this.state,
//             search: {
//                 ...this.state.search,
//                 page: 1,
//                 pageSize: 20
//             }
//         })
//         this.props.actions.getListView()
//             .then(() => {
//                 var viewId = 0;
//                 viewId = this.sortView(true);
//                 if (viewId && viewId.length > 0) {
//                     viewId = viewId[0].id;
//                 }
//                 this.showBox(null)
//                 this.applySearch({ viewId: viewId, page: this.state.search.page, pageSize: this.state.search.pageSize, }, false);
//             })
//             .catch(({ error, message }) => {
//                 Toast.show(message, 'danger');
//                 this.setState({ loading: false });
//                 this.showBox(null)
//             });
//         this.props.actions.getListField()
//             .then(() => {
//                 this.setState({ loading: false });
//                 this.showBox(null)
//             })
//             .catch(({ error, message }) => {
//                 Toast.show(message, 'danger');
//                 this.setState({ loading: false });
//                 this.showBox(null)
//             });
//     }
//     else {
//         this.setState({ loading: false });
//     }

// }

// refreshTab = (viewId, view) => {
//     var filters = [];
//     var details = [];
//     var sorts = [];
//     var customViews = this.props.customview.items.filter(t => t.id == viewId);
//     if (customViews && customViews.length > 0) {
//         filters = customViews[0].filters;
//         //  details = customViews[0].details;
//     }
//     if (view) {
//         details = view.details;
//         filters = view.filters;
//     }
//     var search = {
//         viewId: viewId,
//         filters: [...filters],
//         sort: {
//             ...this.state.search.sort,
//             viewId: viewId
//         },

//         // details: details
//     };
//     this.props.actions.getlist({ ...search });

// }

// refreshFilter = (data) => {
//     this.applySearch(data);
// }

// applySearch = (data, isTab) => {
//     var search = { ...this.state.search, ...data };
//     this.setState({ search });
//     if (isTab && this.canList) {
//         var found = this.props.customer.views.filter(t => t.viewId == data.viewId);
//         if ((!found) || found.length == 0) {
//             this.setState({ loading: true });
//             this.props.actions.getlist({ ...search })
//                 .then(() => {
//                     this.setState({ loading: false });
//                 }).catch(({ error, message }) => {
//                     Toast.show(message, 'danger');
//                     this.setState({ loading: false });
//                 });
//         }

//     }
//     else {
//         this.setState({ loading: true });
//         if (data.filters) {
//             if (this.searchTimer) {
//                 clearTimeout(this.searchTimer);
//             }
//             this.searchTimer = setTimeout(() => {
//                 if (this.canList) {
//                     this.props.actions.getlist({ ...search })
//                         .then(() => {
//                             this.setState({ loading: false });
//                         }).catch(({ error, message }) => {
//                             Toast.show(message, 'danger');
//                             this.setState({ loading: false });
//                         });
//                 }
//                 else {
//                     this.setState({ loading: false });
//                 }
//             }, 800);


//         } else {
//             // console.log('applysearch cú nav');

//             this.props.actions.getlist({ ...search })
//                 .then(() => {
//                     this.setState({ loading: false });
//                 }).catch(({ error, message }) => {
//                     Toast.show(message, 'danger');
//                     this.setState({ loading: false });
//                 });
//         }
//     }
// }

// refreshField = () => {
//     this.setState({ loading: true });
//     if (!this.props.customField.loaded) {
//         this.props.actions.getListField()
//             .catch(({ error, message }) => {
//                 Toast.show(message, 'danger');
//                 // toast(message, 'danger');
//                 this.setState({ loading: false });
//             })
//             .then(() => {
//                 this.setState({ loading: false });
//             });
//     }
//     else {
//         this.setState({ loading: false });
//     }

// }

// getList = () => {
//     if (!this.props.customerCategory.loaded && this.canGetListCateCustomer) {
//         this.setState({ loading: true });
//         this.props.actions.getListCateCustomer()
//             .then(() => {
//                 this.setState({ loading: false });
//             })
//             .catch(({ error, message }) => {
//                 Toast.show(message, 'danger');
//                 this.setState({ loading: false });
//             });
//     }

//     if (!this.props.user.loaded) {
//         this.setState({ loading: true });
//         this.props.actions.getListUser()
//             .then(() => {
//                 this.setState({ loading: false });
//             })
//             .catch(({ error, message }) => {
//                 Toast.show(message, 'danger');
//                 this.setState({ loading: false });
//             });
//     }

//     if (!this.props.customerSource.loaded && this.canGetListSource) {
//         this.setState({ loading: true });
//         this.props.actions.getListSource()
//             .then(() => {
//                 this.setState({ loading: false });
//             })
//             .catch(({ error, message }) => {
//                 Toast.show(message, 'danger');
//                 this.setState({ loading: false });
//             });
//     }
// }

// onPageChange = (page) => {
//     this.applySearch({ page }, false);
// }

// onPageSizeChange = pageSize => {
//     this.applySearch({ pageSize: pageSize, page: 1 }, false);
// }

// updateView = (data) => {
//     //Khởi tạo biến
//     var viewId = 0;
//     var filters = [];
//     var details = [];
//     var sorts = [];
//     var views = this.sortView();
//     if (views && views.length > 0) {
//         viewId = views[0].id;
//     }
//     var customViews = (data || this.props.customview).items.filter(t => t.id == viewId);
//     if (customViews && customViews.length > 0) {
//         filters = customViews[0].filters;
//         details = customViews[0].details;
//         sorts = customViews[0].sorts;
//     }
//     //lấy page hiện tại của ViewId tương ứng
//     var page = 1;
//     var found = this.props.customer.views.filter(t => t.viewId == viewId);
//     if (found && found.length > 0) {
//         page = found[0].page || 1;
//     }
//     this.applySearch({
//         page: page,
//         viewId: viewId,
//         branchId: this.context.user.currentBranchId,
//         filters: [...filters],
//         sort: (sorts && sorts.length > 0) ? sorts[0] : {
//             ...this.state.search.sort,
//             viewId: viewId
//         },
//         details: details
//     });
// }

// // handleChangeTab = (index) => {
// //     this.setState({
// //         currentViewIndex: index
// //     });

// // };
// handleChangeTab = (index) => {
//     // console.log('index', index);

//     var oldViewId = this.state.search.viewId;
//     var viewId = 0;
//     this.props.actions.getListView({ applyFor: 'Customer' });
//     //gán view, viewId cho state
//     var views = this.sortView();
//     // // console.log(views, "view=================filter");

//     if (views && views.length > 0) {
//         var filters = [];
//         var details = [];
//         var sorts = [];
//         if (index != this.state.currentViewIndex) {
//             var viewList = this.props.customview.items;
//             if (viewList && viewList.length) {
//                 viewList = viewList.filter(t => t.id == views[index].id);
//                 if (viewList && viewList.length) {
//                     filters = viewList[0].filters;
//                     details = viewList[0].details;
//                     sorts = viewList[0].sorts;
//                 }
//             }
//         }
//         viewId = views[index].id;
//         this.setState({
//             ...this.state,
//             currentViewIndex: index,
//             view: views[index],
//             search: {
//                 ...this.state.search,
//                 filters: filters && filters.length > 0 ? [...filters] : [],
//                 sort: {
//                     ...this.state.search.sort,
//                     viewId: viewId
//                 },
//                 details: details
//             },
//             showNewTab: false,
//             showFilters: false,
//             oldViewId: oldViewId
//         }, () => {
//             this.applySearch({ viewId: views[index].id }, true)
//         });

//     } else {

//         this.setState({ currentViewIndex: index, showNewTab: false, showFilters: false, oldViewId: oldViewId });
//     }
//     if (this.state.showFilters) {
//         this.refreshTab(oldViewId);
//     }
//     if (viewId != oldViewId && this.state.search.search != '') {
//         this.applySearch({ search: '' });
//     }

//     var lstCustomer = this.props.customer;
//     if (lstCustomer && lstCustomer.length > 0) {
//         lstCustomer = lstCustomer.views;
//         if (lstCustomer && lstCustomer.length > 0) {
//             lstCustomer = lstCustomer.filter(t => t.viewId == viewId);
//             if (lstCustomer && lstCustomer.length > 0) {
//                 lstCustomer = lstCustomer[0].items;
//             }
//         }
//     }
//     if ((!lstCustomer) || (lstCustomer.lenght == 0)) {
//         this.updateView();
//     }

// }

// total = () => {
//     if (this.sortView()) {
//         return this.sortView().total;
//     }

// }

// showMenu = () => {
//     // this.props.navigation.openDrawer()
//     this.props.navigation.dispatch(DrawerActions.openDrawer());
// }

// showFilter = (filter, filterviewid = null) => {
//     this.showBox(null, null, () => {
//         this.setState({
//             showFilter: filter,
//             filterViewId: filterviewid
//         })
//     });
// }

// createView = () => {
//     this.showBox(null, null, () => {
//         this.setState({
//             promptTitle: "Thêm view mới",
//             promptPlaceholder: "Nhập tên view mới",
//             promptViewId: null,
//             showFilter: "name"
//         })
//     });

// }

// renameView = (id) => {
//     this.showBox(null, null, () => {
//         this.setState({
//             promptTitle: "Đổi tên view",
//             promptPlaceholder: "Nhập tên view mới",
//             promptViewId: id,
//             showFilter: "name"
//         })
//     })
// }

// setViewName = (name) => {
//     if (name) {
//         if (this.state.promptViewId) {
//             this.props.actions.updateList(name)
//                 .then(data => {
//                     this.showBox(null)

//                     Toast.show({
//                         text: 'Cập nhật view thành công',
//                         duration: 2500,
//                         position: 'bottom',
//                         textStyle: { textAlign: 'center' },
//                         
//                     });
//                 })
//                 .catch(error => {
//                     this.showBox(null)
//                     alert(error.error, error.message, 'error');

//                 })
//         }
//         else {
//             this.props.actions.createdetailView(name)
//                 .then(data => {
//                     this.showBox(null)

//                     Toast.show({
//                         text: 'Thêm mới view thành công',
//                         duration: 2500,
//                         position: 'bottom',
//                         textStyle: { textAlign: 'center' },
//                         
//                     });
//                 })
//                 .catch(error => {
//                     this.showBox(null)
//                     Toast.show(error.error, error.message, 'error');
//                 })
//         }
//     }
//     this.showFilter(null);
// }



// showBox = (customer, box = null, cb = null) => {
//     if (cb) {
//         this.setState({ currentCustomer: customer, currentBox: box }, () => {
//             setTimeout(cb, 300);
//         });
//     }
//     else {
//         this.setState({ currentCustomer: customer, currentBox: box });
//     }
// }

// open = () => {
//     this.setState({ currentBox: 'details' });
// }

// edit = () => {
//     this.setState({ currentBox: 'edit' });
// }

// delete = () => {
//     Alert.alert(
//         'Xóa khách hàng',
//         'Bạn có chắc chắn muốn xóa không?',
//         [
//             { text: '', onPress: () => // console.log('Ask me later pressed') },
//             { text: 'Cancel', onPress: () => // console.log('Cancel Pressed'), style: 'cancel' },
//             {
//                 text: 'OK', onPress: () => {
//                     var id = this.state.currentCustomer.id;
//                     this.setState({ currentCustomer: null });
//                     this.props.actions.remove(id)
//                         .then(() => {

//                             Toast.show({
//                                 text: 'Xóa thành công',
//                                 duration: 2500,
//                                 position: 'bottom',
//                                 textStyle: { textAlign: 'center' },
//                                 
//                             });
//                         })
//                         .catch(({ error, message }) => {
//                             alert(error, message);
//                         })
//                 }
//             },
//         ],
//         { cancelable: false }
//     )

// }

// sortView = (first, props) => {

//     var userId = this.context.user.id;
//     var routes = (props || this.props).customview.items
//         .filter(t => t.applyFor == this.state.applyFor && t.type == 3 && t.userId == userId)
//         .sort((t1, t2) => t1.order - t2.order);
//     // var routes = (props || this.props).customview.items
//     //     .filter(t => t.applyFor == this.state.applyFor && t.type == 3)
//     //     .sort((t1, t2) => t1.order - t2.order);
//     if ((!!first) && routes && routes.lenght > 0) {
//         this.setState({ view: routes[0] });
//         this.setFilter({ viewId: routes[0].id })
//     }

//     if (this.props.customer.itemnews && this.props.customer.itemnews.length > 0) {
//         var newTab = {
//             name: __('Vừa thêm'),
//             id: 0,
//             icon: 'blur',
//             order: 0,
//             index: 0,
//             viewId: 0,
//             key: 'new'
//         };
//         routes = [newTab, ...routes];
//     }
//     routes = routes.map((item, index) => ({
//         title: item.name,
//         key: 'Tab' + item.id,
//         icon: 'blur',
//         order: item.order,
//         index: index,
//         viewId: item.id,
//         hasFilter: true,
//         id: item.id
//     }));
//     this.routes = routes;
//     return routes;
//     // return routes;
// }

// deleteView = (viewId) => {
//     // console.log('deleteviewid', viewId);

//     if (this.sortView().lenght == 1 || viewId == 0) {
//         alert(__('Không thể xóa view mặc định'), 'warning');
//         return false;
//     }
//     if (this.sortView().lenght <= 1) {
//         return false;
//     }
//     Alert.alert(
//         'Xóa view',
//         'Bạn có chắc chắn muốn xóa không',
//         [
//             { text: 'Cancel', onPress: () => { this.showBox(null) } },
//             {
//                 text: 'OK', onPress: () => {
//                     this.showBox(null);
//                     this.setState({ currentDeleteItemId: viewId });
//                     this.props.actions.removeView(viewId)
//                         .then(() => {
//                             // this.showBox(null);
//                             // Toast.show("Xóa thành công");
//                             // this.setState({ currentDeleteItemId: null });
//                             this.refresh(true);
//                             Toast.show({
//                                 text: 'Xóa thành công',
//                                 duration: 2500,
//                                 position: 'bottom',
//                                 textStyle: { textAlign: 'center' },
//                                 
//                             });
//                             this.setState({ currentDeleteItemId: null, currentViewIndex: 0, showFilter: false });

//                             var views = this.sortView();
//                             if (views && views.length > 0) {
//                                 views = views[0].id;
//                             }
//                             if (views) {
//                                 this.applySearch({ viewId: views });
//                             }
//                         })
//                         .catch(error => {
//                             this.showBox(null);
//                             alert(error.error, error.message, 'danger');
//                             this.setState({ currentDeleteItemId: null });
//                         });
//                 }
//             },
//         ],
//         { cancelable: false }
//     )
// }

// getActionMenu = () => {
//     return [
//         {
//             icon: <Icon type='MaterialIcons' name='search' style={{ fontSize: 22, color: '#fff', paddingRight: 5 }} />,
//             onPress: () => this.showFilter('search')
//         },
//         {
//             icon: <Icon type='MaterialIcons' name='more-vert' style={{ fontSize: 22, color: '#fff' }} />,
//             menuItem: { icon: <Icon type='MaterialIcons' name='more-vert' style={{ fontSize: 22, color: '#fff', padding: 5 }} /> }
//         }
//     ];
// }

// loadTab = (router) => {
//     // console.log(router);
// }


// render() {
//     // // console.log('this.sortView()', this.sortView());

//     this.routes = this.sortView().map((item, index) => ({
//         title: item.title,
//         key: 'Tab' + item.id,
//         icon: item.icon,
//         order: item.order,
//         index: item.index,
//         viewId: item.viewId
//     })

//     )
//     // // console.log('indexTab', this.state.search.filters);
//     const currentView = this.sortView()[this.state.currentViewIndex];
//     // // console.log('currentView', currentView);
//     // const currentView = this.props.customview.items[this.state.currentViewIndex];
//     const fields = this.props.customview.fields;
//     var customFields = this.props.customField.items;
//     var fieldEvent = {};
//     if (customFields && customFields.length > 0) {
//         fieldEvent = customFields.filter(t => t.type == 22);
//     }
//     const routes = {
//         // routes: this.props.customview.items,
//         index: this.state.currentViewIndex,
//         routes: this.routes
//     }
//     // // console.log('curent', currentView);
//     const ios = Platform.OS === 'ios';
//     const actions = this.getActionMenu();
//     return (
//         <Container style={styles.container}>
//             {Platform.OS === 'ios' ? <StatusBar backgroundColor='#3a993d' barStyle='light-content' /> : <MyStatusBar backgroundColor='#3a993d' barStyle='light-content' />}
//             <Toolbar
//                 noShadow
//                 icon={<Icon type='MaterialIcons' name="menu" style={{ fontSize: 22, color: '#fff' }} />}
//                 actions={actions}
//                 onIconPress={this.showMenu}
//                 titleText={__('Khách hàng')}
//                 style={styles.toolbar}
//                 onPressMore={() => this.showBox({}, 'menucontext')}
//             ></Toolbar>
//             {
//                 routes.routes.length > 0 &&
//                 <TabView
//                     style={styles.container}
//                     navigationState={routes}
//                     renderScene={this.renderView}
//                     renderTabBar={this.renderViewHeader}
//                     onIndexChange={this.handleChangeTab}
//                     initialLayout={{ height: 0, width: Dimensions.get('window').width }}
//                 />
//             }
//             {
//                 // this.loadTab(routes)
//             }
//             <ActionButton onPress={() => this.showBox({}, 'create')} buttonColor="#4CAF50" />
//             <CustomerBox
//                 show={this.state.currentCustomer != null && this.state.currentBox != "actionSheet"}
//                 box={this.state.currentBox}
//                 entry={this.state.currentCustomer}
//                 onRequestClose={() => this.showBox(null)}
//                 applyFor={this.state.applyFor}
//                 title={this.state.title}
//                 viewId={this.state.search.viewId}
//                 showEdit={() => this.edit()}
//             // showBox={() => this.showBox(item, edit)}
//             />

//             <CustomerDataFilter
//                 applyFor={this.state.applyFor}
//                 view={currentView}
//                 // viewId={this.state.filterViewId}
//                 show={this.state.showFilter == "data"}
//                 onRequestClose={() => this.showFilter(null)}
//                 filters={this.state.search.filters}
//                 setFilterTypeQuery={(data) => this.setFilterTypeQuery(data)}
//                 setFilterSelect={(data) => this.setFilterSelect(data)}
//                 setFilterValue={(data) => this.setFilterValue(data)}
//                 removeFilter={(data) => this.removeFilter(data)}
//                 onSave={!(this.props.customer.eventValue || this.props.customer.typeBirhday)}
//                 viewId={this.state.search.viewId}
//                 title={'Khách hàng'}
//                 onChange={data => this.onChangeFilter(data)}
//                 saveFilter={() => this.saveFilter()}
//             />
//             <CustomerViewFilter
//                 applyFor={this.state.applyFor}
//                 setSortRows={(item) => this.setSortRows(item)}
//                 sort={this.state.search.sort}
//                 view={currentView}
//                 viewId={this.state.search.viewId}
//                 fields={fields}
//                 show={this.state.showFilter == "view"}
//                 onFilterUpdate={this.viewFilterUpdate}
//                 onRequestClose={() => this.showFilter(null)}
//                 onChange={data => this.onChangeFilter(data)}
//                 saveFilter={() => this.saveFilter()}
//             />

//             <CustomerSearchBox
//                 search={this.state.search}
//                 // onSearch={this.onSearch}
//                 view={this.state.currentViewIndex}
//                 show={this.state.showFilter == "search" && (!ios || this.state.currentCustomer == null)}
//                 showBox={this.showBox}
//                 ios={ios}
//                 onRequestClose={() => this.showFilter(null)} />


//             <Prompt
//                 customerView={this.props.customview.items}
//                 applyFor={this.state.applyFor}
//                 title={this.state.promptTitle}
//                 viewId={currentView && currentView.id}
//                 placeholder={this.state.promptPlaceholder}
//                 defaultValue={currentView ? currentView.title : ''}
//                 show={this.state.showFilter == "name"}
//                 onCancel={() => this.showFilter(null)}
//                 onRequestClose={() => this.showBox(null)}
//                 onSubmit={(value) => this.setViewName(value)} />


//             <ActionSheet
//                 open={this.state.currentCustomer != null && this.state.currentBox == "actionsheet"}
//                 onRequestClose={() => this.showBox(null)}
//                 title={this.state.currentCustomer != null && this.state.currentCustomer.fullName}
//                 items={[
//                     {
//                         icon: <Icon type="MaterialIcons" name="info-outline" />,
//                         text: 'Xem chi tiết',
//                         onPress: this.open
//                     },
//                     {
//                         icon: <Icon type="MaterialIcons" name="edit" />,
//                         text: 'Chỉnh sửa',
//                         onPress: this.edit
//                     },
//                     {
//                         icon: <Icon type="MaterialIcons" name="delete" />,
//                         text: 'Xóa',
//                         onPress: this.delete
//                     }
//                 ]}
//             />
//             <MenuContext
//                 open={this.state.currentCustomer != null && this.state.currentBox == "menucontext"}
//                 onRequestClose={() => this.showBox(null)}
//                 items={[
//                     {
//                         icon: <Icon type="MaterialIcons" name='autorenew' style={styles.sizeIcon} />,
//                         text: "Làm mới",
//                         onPress: () => this.refresh(true),
//                         divider: true,
//                         disable: false
//                     },

//                     {
//                         text: "Tùy chỉnh hiển thị",
//                         icon: <Icon type="MaterialIcons" name='list' style={styles.sizeIcon} />,
//                         onPress: () => this.showFilter('view'),
//                         disable: false
//                     },
//                     {
//                         text: "Lọc dữ liệu",
//                         icon: <Icon type="MaterialIcons" name="sort" style={styles.sizeIcon} />,
//                         onPress: () => this.showFilter('data', currentView.id),
//                         divider: true,
//                         disable: false
//                     },

//                     {
//                         text: "Thêm tab",
//                         icon: <Icon type="MaterialIcons" name="add" style={styles.sizeIcon} />,
//                         onPress: () => this.createView(),
//                         disable: false
//                     },
//                     {
//                         text: "Đổi tên tab",
//                         icon: <Icon type="MaterialIcons" name="edit" style={styles.sizeIcon} />,
//                         onPress: () => this.renameView(currentView.id ? currentView.id : 0),
//                         disable: false
//                     },

//                     {
//                         text: "Xóa tab",
//                         icon: <Icon type="MaterialIcons" name="delete" style={[this.sortView().length <= 1 ? { color: '#999', fontSize: 20 } : styles.sizeIcon]} />,
//                         onPress: () => this.deleteView(currentView.id),
//                         disable: this.sortView().length <= 1 ? true : false
//                     },
//                 ]}
//             />
//             {
//                 // this.state.loading &&
//                 // <Loading />
//             }


//         </Container>
//     );

// }

// setFilterTypeQuery = (item) => {
//     var filters = this.state.search.filters;
//     if (!item.index) {
//         item.index = filters.length;
//     }

//     if (item.index > 0) {
//         this.state.search.filters[item.index] = {
//             ...filters[item.index],
//             fieldName: item.fieldName,
//             value: item.value,
//             type: 1,
//             typeQuery: item.typeQuery,
//             index: item.index,
//             id: item.id,
//             isMeta: item.isMeta
//         };
//         this.applySearch({ ...this.state.search });
//     }

// }

// setFilterSelect = (item) => {
//     if ((!!!item.index) && item.index != '0') {
//         var search = {
//             ...this.state.search, filters: [...this.state.search.filters, {
//                 fieldName: item.fieldName,
//                 value: item.value,
//                 type: 1,
//                 typeQuery: item.typeQuery,
//                 index: item.index,
//                 id: item.id,
//                 isMeta: item.isMeta
//             }]
//         };
//         this.applySearch({ ...search });
//     }
//     else {
//         this.state.search.filters[item.index] = {
//             ...this.state.search.filters[item.index],
//             fieldName: item.fieldName,
//             value: item.value,
//             type: 1,
//             typeQuery: item.typeQuery,
//             index: item.index,
//             id: item.id,
//             isMeta: item.isMeta
//         };
//         this.setState({ loading: false });
//     }
// }

// setFilterValue = (item) => {
//     var filters = this.state.search.filters;
//     if (filters.length > 0) {
//         filters = filters.map((filter, index) => {
//             if (index != item.index) return filter;
//             else return {
//                 ...filter,
//                 value: item.value,
//                 type: 1,
//                 typeQuery: item.typeQuery
//             };
//         });
//         this.applySearch({ filters: filters }, false);
//     }
// }

// removeFilter = (item) => {
//     var filters = this.state.search.filters;
//     if (filters.length > 0) {
//         var listnew = [];
//         filters = filters.map((filter, index) => {

//             if (index != item.index) listnew.push(filter);
//         });
//         this.applySearch({ filters: listnew }, false);
//     }

// }

// saveFilter = () => {
//     let nameView = this.sortView()[this.state.currentViewIndex];
//     var title = nameView ? nameView.title : ''
//     var viewId = this.state.search.viewId;
//     var viewDetails = this.state.search.details;

//     var viewFilters = this.state.search.filters;
//     // // console.log('1111111111333333333333filters', viewFilters);
//     var viewList = { id: viewId, name: title, applyFor: 'Customer', userId: 0, details: viewDetails, filters: viewFilters };

//     this.props.actions.updateList(viewList)
//         .then(data => {

//             Toast.show({
//                 text: 'Cập nhật thành công',
//                 duration: 2500,
//                 position: 'bottom',
//                 textStyle: { textAlign: 'center' },
//                 
//             });
//             // this.refresh(true);
//         })
//         .catch(error => {
//             this.setState({ loading: false });
//             alert(error.error, error.message, 'error');
//         });
// }

// renderViewHeader = (props) => {
//     // const count = this.props.customview.items.length || 1;
//     const count = this.sortView().length;
//     const width = Dimensions.get('window').width;
//     const scroll = width / count < 150;
//     return (
//         <TabBar {...props}
//             style={styles.tabBar}
//             indicatorStyle={styles.indicator}
//             // scrollEnabled={scroll}
//             scrollEnabled={count <= 2 ? scroll : true}
//         />
//     );
// };


// renderView = ({ route }) => {
//     // // console.log(route, "gshdgosdgh");
//     if (route.key == 'Tab0' && this.state.currentViewIndex == 0) {
//         return (
//             <CustomerListNew
//                 loading={this.state.loading}
//                 showBox={this.showBox}
//             />
//         );
//     }
//     // if (route.index == this.state.currentViewIndex) {
//     var customer = this.props.customer;
//     var total = 0;
//     // var routers = [...this.sortView()];
//     if (customer && customer.views.length > 0) {
//         // customer = customer.views.filter(t => t.viewId == this.state.search.viewId);
//         customer = customer.views.filter(t => t.viewId == route.viewId);
//         if (customer && customer.length > 0) {
//             if (customer[0].total) { total = customer[0].total; customer = customer[0]; }
//         }
//     }
//     return (
//         <CustomerList
//             total={total}
//             customer={customer}
//             onRefresh={(par) => this.refresh(par)}
//             // routes={routers}
//             // pageSize={this.state.search.pageSize}
//             page={this.state.search.page}
//             // onPageChange={this.onPageChange}
//             onChange={(pageSize) => this.onPageSizeChange(pageSize)}
//             isActive={() => this.state.currentViewIndex == route.index}
//             viewIndex={route.index}
//             viewId={route.viewId}
//             // viewId={this.state.search.viewId}
//             loading={this.state.loading}
//             showBox={this.showBox} />
//     );
//     // }
//     // return <View style={{ paddingTop: 10, alignItems: 'center' }}><Text style={{ color: 'red' }}>Đang tải..</Text></View>
//     // return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Spinner color='green' /></View>
//     // return null;

// };

// }

// export default connect(Customer, state => ({
//     customer: state.customer,
//     customview: state.customview,
//     host: state.account.host,
//     customerCategory: state.customerCategory,
//     customerSource: state.customerSource,
//     user: state.user,
//     userId: state.account.user,
//     customField: state.customField,
//     fields: state.app.fields,
//     customviewFilter: state.customviewFilter,
//     status: state.app.enums.customerStatus,
//     gender: state.app.enums.gender,
//     fieldType: state.app.enums.fieldType,
//     branch: state.branch
// }), {
//     ...actions,
//     removeView,
//     createdetailView,
//     updateDetailView,
//     getListField,
//     getListView,
//     getListFilter,
//     getListCateCustomer,
//     getListUser,
//     getListSource,
//     updateList
//     // refresh
// });

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
//     header: {
//         paddingTop: Constants.statusBarHeight,
//     },
//     tabBar: {
//         backgroundColor: '#4CAF50',
//         maxHeight: 70,
//         minHeight: 40,
//     },
//     indicator: {
//         backgroundColor: '#fff',
//     },
//     actionIcon: {
//         padding: 5,
//     },
//     sizeIcon: {
//         fontSize: 20
//     }
// });