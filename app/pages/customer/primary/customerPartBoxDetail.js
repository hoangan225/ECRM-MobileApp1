import moment from 'moment';
import { Container, Icon, Text, Thumbnail, Toast, View } from 'native-base';
import React, { Component } from 'react';
// import Toast from 'react-native-simple-toast';
import { Alert, Dimensions, Linking, RefreshControl, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';
import tvkd from 'tieng-viet-khong-dau';
import * as actions from '../../../actions/customer';
import { getList as getListView } from '../../../actions/customview';
import { getList as getListField } from '../../../actions/customfield';
import { connect } from '../../../lib/connect';
import request from '../../../lib/request';
import { MenuModalContext } from '../../controls/action-menu';
import Avatar from '../../controls/avatar';
import Toolbar from '../../controls/toolbars';
import OpportunityItems from './customerOpportunities';
import JobItems from './customerPartJob';
import NoteItems from './customerPartNoteList';
import Meta from './metaDtail';
// import MyStatusBar from './../../statusBar/MyStatusBar';

class CustomerDetailsBox extends Component {
    constructor(props, context) {
        super(props, context);
        var branchId = context.currentBranchId;
        this.state = {
            branchId: branchId,
            refreshing: false,
            currentViewIndex: 0,
            title: __('Chi tiết khách hàng')
        }
        var user = this.context.user;
        this.userId = user.id;
        this.canDetail = this.context.user.hasCap("Customer.Detail");
        this.canListOpp = this.context.user.hasCap("Opportunity.Manage");
        this.canListJob = this.context.user.hasCap("Job.Manage");
        this.data = [];
    }

    componentDidMount() {
        this.props.actions.customerAmount(this.props.entry.id)
            .then(data => {
                // console.log('');
            })
            .catch(error => {
                alert(error.error, 'error');
            });

        var idCustomer = this.props.entry.id;
        if (idCustomer) {
            this.data = this.props.customer.items.filter(t => t.id == idCustomer);
        }

    }

    edit = () => {
        // this.props.showBox(this.props.entry, 'edit');
        this.props.showEdit()
    }

    delete = () => {
        Alert.alert(
            'Xóa khách hàng',
            'Bạn có chắc chắn muốn xóa không?',
            [
                {
                    text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'
                },
                {
                    text: 'OK', onPress: () => {
                        var id = this.props.entry.id;
                        // this.props.showBox(null, 'delete');
                        this.props.actions.remove(id)
                            .then(() => {
                                // Toast.show('Xóa thành công.');
                                Toast.show({
                                    text: 'Xóa thành công',
                                    duration: 2500,
                                    position: 'bottom',
                                    textStyle: { textAlign: 'center' },

                                });
                                this.props.onRequestClose();
                            })
                            .catch(({ error, message }) => {
                                alert(error, message);
                            })
                    }
                },
            ],
            { cancelable: false }
        )

    }

    openLink = (link) => {
        Linking.canOpenURL(link).then(supported => {
            if (supported) {
                Linking.openURL(link);
            } else {
                // console.log('Don\'t know how to open URI: ' + link);
            }
        });
    }

    refresh = (silent = false) => {
        var id = this.props.entry.id;
        !silent && this.setState({ refreshing: true });
        this.props.actions.getlist()
            .catch(() => 1).then(() => {
                this.setState({ refreshing: false });
            });
    }

    render() {
        const { entry } = this.props;
        var titleView = this.state.currentViewIndex;
        if (titleView == 0) { titleView = __('Chi tiết khách hàng') }
        if (titleView == 1) { titleView = __(`Ghi chú - ${entry.fullName}`) }
        if (titleView == 2) { titleView = __(`Công việc - ${entry.fullName}`) }
        if (titleView == 3) { titleView = __(`Cơ hội - ${entry.fullName}`) }

        if (!entry) return null;

        let routes = {
            routes: [
                {
                    key: 'info',
                    icon: 'user-o',
                },
                {
                    key: 'notes',
                    icon: 'sticky-note-o',
                },
                {
                    key: 'jobs',
                    icon: 'tasks'
                },
                {
                    key: 'opportunities',
                    icon: 'bullseye'
                }
            ],
            index: this.state.currentViewIndex,
        };

        return (
            <MenuModalContext
                supportedOrientations={['portrait', 'landscape']}
                onRequestClose={this.props.onRequestClose}>
                <Container style={styles.container}>
                    <Toolbar
                        noShadow
                        icon={<Icon type='MaterialIcons' name='arrow-back' style={{ fontSize: 22, color: '#fff' }} size={22} />}
                        onIconPress={this.props.onRequestClose}
                        actions={[
                            {
                                icon: <Icon type='MaterialIcons' name='more-vert' style={{ fontSize: 22, color: '#fff' }} size={22} />,
                                menuItems: [
                                    {
                                        icon: <Icon type='MaterialIcons' name='autorenew' style={{ fontSize: 20 }} size={20} />,
                                        text: __("Làm mới"),
                                        onPress: this.refresh,
                                    },
                                    {
                                        icon: <Icon type='MaterialIcons' name='edit' style={{ fontSize: 20 }} size={20} />,
                                        text: __("Sửa khách hàng"),
                                        onPress: this.edit,
                                    },
                                    {
                                        icon: <Icon type='MaterialIcons' name='delete' style={{ fontSize: 20 }} size={20} />,
                                        text: __("Xóa khách hàng"),
                                        onPress: this.delete,
                                    }
                                ]
                            }
                        ]}
                        titleText={titleView}
                    ></Toolbar>
                    <TabView
                        style={styles.container}
                        navigationState={routes}
                        renderScene={this.renderView}
                        renderTabBar={this.renderViewHeader}
                        onIndexChange={this.handleChangeTab}
                        initialLayout={{ height: 0, width: Dimensions.get('window').width }}
                    />
                </Container>
            </MenuModalContext>
        )
    }

    renderIcon = ({ route }) => {
        return <Icon type='FontAwesome' name={route.icon} style={{ fontSize: 18, color: '#fff' }} />
    }

    handleChangeTab = (index) => {
        this.setState({
            currentViewIndex: index,
            selectedDate: null
        });
    };

    renderViewHeader = (props) => {
        return (
            <TabBar {...props}
                style={styles.tabBar}
                renderIcon={this.renderIcon}
                indicatorStyle={styles.indicator}
                scrollEnabled={false} />
        );
    };

    renderView = ({ route }) => {
        switch (route.key) {
            case 'info':
                return this.renderInfo();
            case 'notes':
                return this.renderNotes();
            case 'jobs':
                return this.renderJobs();
            case 'opportunities':
                return this.renderOpportunities();
        }
    };

    showAvatar = (entry) => {
        var rsUrl = request.host;
        var result = null;
        if (entry) {
            var name = entry.firstName ? entry.firstName : entry.fullName;
            let nameMatch = name.trim().match(/\S+$/);
            if (entry.avatar == null || entry.avatar == '') {
                result = <View style={[styles.Avatar, styles.AvatarBackground]}><Text style={styles.AvatarText}>{nameMatch && nameMatch[0] ? tvkd.cUpperCase(nameMatch[0][0]) : '?'}</Text></View>
            }
            else {
                let avartaUrl = rsUrl + entry.avatar;
                result = <Thumbnail style={styles.Avatar} source={{ uri: avartaUrl }} />
            }
            return result;
        }
    }

    showName = (entry) => {
        var result = null;
        if (entry) {
            var fullName = entry.fullName;
            result = <View style={styles.nameDetails}><Text style={styles.fullname}> {__(fullName)}</Text></View>
            return result;
        }
    }

    getMeta = (key, isDefault, entry) => {

        var customFields = this.props.customField.items;
        var customField = customFields;
        // // console.log(entry);
        var value = entry.metas && entry.metas[key];
        if ((!value || isDefault) && customField && customField.length > 0) {
            customField = customField.filter(t => t.applyFor == this.props.applyFor && t.name == key);
            if (customField && customField.length > 0) {
                customField = customField[0];
                if (customField.type == 15 && !isDefault) { //dành cho checkbox nhiều dòng
                    value = [];
                }
                else {
                    value = customField.defaultValue;
                }
            }
        }
        return value;
    }


    renderInfo = () => {
        const { entry } = this.props;
        // // console.log(entry, "entry");
        var customerAmount = this.props.customer.customerAmount;


        var view = this.props.customview.items.filter(t => t.type == 1
            && t.applyFor == this.props.applyFor);
        var isViewMain = true;
        if (!isViewMain && view) {
            view = view.filter(t => t.userId == this.context.user.id);
        }

        var branchName = this.props.branch.items.filter((item) => item.id)
        return (
            <ScrollView
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
            >
                <View style={styles.avatarContainer}>
                    <Avatar url={entry.avatar} name={entry.fullName} id={entry.id} size={70} />
                    <Text style={styles.customerTitle}>
                        {entry.fullName}
                    </Text>
                </View>

                <View style={styles.customerInfo}>
                    {
                        (view.length > 0) && (
                            view[0].details.sort((t1, t2) => t1.order - t2.order).map((item, index) => (
                                <View style={styles.fromGroup} key={index}>
                                    {this.renderField(item, index, entry)}
                                </View>
                            ))
                        )
                    }
                    {

                        // Object.keys(entry).map((key) => {
                        //     switch (key.toLowerCase()) {

                        //     }
                        // })
                    }

                </View>
                <View style={styles.detailsumary}>
                    <View style={styles.sumary}>
                        <Text style={styles.sumaryText}>
                            <Text style={styles.weight}>{__('- Doanh số Cơ hội: ')}{(!!customerAmount.oppAmount) ? customerAmount.oppAmount : '0.00'}</Text>
                        </Text>

                        <Text style={styles.sumaryText}>
                            <Text style={styles.weight}>{__('- Doanh số hợp đồng: ')}{(!!customerAmount.contractAmount) ? customerAmount.contractAmount : '0.00'}</Text>
                        </Text>

                        <Text style={styles.sumaryText}>
                            <Text style={styles.weight}>{__('- Tương tác lần cuối: ')}{((!!customerAmount.lastActive) && moment(customerAmount.lastActive).format('L') != '01/01/0001') ? moment(customerAmount.lastActive).format('L') : 'Off'}</Text>
                        </Text>
                    </View>
                </View>
            </ScrollView>
        )
    }

    renderField = (item, key, entry) => {
        // // console.log(entry);
        var useManage = this.props.user.items.map((item, index) => {
            if (entry.managerId == item.id)
                return (item.fullName);

        })
        if (!item) {
            return (<View><Text></Text></View>);
        }
        switch (item.fieldName.toLowerCase()) {

            case 'id':
            case 'avatar':
            case 'fullname':
            case 'status':
            case 'metas':
            case 'userid':
                return null;
            case 'firstname':
                return !!entry.firstName && (
                    <View style={styles.customerProp} key={key}>
                        <Icon type="MaterialIcons" name="account-box" style={styles.icon} />
                        <Text style={styles.value}>{__('Tên:')} {entry.firstName}</Text>
                    </View>
                )
            case 'lastname':
                return !!entry.lastName && (
                    <View style={styles.customerProp} key={key}>
                        <Icon type="MaterialIcons" name="account-box" style={styles.icon} />
                        <Text style={styles.value}>{__('Họ:')} {entry.lastName}</Text>
                    </View>
                )

            case 'managerid':
                return !!entry.managerId && (
                    <View style={styles.customerProp} key={key}>
                        <Icon type="MaterialIcons" name="account-box" style={styles.icon} />
                        <Text style={styles.value}>{__('Người phụ trách:')} {useManage.map((item) => {
                            if (item != undefined) { return item }
                        })}</Text>
                    </View>
                )
            case 'recommenderid':
                var fullName = '';
                var entity = this.props.customer.items.filter(t => t.id == entry.recommenderId);
                if (entity && entity.length > 0) {
                    fullName = entity[0].fullName;
                }
                return !!entry.recommenderId && (
                    <View style={styles.customerProp} key={key}>
                        <Icon type="MaterialIcons" name="account-box" style={styles.icon} />
                        <Text style={styles.value}>{__('Người giới thiệu:')} {fullName}</Text>
                    </View>
                )

            case 'categoryid':
                var mainIds = entry.categoryId;
                var name = [];
                if (mainIds && mainIds.length > 0) {
                    var entitys = this.props.customerCategory.items;
                    if (entitys && entitys.length > 0) {
                        mainIds.map((id, index) => {
                            var findIndex = entitys.findIndex(t => t.id == id);
                            if (findIndex >= 0) {
                                name.push(entitys[findIndex].name);
                            }
                        })

                    }
                }
                return !!entry.categoryId && (
                    <View style={styles.customerProp} key={key}>
                        <Icon type="MaterialIcons" name="account-box" style={styles.icon} />
                        <Text style={styles.value}>{__('Nhóm:')} {name.join(', ')}</Text>
                    </View>
                )


            case 'phone':
                return !!entry.phone && (
                    <View style={styles.customerProp} key={key}>
                        <Icon type="MaterialIcons" name="phone" style={styles.icon} />
                        <Text style={styles.value}>{__('Điện thoại:')}</Text>
                        <TouchableOpacity onPress={() => this.openLink("tel:" + entry.phone)}>
                            <Text style={styles.value}>{entry.phone}</Text>
                        </TouchableOpacity>
                    </View>
                )
            case 'createdate':
                return !!entry.createDate && (
                    <View style={styles.customerProp} key={key}>
                        <Icon type="MaterialIcons" name="today" style={styles.icon} />
                        <Text style={styles.value}>{__('Ngày sinh: ')}{moment(entry.createDate).format("DD/MM/YYYY")}</Text>
                    </View>
                )
            case 'fax':
                return !!entry.fax && (
                    <View style={styles.customerProp} key={key}>
                        <Icon type='FontAwesome' name="fax" style={styles.icon} />
                        <Text style={styles.value}>{__('Fax:')}</Text>
                        <TouchableOpacity onPress={() => this.openLink("tel:" + entry.phone)}>
                            <Text style={styles.value}>{entry.fax}</Text>
                        </TouchableOpacity>
                    </View>
                )
            case 'email':
                return !!entry.email && (
                    <View style={styles.customerProp} key={key}>
                        <Icon type="MaterialIcons" name="email" style={styles.icon} />
                        <Text style={styles.value}>{__('Email:')}</Text>
                        <TouchableOpacity onPress={() => this.openLink("mailto:" + entry.phone)}>
                            <Text style={styles.value}>{entry.email}</Text>
                        </TouchableOpacity>
                    </View>
                )
            case 'address':
                return !!entry.address && (
                    <View style={styles.customerProp} key={key}>
                        <Icon type="MaterialIcons" name="place" style={styles.icon} />
                        <Text style={styles.value}>{__('Địa chỉ:')} {entry.address}</Text>
                    </View>
                )
            case 'companyid':
            case 'companyfullname':
                return !!entry.companyfullname && (
                    <View style={styles.customerProp} key={key}>
                        <Icon type="MaterialIcons" name="place" style={styles.icon} />
                        <Text style={styles.value}>{__('Công ty:')} {entry.companyFullName}</Text>
                    </View>
                )
            case 'birthdate':
                return !!entry.birthdate && (
                    <View style={styles.customerProp} key={key}>
                        <Icon type="MaterialIcons" name="today" style={styles.icon} />
                        <Text style={styles.value}>{__('Ngày sinh: ')}{moment(entry.birthdate).format("DD/MM/YYYY")}</Text>
                    </View>
                )

            case 'gender':
                return !!entry.gender && (
                    <View style={styles.customerProp} key={key}>
                        <Icon type="MaterialIcons" name="person" style={styles.icon} />
                        <Text style={styles.value}>{__('Giới tính:')} {entry.gender == 1 ? "Nam" : entry.gender == 2 ? "Nữ" : "-"}</Text>
                    </View>
                )

            case 'banknumber':
                return !!entry.bankNumber && (
                    <View style={styles.customerProp} key={key}>
                        <Icon type="MaterialIcons" name="info" style={styles.icon} />
                        <Text style={styles.value}>{__('Tài khoản ngân hàng: ')}{entry.bankNumber}</Text>
                    </View>
                )
            case 'bankname':
                return !!entry.bankName && (
                    <View style={styles.customerProp} key={key}>
                        <Icon type="MaterialIcons" name="account-balance" style={styles.icon} />
                        <Text style={styles.value}>{__('Ngân hàng: ')}{entry.bankName}</Text>
                    </View>
                )
            case 'code':
                return !!entry.code && (
                    <View style={styles.customerProp} key={key}>
                        <Icon type="MaterialIcons" name="info" style={styles.icon} />
                        <Text style={styles.value}>{__('Mã số thuế: ')}{entry.code}</Text>
                    </View>
                )
            case 'branchid':
                return null;
            // return !!entry.branchId && (
            //     <View style={styles.customerProp} key={key}>
            //         <Icon type="MaterialIcons" name="info" style={styles.icon} />
            //         <Text style={styles.value}>{__('Chi nhánh: ')}{entry.branchId}</Text>
            //     </View>
            // )

            default:
                // if (!this.data) return null;
                return (<Meta
                    item={item}
                    defaultValue={this.data.length > 0 ? this.data[0].metas : 'defaultValue'}
                    value={
                        (this.getMeta(item.fieldName, true, this.data.length > 0 && this.data[0]) || "")
                    }
                    onChange={text =>
                    (item.isMeta ?
                        this.setMeta({ [item.fieldName]: text })
                        : this.setValue({ [item.fieldName]: text }))}
                    label={__(item.label)}
                    fieldName={item.fieldName}
                    applyFor={this.props.applyFor}
                    isMeta={true}
                />);

        }
    }
    renderNotes = () => {
        return (
            <NoteItems entry={this.props.entry}
                refreshing={this.state.refreshing}
                onRefresh={this.refresh}
                activity={this.props.activity}
            />
        )
    }

    renderJobs = () => {
        return (
            <JobItems
                entry={this.props.entry}
                refreshing={this.state.refreshing}
                onRefresh={this.refresh}
            />
        )
    }

    renderOpportunities = () => {
        return (
            <OpportunityItems
                entry={this.props.entry}
                refreshing={this.state.refreshing}
                onRefresh={this.refresh}
            />
        )
    }
}

export default connect(CustomerDetailsBox, state => ({
    customer: state.customer,
    customerCategory: state.customerCategory,
    user: state.user,
    host: state.account.host,
    branch: state.branch,
    activity: state.activity,
    customField: state.customField,
    customview: state.customview,
}), {
    ...actions, getListField, getListView
});

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: '#fff'
    },
    container: { flex: 1 },
    sidebar: {
        backgroundColor: '#f9f9f9',
    },
    customer: {
        flex: 1,
    },
    Avatar: {
        width: 70,
        height: 70,
        borderWidth: 2,
        borderColor: '#fff',
        borderRadius: 70,
        justifyContent: 'center',
        alignItems: 'center',

    },
    AvatarText: {
        color: '#fff',
        fontSize: 30
    },
    AvatarBackground: {
        backgroundColor: '#900',
    },
    nameDetails: {
        paddingLeft: 5,
        paddingRight: 25
    },
    fullname: {
        paddingLeft: 5,
        color: '#fff',
        fontSize: 22,
        fontWeight: 'normal'
    },
    rowname: {
        flexDirection: 'row',
        backgroundColor: '#81C784',
        alignItems: 'center',
        padding: 15,
        marginTop: 1
    },
    avatarContainer: {
        backgroundColor: '#81C784',
        alignItems: 'center',
        flexDirection: 'row'
    },
    // tabBar: {
    //     backgroundColor: '#4CAF50',
    //     maxHeight: 70
    // },
    tabBar: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 0,
        zIndex: 0,
        elevation: 0,
        shadowOpacity: 0,
    },
    indicator: {
        backgroundColor: '#fff',
    },
    customerInfo: {
        flex: 1,
        padding: 10,
    },
    customerTitle: {
        flex: 1,
        color: '#fff',
        fontSize: 20,
        padding: 10,
        fontWeight: 'bold',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1
    },
    customerProp: {
        flexDirection: 'row',
        paddingVertical: 6,
    },
    icon: {
        marginTop: 3,
        fontSize: 14,
        color: '#444'
    },
    value: {
        fontSize: 15,
        color: '#555',
        marginLeft: 10
    },
    tabBar2: {
        backgroundColor: '#4CAF50',
        position: 'absolute',
        top: -50,
        left: 0,
        right: 0,
        bottom: 0,
        elevation: 0,
        shadowColor: 'black',
        shadowOpacity: 0,
        shadowRadius: 1.5,
        shadowOffset: {
            height: 1,
            width: 0
        },
    },
    // detailsumary: { position: 'absolute', bottom: 0, left: 0, right: 0 },
    sumary: {
        // backgroundColor: '#f2f2f2',
        paddingHorizontal: 10,
        paddingVertical: 3,
        // borderTopWidth: StyleSheet.hairlineWidth,
        // borderTopColor: '#ccc',
        // flexDirection: 'row'
    },
    sumaryText: {
        flex: 1,
        // textAlign: 'center'
    },
    weight: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#333'
    },
    empty: {
        color: 'red',
        textAlign: 'center',
        padding: 10
    }

});