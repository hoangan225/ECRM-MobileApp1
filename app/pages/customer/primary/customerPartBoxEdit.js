import React from 'react';
import { connect } from '../../../lib/connect';
import tvkd from 'tieng-viet-khong-dau';
import { Rating, AirbnbRating } from 'react-native-ratings';
import { validateComponent } from '../../../lib/validate';
import request from '../../../lib/request';
import * as actions from '../../../actions/customer';
import { getList as getListView } from '../../../actions/customview';
import { getList as getListField } from '../../../actions/customfield';
import {
    Dimensions, Linking, StyleSheet, ScrollView, Alert,
    TouchableOpacity, Image, Modal, TextInput, Switch
} from 'react-native';
import Toolbar from '../../controls/toolbars';
import Select from '../../controls/select';
import DatePicker from '../../controls/datepicker';
import ImagePicker from '../../controls/imagePicker';
import Loading from '../../controls/loading';
import Avatar from '../../controls/avatar';
import { Header, Left, Right, Body, Button, View, Text, Icon, Title, Thumbnail, Toast } from 'native-base';
import UserSelect from './../../user/index';
import CustomerSelect from './../components/customerSelect';
import CategorySelect from './../../customerCategory/index';
import SourceSelect from './../../customerSource';
import Meta from './meta';

class EditForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            model: {
                ...props.entry,
                // viewId: props.viewId
            },
            loading: false
        }

    }

    UNSAFE_componentWillReceiveProps(props) {
        this.setState(
            {
                model: {
                    ...props.entry,
                    // viewId: this.props.viewId
                }
            }
        )
    }

    setValue = data => {
        this.setState({
            model: { ...this.state.model, ...data }
        });
    }

    setMeta = (data) => {
        this.setState({
            model: {
                ...this.state.model,
                metas: {
                    ...this.state.model.metas,
                    ...data
                }
            }
        });
    }

    getMeta = key => {
        if (this.state.model && this.state.model.metas) {
            //var metas = JSON.parse(this.state.model.metas);

            return this.state.model.metas[key];
        }
    }

    handleClose = () => {
        if (this.props.onRequestClose) {
            this.props.onRequestClose();
        }
    }

    checkModel = (data) => {
        if ((!(!!data.managerId)) || data.managerId == 0) {
            alert(__('Người phụ trách là bắt buộc'), 'warning');
            return false;
        }
        if (data.categoryId == null || data.categoryId.length == 0) {
            alert(__('Nhóm khách hàng là bắt buộc'), 'warning');
            return false;
        }
        return true;
    }
    handleSubmit = () => {
        let ok = validateComponent(this) && this.checkModel(this.state.model);

        if (ok) {
            if (this.state.model.avatar) {
                this.props.actions.updateAvatar(this.state.model.id, this.state.model.avatar).then((userdata) => {
                    // console.log('edit image success');
                })
                    .catch(() => {
                        // console.log('not update image');
                    });
            }

            var metas = JSON.stringify(this.state.model.metas);
            // // console.log('metas', this.state.model);

            this.setState({ loading: true });
            this.props.actions.update({ ...this.state.model, metas })
                .then(data => {
                    this.setState({ loading: false });
                    this.handleClose();
                    // Toast.show(__('Cập nhật thành công'));
                    Toast.show({
                        text: 'Cập nhật thành công',
                        duration: 2500,
                        position: 'bottom',
                        textStyle: { textAlign: 'center' },

                    });
                })
                .catch(error => {
                    this.setState({ loading: false });
                    alert(error.error, error.message, 'error');
                });
        }
    }

    addImage = (image) => {
        this.setValue({
            avatar: image.url
        })
    }

    ratingCompleted(rating) {
        // console.log("Rating is: " + rating)
        this.setValue({ rate: rating });

    }

    render() {
        var customer = this.state.model;
        // let fullName = customer.lastName + " " + customer.firstName;
        let fullName = customer.fullName;
        var view = this.props.customview.items.filter(t => t.type == 2
            && t.applyFor == this.props.applyFor);
        var isViewMain = true;
        if (!isViewMain && view) {
            view = view.filter(t => t.userId == this.context.user.id);
        }
        var plusCompany = true;
        var isSelectCompany = this.state.isSelectCompany;
        return (
            <Modal
                supportedOrientations={['portrait', 'landscape']}
                onRequestClose={this.handleClose} >
                <Toolbar
                    elevation={2}
                    icon={<Icon type='MaterialIcons' name='arrow-back' style={styles.icon} />}
                    onIconPress={this.handleClose}
                    actions={[
                        {
                            icon: <Icon type='MaterialIcons' name='save' style={styles.icon} />,
                            onPress: this.handleSubmit,
                            disabled: this.state.loading
                        }
                    ]}
                    titleText='Cập nhật khách hàng'
                ></Toolbar>

                <View style={styles.customer}>
                    <ScrollView keyboardShouldPersistTaps='always'>

                        <View style={styles.avatarContainer}>
                            <ImagePicker
                                onSuccess={image => this.addImage(image)}
                                cropping={true}
                                editstyle='edit'
                                uploadOptions={{
                                    path: '/customer',
                                    insertDb: false,
                                    overwrite: false,
                                    createThumbnail: false,
                                    imageWidth: 200,
                                    imageHeight: 200
                                }}>
                                <Avatar url={customer.avatar} id={customer.id} name={customer.fullName} size={70} />

                            </ImagePicker>
                            <Text style={styles.customerTitle}>
                                {fullName}
                            </Text>
                        </View>

                        <View style={styles.customerInfo}>
                            {
                                (view.length > 0) && (
                                    view[0].details.sort((t1, t2) => t1.order - t2.order).map((item, index) => (
                                        <View style={styles.fromGroup} key={index}>
                                            {this.renderField(item, index)}
                                        </View>
                                    ))
                                )
                            }
                        </View>
                    </ScrollView>
                </View>
                {
                    this.state.loading &&
                    <Loading />
                }
            </Modal>
        );
    }


    renderField = (item, index) => {
        const customer = this.state.model;
        if (!item) {
            return (<View><Text></Text></View>);
        }
        switch (item.fieldName) {

            case 'FirstName':
                return (
                    <View style={styles.prop} key={index}>
                        <Text style={styles.label}>{__('Tên')}</Text>
                        <TextInput style={styles.textbox}
                            autoCapitalize='words'
                            underlineColorAndroid='transparent' value={this.state.model.firstName}
                            onChangeText={text => this.setValue({ firstName: text })}
                        />
                    </View>
                );
            case 'LastName':
                return (
                    <View style={styles.prop}>
                        <Text style={styles.label}>{__('Họ')}</Text>
                        <TextInput style={styles.textbox}
                            autoCapitalize='words'
                            underlineColorAndroid='transparent' value={this.state.model.lastName}
                            onChangeText={text => this.setValue({ lastName: text })}
                        />
                    </View>
                );

            case 'Gender':
                return (
                    <View style={styles.prop}>
                        <Text style={styles.label}>{__('Giới tính')}</Text>
                        <Select
                            items={[
                                { label: 'Nam', value: 1 },
                                { label: 'Nữ', value: 2 },
                                { label: 'Khác', value: 3 },
                            ]}
                            style={styles.select}
                            selectedValue={this.state.model.gender}
                            onValueChange={option => this.setValue({ gender: option })}
                            showSearchBox={false}
                        />
                    </View>
                );
            case 'Birthdate':
                return (
                    <View style={styles.fromGroup} key={index}>
                        <View style={styles.prop}>
                            <Text style={styles.label}>{__('Sinh nhật')}</Text>
                            <DatePicker
                                style={styles.textbox}
                                date={this.state.model.birthdate}
                                onDateChange={date => this.setValue({ birthdate: date })}
                            />
                        </View>
                    </View>
                )
            case 'Phone':
                return (
                    <View style={styles.prop}>
                        <Text style={styles.label}>{__('Điện thoại')}</Text>
                        <TextInput style={styles.textbox}
                            autoCapitalize='none'
                            underlineColorAndroid='transparent' value={this.state.model.phone}
                            keyboardType='phone-pad'
                            onChangeText={text => this.setValue({ phone: text })} />
                    </View>

                )

            case 'PhoneOther':
                return (
                    <View style={styles.prop}>
                        <Text style={styles.label}>{__('Điện thoại khác')}</Text>
                        <TextInput style={styles.textbox}
                            autoCapitalize='none'
                            underlineColorAndroid='transparent' value={this.state.model.phoneOther}
                            keyboardType='phone-pad'
                            onChangeText={text => this.setValue({ phoneOther: text })} />
                    </View>
                );

            case 'Email':
                return (
                    <View style={styles.prop}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput style={styles.textbox}
                            autoCapitalize='none'
                            underlineColorAndroid='transparent' value={this.state.model.email}
                            keyboardType='email-address'
                            onChangeText={text => this.setValue({ email: text })} />
                    </View>
                );

            case 'Address':
                return (
                    <View style={styles.prop}>
                        <Text style={styles.label}>{__('Địa chỉ')}</Text>
                        <TextInput style={styles.textbox}
                            autoCapitalize='none'
                            underlineColorAndroid='transparent' value={this.state.model.address}
                            onChangeText={text => this.setValue({ address: text })} />
                    </View>
                )

            case 'website':
                return (
                    <View style={styles.prop}>
                        <Text style={styles.label}>{__('Website')}</Text>
                        <TextInput style={styles.textbox}
                            autoCapitalize='none'
                            underlineColorAndroid='transparent' value={this.state.model.website}
                            onChangeText={text => this.setValue({ website: text })} />
                    </View>
                )
            case 'sourceId':
                return (
                    <View style={styles.fromGroup} key={key}>
                        <View style={styles.prop}>
                            <Text style={styles.label}>Nguồn KH</Text>
                            <SourceSelect style={styles.select}
                                multiple={true}
                                onValueChange={(value, item) => this.setValue({ sourceId: value, source: item.fullName })}
                                selectedValue={customer.sourceId} />
                        </View>
                    </View>
                )

            case 'Rate':
                var rate = this.state.model.rate;
                rate = (!!rate) ? parseFloat(rate) : 0;
                return (
                    <View style={styles.prop}>
                        <Text style={styles.label}>{__('Đánh giá')}</Text>
                        <Rating
                            rating={this.state.model.rate}
                            // value={this.state.model.rate}
                            onFinishRating={text => this.setValue({ rate: text })}
                            style={{ paddingVertical: 10 }}
                            defaultRating={this.state.model.rate}
                            imageSize={30}
                        />
                    </View>

                );


            case 'RecommenderId':
                return (
                    <View style={styles.prop}>
                        <Text style={styles.label}>{__('Người giới thiệu')}</Text>
                        <CustomerSelect
                            style={styles.select}
                            multiple={false}
                            showPhone={true}
                            onValueChange={(value, item) => this.setValue({ recommenderId: value, recommender: item.fullName })}
                            selectedValue={this.state.model.recommenderId} />
                    </View>
                );

            case 'ManagerId':
                return (
                    <View style={styles.prop}>
                        <Text style={styles.label}>{__('Phụ trách')}</Text>
                        <UserSelect style={styles.select}
                            onValueChange={(value, item) => this.setValue({ managerId: value, manager: item.fullName })}
                            selectedValue={customer.managerId} />
                    </View>
                );
            case 'Categories':
            case 'CategoryId':
                return (
                    <View style={styles.prop}>
                        <Text style={styles.label}>Nhóm</Text>
                        <CategorySelect style={styles.select}
                            multiple={true}
                            onValueChange={(values, items) => this.setValue({ categoryId: values })}
                            selectedValue={customer.categoryId}
                        />
                    </View>
                )

            default:
                return (<Meta
                    item={item}
                    defaultValue={this.getMeta(item.fieldName, true)}
                    value={item.isMeta ?
                        (this.getMeta(item.fieldName, false) || "")
                        : this.state.model[item.fieldName]}
                    onChange={text =>
                    (item.isMeta ?
                        this.setMeta({ [item.fieldName]: text })
                        : this.setValue({ [item.fieldName]: text }))}
                    label={__(item.label)}
                    fieldName={item.fieldName}
                    applyFor={this.props.applyFor}
                    isMeta={item.isMeta}
                />);


        }
    }
}

export default connect(EditForm, state => ({
    customer: state.customer,
    customview: state.customview,
    gender: state.app.enums.gender,
    fields: state.app.fields,
    customField: state.customField,
    status: state.app.enums.customerStatus
}), { ...actions, getListField, getListView });

const styles = StyleSheet.create({
    page: {
        flex: 1
    },
    icon: {
        fontSize: 22,
        color: '#fff'
    },
    customer: {
        flex: 1,
    },
    customerIcon: {
        position: 'relative',
        opacity: 0.8,
    },
    avatarContainer: {
        backgroundColor: '#81C784',
        alignItems: 'center',
        flexDirection: 'row',
        paddingVertical: 15,
        paddingLeft: 15
    },
    // avatar: {
    //     width: 80,
    //     height: 80,
    //     borderRadius: 50,
    //     margin: 10,
    //     borderWidth: StyleSheet.hairlineWidth,
    //     borderColor: '#ccc'
    // },
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
        fontSize: 35
    },
    AvatarBackground: {
        backgroundColor: '#900',
    },
    customerIconText: {
        width: 80,
        height: 80,
        borderRadius: 50,
        margin: 10,
        color: '#fff',
        fontSize: 52,
        textAlign: 'center',
        paddingTop: 4,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#ccc'
    },
    customerInfo: {
        flex: 1,
        padding: 10,
    },
    customerTitle: {
        color: '#fff',
        fontSize: 20,
        padding: 10,
        textAlign: 'center',
        fontWeight: 'bold',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1
    },
    prop: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5
    },
    label: {
        // width: 110,
        width: 95,
        fontWeight: 'bold',
        marginTop: 5,
        paddingRight: 5
    },
    textbox: {
        flex: 1,
        height: 40,
        padding: 4,
        margin: 0,
        backgroundColor: '#f9f9f9'
    },
    textarea: {
        minHeight: 40,
        height: null,
        textAlignVertical: 'top',
        fontSize: 16
    },
    select: {
        flex: 1,
        backgroundColor: '#f9f9f9'
    },
});