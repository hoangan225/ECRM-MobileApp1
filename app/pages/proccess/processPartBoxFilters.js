import React, { Component } from 'react';
import { BackAndroid, Modal, StyleSheet, View, Text, TextInput, ScrollView } from 'react-native';
import { Icon } from 'native-base';
import Toolbar from '../controls/toolbars';
// import { connect } from '../../lib/connect';
// import { getList as getListUser } from '../../actions/user';
import RsTouchableNativeFeedback from '../controls/touchable-native-feedback';
import UseSelect from '../user';
import sortType from '../../constants/sort';
import Select from '../controls/select';

const sorts = [
    { id: 1, key: "name", text: __("Tên cơ hội A-Z"), type: sortType.ASC },
    { id: 2, key: "name", text: __("Tên cơ hội Z-A"), type: sortType.DESC },
    { id: 3, key: "createDate", text: __("Ngày tạo cơ hội A-Z"), type: sortType.ASC },
    { id: 4, key: "createDate", text: __("Ngày tạo cơ hội Z-A"), type: sortType.DESC },
    { id: 5, key: "probability", text: __("Xác suất thành công 0-100"), type: sortType.ASC },
    { id: 6, key: "probability", text: __("Xác suất thành công 100-0"), type: sortType.DESC },
]

class ProcessDataFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filter: {
                ownerId: null,
            },
            sort: {
                key: 'createDate',
                type: 'desc'
            },
        };
    }

    onRequestClose = () => {
        this.props.onRequestClose();
    }

    changeSort = (id, value) => {
        // console.log(value)
        this.props.onSortChange({ key: value.key, type: value.type })
    }

    render() {

        if (!this.props.show) return null;
        const listSorts = sorts.map(item => ({
            label: item.text,
            value: item.id,
            key: item.key,
            type: item.type
        }));

        var active = sorts.find(item => item.key === this.props.sort.key && item.type === this.props.sort.type).id;
        // // console.log(active, '======');
        // // console.log(this.props.valueFilter, 'this.props.valueFilter----')

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
                        titleText='Lọc dữ liệu cơ hội'
                        titleColor='#000'
                    ></Toolbar>

                    <ScrollView style={styles.scrollView} keyboardShouldPersistTaps='always'>
                        <Text style={styles.title}>{__('Lọc dữ liệu')}</Text>

                        <UseSelect
                            selectTextStyle={styles.selectTextStyle}
                            placeholder={__('Phụ trách')}
                            style={styles.select}
                            onValueChange={id => this.props.onChange({ ownerId: id })}
                            selectedValue={this.props.valueFilter}
                        />
                        <Text style={styles.title}>{__('Sắp xếp dữ liệu')}</Text>
                        <Select
                            selectedValue={active}
                            items={listSorts}
                            style={styles.select}
                            selectTextStyle={styles.selectTextStyle}
                            arrowStyle={styles.arrowStyle}
                            showSearchBox={false}
                            onValueChange={(id, value) => this.changeSort(id, value)} />

                    </ScrollView>
                    <RsTouchableNativeFeedback onPress={this.onRequestClose} >
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

export default ProcessDataFilter;


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
    },
    select: {
        backgroundColor: '#fff',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#ccc',
        minHeight: 45,
        borderRadius: 5
    },
    selectTextStyle: { color: '#333' }
})