import React, { Component } from 'react';
import { StyleSheet, View, Animated, Easing, TouchableOpacity, Text, TextInput, Picker } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import CategorySelect from '../../customerCategory';
import UserSelect from '../../user';
import CompanySelect from './../components/companySelect';
import SourceSelect from './../../customerSource';
// import VnLocation from '../../../controls/location-select';
import Select from '../../controls/select';
import DatePicker from '../../controls/datepicker';
import RsTouchableNativeFeedback from '../../controls/touchable-native-feedback';

class CustomerDataFilterItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            typeQuery: '',
            changed: false,
            opacity: new Animated.Value(0),
            field: null,
            value: null,
            text: null,
            valueText: false,
            valueTypeQr: false,
            ...this.props.data,
            viewId: props.viewId
        }
    }

    componentDidMount() {
        Animated.timing(this.state.opacity,
            {
                toValue: 1,
                duration: 400,
                useNativeDriver: true
            }
        ).start();
    }

    componentDidUpdate() {
        if (this.state.changed) {
            if (this.state.valueText) {
                this.props.setFilterValue(
                    {
                        fieldName: this.state.fieldName,
                        value: this.state.value,
                        viewId: this.props.viewId || 0,
                        typeQuery: this.state.typeQuery,
                        index: this.props.index,
                        // valueText: this.state.valueText,
                        // id: this.state.id,
                        isMeta: this.state.isMeta,
                    }
                )
            }
            else {
                this.props.setFilterSelect(
                    {
                        fieldName: this.state.fieldName,
                        value: this.state.value,
                        viewId: this.props.viewId || 0,
                        typeQuery: this.state.typeQuery,
                        index: this.props.index,
                        // valueText: this.state.valueText,
                        // id: this.state.id,
                        isMeta: this.state.isMeta,
                    }
                )
            }
            if (this.state.valueTypeQr) {
                this.props.setFilterTypeQuery(
                    {
                        fieldName: this.state.fieldName,
                        value: this.state.value,
                        viewId: this.props.viewId || 0,
                        typeQuery: this.state.typeQuery,
                        index: this.props.index,
                        // valueText: this.state.valueText,
                        // id: this.state.id,
                        isMeta: this.state.isMeta,
                    }
                )
            }
        }
        // // console.log('componentDidUpdate');

        // if (this.state.changed) {
        //     this.props.updateFilter(this.props.index, {
        //         fieldName: this.state.fieldName,
        //         // type: this.state.type,
        //         // text: this.state.text,
        //         value: this.state.value,
        //         viewId: this.props.viewId || 0,
        //         typeQuery: this.state.typeQuery,
        //         // order: 1,
        //         // isMeta: false,
        //         index: this.props.index,
        //         valueText: this.state.valueText,
        //         id: this.state.id,
        //         isMeta: this.state.isMeta,
        //     })
        // }
    }

    UNSAFE_componentWillReceiveProps(props) {
        if (props.field == "CustomerLocation") {
            this.setState({
                ...props.data,
                changed: false,
                provinceId: props.value.split(';')[0],
                districtId: props.value.split(';')[1],
                wardId: props.value.split(';')[2],
                viewId: this.props.viewId || 0,
            });
        }
        else {
            this.setState({
                // ...props.data,
                changed: false,
                viewId: this.props.viewId || 0,
            });
        }
        this.state.opacity.setValue(1);
    }

    removeFilter = (id) => {
        Animated.timing(this.state.opacity,
            {
                toValue: 0,
                duration: 400,
                useNativeDriver: true
            }
        ).start(() => {
            // this.props.removeFilter(this.props.index, id);
            this.props.removeFilter(this.props.index, {
                fieldName: this.state.fieldName,
                // type: this.state.type,
                // text: this.state.text,
                value: this.state.value,
                viewId: this.props.viewId || 0,
                typeQuery: this.state.typeQuery,
                // order: 1,
                // isMeta: false,
                id: id,
                index: this.props.index
            });
        });
    }

    renderInput = () => {
        if (this.state.type == 'IsNullOrEmpty' || this.state.type == 'IsNotNullOrEmpty') {
            return null;
        }
        if (this.state.fieldName == 'CategoryId') {
            return (
                <View style={styles.field}>
                    <CategorySelect
                        selectedValue={this.state.value}
                        onValueChange={value => this.setState({ value: value, changed: true, valueText: false })}
                    />
                </View>
            )
        }

        if (this.state.fieldName == 'Gender') {
            return (
                <View style={styles.field}>
                    <Select
                        items={[
                            { label: 'Nam', value: '1' },
                            { label: 'Nữ', value: '2' },
                            { label: 'Khác', value: '3' },
                        ]}
                        selectedValue={this.state.value}
                        showSearchBox={false}
                        onValueChange={value => this.setState({ value: value, changed: true, valueText: false })}
                    />
                </View>
            )
        }
        if (this.state.fieldName == 'Birthdate') {
            return (
                <View style={styles.field}>
                    {/*<DatePicker
                        mode="datetime"
                        style={styles.select}
                        date={this.state.value}
                        onDateChange={date => this.setState({ value: date, changed: true, valueText: false })}
                    /> */}

                    <Select
                        items={[
                            { label: 'Hôm nay', value: 1 },
                            { label: 'Ngày mai', value: 2 },
                            { label: 'Trong tuần', value: 3 },
                            { label: 'Trong tháng', value: 4 },
                        ]}
                        selectedValue={this.state.value}
                        showSearchBox={false}
                        onValueChange={value => this.setState({ value: value, changed: true, valueText: false })}
                    />

                </View>
            )
        }

        if (this.state.fieldName == 'UserOwner') {
            return (
                <View style={styles.field}>
                    <UserSelect style={styles.select}
                        onValueChange={(value, item) => this.setState({ value, changed: true, valueText: false })}
                        selectedValue={this.state.value}
                    />
                </View>
            )
        }
        if (this.state.fieldName == 'ManagerId') {
            return (
                <View style={styles.field}>
                    <UserSelect style={styles.select}
                        onValueChange={(value, item) => this.setState({ value, changed: true, valueText: false })}
                        selectedValue={this.state.value} />
                </View>
            )
        }
        if (this.state.fieldName == 'CompanyId') {
            return (
                <View style={styles.field}>
                    <CompanySelect style={styles.select}
                        onValueChange={(value, item) => this.setState({ value, changed: true, valueText: false })}
                        selectedValue={this.state.value}
                        value={this.state.value}
                    />
                </View>
            )
        }
        if (this.state.fieldName == 'SourceId') {
            return (
                <View style={styles.field}>
                    <SourceSelect style={styles.select}
                        onValueChange={(value, item) => this.setState({ value, changed: true, valueText: false })}
                        selectedValue={this.state.value}
                        value={this.state.value}
                    />
                </View>
            )
        }
        if (this.state.fieldName == 'FirstName') {
            return (
                <View style={styles.field}>
                    <TextInput
                        underlineColorAndroid='transparent'
                        style={styles.input}
                        onChangeText={value => this.setState({ value: value, changed: true, valueText: true })}
                        value={this.state.value} />
                </View>
            )
        }
        // if (this.state.fieldName == 'LastName') {
        //     return (
        //         <View style={styles.field}>
        //             <TextInput
        //                 underlineColorAndroid='transparent'
        //                 style={styles.input}
        //                 onChangeText={value => this.setState({ value: value, changed: true, valueText: true })}
        //                 value={this.state.value} />
        //         </View>
        //     )
        // }


        let meta = this.props.fields.find(f => f.isMeta && f.name == this.state.fieldName);

        if (meta) {
            return (
                <View style={styles.field}>
                    {
                        this.renderMetaEditor(meta.type, meta.defaultValue)
                    }
                </View>
            )
        }

        return (
            <View style={styles.field}>
                <TextInput
                    underlineColorAndroid='transparent'
                    style={styles.input}
                    onChangeText={value => this.setState({ value: value, changed: true, valueText: true })}
                    value={this.state.value} />
            </View>
        )
    }

    renderMetaEditor = (type, defaultValue) => {
        switch (type) {
            case 'Date':
                return (
                    <DatePicker
                        style={styles.input}
                        format='DD/MM/YYYY'
                        date={this.state.value}
                        onDateChange={(date) => { this.setState({ value: date, changed: true }) }}
                    />
                )
            case 'DateTime':
                return (
                    <DatePicker
                        style={styles.input}
                        format='DD/MM/YYYY HH:mm'
                        date={this.state.value}
                        mode='datetime'
                        onDateChange={(date) => { this.setState({ value: date, changed: true }) }}
                    />
                )
            case 'Email':
                return (
                    <TextInput style={styles.input}
                        keyboardType='email-address'
                        underlineColorAndroid='transparent'
                        value={this.state.value}
                        onChangeText={value => this.setState({ value, changed: true })} />
                )
            case 'Phone':
                return (
                    <TextInput style={styles.input}
                        keyboardType='phone-pad'
                        underlineColorAndroid='transparent'
                        value={this.state.value}
                        onChangeText={value => this.setState({ value, changed: true })} />
                )
            case 'Number':
            case 'CostAmount':
            case 'CostPercent':
            case 'Float':
            case 'Single':
            case 'Integer':
            case 'Double':
                return (
                    <TextInput style={styles.textbox}
                        keyboardType='numeric'
                        underlineColorAndroid='transparent'
                        value={this.state.value}
                        onChangeText={value => this.setState({ value, changed: true })} />
                )
            case 'Switch':
            case 'Boolean':
            case 'Checkbox':
                let ok = (this.state.value + "").match(/true|on|1/i);
                return (
                    <Switch
                        value={ok}
                        onValueChange={value => this.setState({ value, changed: true })} />
                )
            case 'Gender':
                return (
                    <Select
                        items={[
                            { label: 'Nam', value: 'Male' },
                            { label: 'Nữ', value: 'Female' },
                            { label: 'Khác', value: 'Other' },
                        ]}
                        style={styles.select}
                        selectedValue={this.state.value}
                        showSearchBox={false}
                        onValueChange={value => this.setState({ value, changed: true })} />
                )
            case 'DropDownList':
                if (!!defaultValue) {
                    let list = defaultValue.split("\n");
                    return (
                        <Select
                            style={styles.select}
                            items={list.map(text => ({ label: text, value: text }))}
                            selectedValue={this.state.value}
                            showSearchBox={false}
                            onValueChange={value => this.setState({ value, changed: true })} />
                    )
                }
            default:
                return (
                    <TextInput style={styles.input}
                        underlineColorAndroid='transparent'
                        value={this.state.value}
                        onChangeText={value => this.setState({ value, changed: true })} />
                )
        }
    }

    render() {
        const fields = this.props.fields.map(item => ({
            // label: item.text,
            // value: item.name,
            label: item.label,
            value: item.fieldName,
            isMeta: item.isMeta
        }));
        // // console.log('this.props.fieldsfilter', fields);
        const conditions = [
            { label: 'Và', value: 1 },
            { label: 'Hoặc', value: 2 },
        ]

        return (
            <Animated.View style={[styles.item, { opacity: this.state.opacity }]}>
                <View style={styles.filter}>
                    <View style={styles.fieldWrap}>
                        <Text style={styles.lable}>{__('Trường')}</Text>
                        <View style={styles.field}>
                            <Select
                                items={fields}
                                selectedValue={this.state.fieldName}
                                showSearchBox={false}
                                onValueChange={(value, item) => {
                                    this.setState({
                                        fieldName: value,
                                        // text: item.text,
                                        value: null,
                                        changed: true,
                                        isMeta: item.isMeta
                                    })
                                }} />
                        </View>
                    </View>
                    {this.props.index != 0 &&
                        <View style={styles.fieldWrap}>
                            <Text style={styles.lable}>{__('Tiêu chí lọc')}</Text>
                            <View style={styles.field}>
                                <Select
                                    items={conditions}
                                    selectedValue={this.state.typeQuery}
                                    showSearchBox={false}
                                    onValueChange={value => this.setState({ typeQuery: value, changed: true, valueTypeQr: true })} />
                            </View>
                        </View>
                    }
                    {
                        this.state.typeQuery &&
                        // this.state.type.indexOf("Null") < 0 &&
                        <View style={styles.fieldWrap}>
                            <Text style={styles.lable}>{__('Giá trị')}</Text>
                            {
                                this.renderInput()
                            }
                        </View>
                    }
                </View>
                <RsTouchableNativeFeedback onPress={() => this.removeFilter(this.state.id)}>
                    <View style={styles.action}>
                        <Icon type='MaterialIcons' name="close" style={{ fontSize: 20 }} />
                    </View>
                </RsTouchableNativeFeedback>
            </Animated.View>
        )
    }
}

export default CustomerDataFilterItem;

const styles = StyleSheet.create({
    item: {
        flex: 1,
        marginVertical: 5,
        backgroundColor: '#f9f9f9',
        padding: 4,
        flexDirection: 'row',
    },
    filter: {
        flex: 1
    },
    action: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 6,
        margin: 4
    },
    fieldWrap: {
        flex: 1,
        flexDirection: 'row',
        padding: 4,
        alignItems: 'center',
    },
    lable: {
        flex: 3,
        color: '#666',
        fontWeight: 'bold'
    },
    field: {
        flex: 8,
        elevation: -1,
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    fieldItem: {

    },
    input: {
        fontSize: 16,
        color: '#333',
        paddingLeft: 8,
        paddingTop: 3,
    }
});