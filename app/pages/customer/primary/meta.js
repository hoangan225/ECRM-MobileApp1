import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { View, Text, CheckBox, Radio } from 'native-base';
import Select from '../../controls/select';
import DatePicker from '../../controls/datepicker';
// import Toggle from '../../controls/toggle';
// import TextField from '../../controls/input2';
// import Input from '../../controls/input2';
// import DateTimePicker from '../../controls/datetimepicker';
// import Radio from '../../controls/radio';
// import Checkbox from '../../controls/checkbox';
// import Select from '../../controls/select2';
// import CheckboxList from '../../controls/checkboxlist';
// import RadioList from '../../controls/radiolist';

import { connect } from '../../../lib/connect';
import * as actions from '../../../actions/customer';
import * as models from '../../../constants/model';

// import MetaField from '../customview/metadatafield';
class Meta extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            model: {
                ...props.model
            },
            loading: false
        }
    }
    UNSAFE_componentWillReceiveProps(props) {
        this.setState(
            {
                model: {
                    ...props.model
                }
            }
        )
    }


    render() {
        return (
            <View>
                <View>
                    {this.renderField()}
                </View>
            </View>
        );
    }


    renderField = () => {
        if (!this.props.fieldName) {
            return null;
        }
        var fieldType = [];
        if (this.props.isMeta) {
            fieldType = this.props.customField.items.filter(t => t.name == this.props.fieldName && t.applyFor == this.props.applyFor);
        }
        else {
            fieldType = this.getModel(this.props.applyFor).map((item, index) => (
                {
                    applyFor: this.props.applyFor,
                    name: item.name,
                    label: item.label,
                    type: item.type,
                    isReadOnly: item.isReadOnly,
                    order: item.order,
                    required: item.required,

                })).filter(t => t.name == this.props.fieldName && t.applyFor == this.props.applyFor);
        }
        // // console.log('meta: ', this.props)
        if (fieldType && fieldType.length > 0) {
            switch (fieldType[0].type) {
                case 0:
                    return (
                        <View style={styles.prop}>
                            <Text style={styles.label}>{__(this.props.label)}</Text>
                            <TextInput style={styles.textbox}
                                ref={this.props.fieldName}
                                autoCapitalize='none'
                                underlineColorAndroid='transparent'
                                value={this.state.model.website}
                                onChangeText={text => this.props.onChange(text)} />
                        </View>
                    )

                case 1:
                    return (
                        <View style={styles.prop}>
                            <Text style={styles.label}>{__(this.props.label)}</Text>
                            <TextInput style={styles.textbox}
                                ref={this.props.fieldName}
                                autoCapitalize='none'
                                underlineColorAndroid='transparent'
                                value={this.props.value}
                                onChangeText={text => this.props.onChange(text)} />
                        </View>
                    )

                case 2:
                    return (
                        <View style={styles.fromGroup}>
                            <View style={styles.prop}>
                                <Text style={styles.label}>{__(this.props.label)}</Text>
                                <DatePicker
                                    ref={this.props.fieldName}
                                    style={styles.textbox}
                                    date={this.props.value}
                                    onDateChange={date => this.props.onChange(date)}
                                />
                            </View>
                        </View>
                    )

                case 3:
                    return (
                        <View style={styles.fromGroup}>
                            <View style={styles.prop}>
                                <Text style={styles.label}>{__(this.props.label)}</Text>
                                <DatePicker
                                    ref={this.props.fieldName}
                                    style={styles.textbox}
                                    date={this.props.value}
                                    onDateChange={date => this.props.onChange(date)}
                                />
                            </View>
                        </View>
                    )

                case 9: //Kiểu True False
                //return (<div>Đang xử lý Control True/False</div>);
                case 10:

                    var value = this.props.value;
                    if (value == 'true' || value == '1') {
                        value = true;
                    }
                    if (value == 'false' || value == '0') {
                        value = false;
                    }

                    return (
                        <CheckBox checked={value}
                            style={{ marginRight: 20 }}
                            onPress={this.props.onChange} />
                    )
                case 11:
                    console.log("11");
                // var value = this.props.value;
                // if (value == 'true' || value == '1') {
                //     value = true;
                // }
                // if (value == 'false' || value == '0') {
                //     value = false;
                // }
                // return (<Radio
                //     ref={this.props.fieldName}
                //     value={value}
                //     onChange={this.props.onChange}
                //     checked={this.props.value} >
                //     {__(this.props.label)}
                // </Radio>);
                case 12:
                    console.log("12");
                // var value = this.props.value;
                // if (value == 'true' || value == '1') {
                //     value = true;
                // }
                // if (value == 'false' || value == '0') {
                //     value = false;
                // }
                // return (<Checkbox
                //     ref={this.props.fieldName}
                //     name={this.props.fieldName}
                //     onChange={this.props.onChange}
                //     checked={value}>{__(this.props.label)}</Checkbox>);
                case 13:
                    console.log("13");
                // return (
                //     <React.Fragment>
                //         <label className="form-control--label">{__(this.props.label)}</label>
                //         <Toggle
                //             ref={this.props.fieldName}
                //             on={(!!this.props.value)}
                //             onChange={this.props.onChange}
                //             color="red">{__(this.props.label)} </Toggle>
                //     </React.Fragment>
                // );
                case 14:

                    var listData = [];
                    var defaultValue = this.props.defaultValue;

                    if (defaultValue) {
                        defaultValue = defaultValue.split('\n');
                        if (defaultValue && defaultValue.length > 0) {
                            listData = defaultValue.map((item, index) => ({ value: item, label: item }));
                        }
                    }
                    return (
                        <View style={styles.prop}>
                            <Text style={styles.label}>{__(this.props.label)}</Text>
                            <Select
                                items={listData}
                                style={styles.select}
                                selectedValue={this.props.value}
                                onValueChange={option => this.props.onChange(option)}
                                showSearchBox={false}
                            />
                        </View>
                    );

                case 15:
                    console.log("15");
                // var listData = [];
                // var defaultValue = this.props.defaultValue;

                // if (defaultValue) {
                //     defaultValue = defaultValue.split('\n');
                //     if (defaultValue && defaultValue.length > 0) {
                //         listData = defaultValue.map((item, index) => ({ value: item, label: item }));
                //     }
                // }
                // var values = this.props.value;
                // return (
                //     <CheckboxList options={listData}
                //         values={values}
                //         onChange={this.props.onChange}
                //         label={__(this.props.label)}
                //     />
                // );
                case 16:
                    console.log("16");
                // var listData = [];
                // var defaultValue = this.props.defaultValue;

                // if (defaultValue) {
                //     defaultValue = defaultValue.split('\n');
                //     if (defaultValue && defaultValue.length > 0) {
                //         listData = defaultValue.map((item, index) => ({ value: item, label: item }));
                //     }
                // }
                // var value = this.props.value;
                // return (
                //     <RadioList
                //         options={listData}
                //         value={value}
                //         onChange={this.props.onChange}
                //         label={__(this.props.label)}
                //     />);
                case 22:
                    return (
                        <View style={styles.fromGroup}>
                            <View style={styles.prop}>
                                <Text style={styles.label}>{__(this.props.label)}</Text>
                                <DatePicker
                                    options={
                                        {
                                            enableTime: true,
                                            altFormat: "d/m/Y H:i",
                                            dateFormat: "Y/m/d H:i",
                                        }
                                    }
                                    ref={this.props.fieldName}
                                    style={styles.textbox}
                                    date={this.props.value}
                                    onDateChange={date => this.props.onChange(date)}
                                />
                            </View>
                        </View>
                    )

                default:

                    return (
                        <View style={styles.prop}>
                            <Text style={styles.label}>{__(this.props.label)}</Text>
                            <TextInput style={styles.textbox}
                                multiline={true}
                                numberOfLines={4}
                                ref={this.props.fieldName}
                                autoCapitalize='none'
                                underlineColorAndroid='transparent'
                                value={this.props.value}
                                onChangeText={text => this.props.onChange(text)} />
                        </View>
                    )

            }
        }
        var fields = [];
        if (this.props.fields) {
            fields = this.props.fields[this.props.applyFor.replace(/^[A-Z]/, this.props.applyFor.substring(0, 1).toLowerCase())];
        }
        return (
            console.log("not if else")
            // this.props.fieldName && (<MetaField
            //     fields={fields}
            //     applyFor={this.props.applyFor}
            //     isShow={false}
            //     fieldName={this.props.fieldName}
            //     onChangeMeta={this.onChangeMeta}
            // />)
        );
    }


    getModel = (forModel) => {
        var model = [];
        if (forModel.match(/^Product/)) {
            model = models.Product;
        }
        else {
            model = models[forModel];
        }
        return [...model];
    }
}


export default connect(Meta, state => ({
    customer: state.customer,
    customField: state.customField,
    fields: state.app.fields,
    status: state.app.enums.customerStatus,
    gender: state.app.enums.gender,
    fieldType: state.app.enums.fieldType,
}), actions);


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