import lodash from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet, View, Modal, ScrollView, Dimensions, Text, TextInput,
    TouchableWithoutFeedback, Platform, ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RsTouchableNativeFeedback from './touchable-native-feedback';

const styles = StyleSheet.create({
    container: {
        minHeight: 40
    },
    dropdownContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,.6)',
    },
    dropdown: {
        borderRadius: 4,
        backgroundColor: '#fff',
        elevation: 4,
        shadowColor: 'black',
        shadowOpacity: 0.1,
        shadowRadius: StyleSheet.hairlineWidth * 4,
        shadowOffset: {
            height: StyleSheet.hairlineWidth * 4,
        },
        marginVertical: 40
    },
    select: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 4,
        paddingRight: 10
    },
    selectDisabled: {
        backgroundColor: '#f7f7f7',
    },
    selectedItems: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        paddingVertical: 2
    },
    selectedItem: {
        flexDirection: 'row',
        backgroundColor: '#8fb9fc',
        marginTop: 2,
        marginBottom: 2,
        marginRight: 4,
        padding: 4,
        alignItems: 'center',
        borderRadius: 4
    },
    selectedItemIcon: {
        fontSize: 14,
    },
    selectText: {
        color: '#111',
        fontSize: 15,
    },
    selectTextMultiple: {
        color: '#444',
        marginRight: 10
    },
    selectTextPlaceholder: {
        color: '#999'
    },
    arrow: {
        fontSize: 24
    },
    search: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        borderBottomWidth: StyleSheet.hairlineWidth * 2,
        borderBottomColor: '#ccc',
        height: 54
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        marginLeft: 10
    },
    searchIcon: {
        fontSize: 22,
    },
    list: {
        paddingVertical: 10,
        minHeight: 100
    },
    item: {
        paddingHorizontal: 20,
        height: 40,
        justifyContent: 'center',
    },
    itemSelected: {
        backgroundColor: '#8fb9fc'
    },
    itemText: {
        fontSize: 15,
        color: '#222'
    },
    footerLoading: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15
    },
    searchLoading: {
        flex: 1,
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0.1)'
    }
});

class SelectControl extends Component {
    constructor(props) {
        super(props);

        const selectedValue = Array.isArray(this.props.selectedValue) ? this.props.selectedValue : [this.props.selectedValue];

        this.state = {
            show: false,
            keyword: null,
            selectedItems: this.props.items.filter(item => selectedValue.find(value => value == item.value))
        }
        this.listHeight = 0;
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const selectedValue = Array.isArray(newProps.selectedValue) ? newProps.selectedValue : [newProps.selectedValue];
        this.setState({
            selectedItems: newProps.items.filter(item => selectedValue.find(value => value == item.value))
        });
    }

    componentDidUpdate() {
        if (this.props.loading == 'more') {
            setTimeout(() => {
                this.scrollView && this.scrollView.scrollToEnd && this.scrollView.scrollToEnd();
            }, 3000);
        }
    }

    search = () => {
        if (this.scrollView) {
            this.scrollView.scrollTo({ y: 0 });
        }
        if (this.props.onSearch) {
            this.props.onSearch(this.state.keyword)
        }
    }

    loadMore = () => {
        if (this.props.onScrollEnd) {
            this.props.onScrollEnd();
        }
    }

    showDropdown = () => {
        this.setState({
            show: true
        })
    }

    hideDropdown = () => {
        this.setState({
            show: false
        })
    }

    onItemPress = (item) => {
        // console.log('foundselectitem', item);
        if (this.props.multiple) {
            const found = this.state.selectedItems.find(tt => tt.value == item.value);
            if (found) {
                // // console.log('foundselect', this.state.selectedItems);
                // this.state.selectedItems.remove(tt => tt.value == item.value);
                var ar = this.state.selectedItems;
                for (var i = 0; i < ar.length; i++) {
                    if (ar[i].value == item.value) {
                        ar.splice(i, 1);
                    }
                }
            }
            else {
                this.state.selectedItems.push(item);
            }
            // if (this.props.onValueChange && Platform.OS != 'ios') {
            this.props.onValueChange(this.state.selectedItems.map(tt => tt.value), this.state.selectedItems);
            // }
        }
        else {
            this.state.selectedItems = [item];
            // if (this.props.onValueChange && Platform.OS != 'ios') {
            this.props.onValueChange(item.value, item);
            // }
        }

        this.setState({ show: false, itemPressed: Platform.OS === 'ios' ? true : false });
    }

    onTyping = (keyword) => {
        this.setState({ keyword: keyword });
        if (this.props.autoSearch && this.props.onSearch) {
            this.props.onSearch(keyword)
        }
    }

    onListLayout = (event) => {
        this.listHeight = event.nativeEvent.layout.height;
    }

    onScroll = (e) => {
        let height = e.nativeEvent.contentSize.height;
        let offset = e.nativeEvent.contentOffset.y;
        let total = this.listHeight + offset;
        if (total >= height - 0.5) {
            this.loadMore();
        }
    }

    submitChange = () => {
        if (this.props.onValueChange) {
            if (this.state.itemPressed) {
                if (this.props.multiple) {
                    this.props.onValueChange(this.state.selectedItems.map(tt => tt.value), this.state.selectedItems);
                }
                else {
                    this.props.onValueChange(this.state.selectedItems[0].value, this.state.selectedItems[0]);
                }
            }
        }
        this.setState({ itemPressed: false });
    }

    render() {
        // // console.log('items selectedValue', this.props.selectedValue);
        const window = Dimensions.get('window');

        const count = this.props.data ? this.props.data.length : 0;
        const height = Math.min(count * 30 + 80, window.height - 140);

        const width = Math.min(400, window.width - 60);

        const dropdownStyle = {
            //height: height,
            width: width,
            ...this.props.dropdownStyle
        }

        const hasValue = this.state.selectedItems.length > 0;

        return (
            <View style={[styles.container, this.props.style]}>
                <TouchableWithoutFeedback onPress={this.showDropdown} disabled={this.props.disabled}>
                    <View style={[styles.select, this.props.selectStyle, this.props.disabled ? styles.selectDisabled : null]}>
                        <View style={styles.selectedItems}>
                            {
                                !this.props.multiple ?

                                    <Text style={[styles.selectText, hasValue ? null : styles.selectTextPlaceholder, this.props.selectTextStyle]}>
                                        {hasValue ? this.state.selectedItems[0].label : this.props.placeholder}</Text>
                                    :

                                    this.state.selectedItems.map((item, index) => (
                                        <View style={styles.selectedItem} key={index}>
                                            <Text style={[styles.selectText, styles.selectTextMultiple, this.props.selectTextStyle]}>{item.label}</Text>
                                            <RsTouchableNativeFeedback onPress={() => this.onItemPress(item)}
                                                disabled={this.props.disabled}>
                                                <View><Icon style={styles.selectedItemIcon} type="MaterialIcons" name="close" /></View>
                                            </RsTouchableNativeFeedback>
                                        </View>
                                    ))

                            }
                        </View>
                        {
                            !this.props.disabled && (
                                <RsTouchableNativeFeedback onPress={this.showDropdown} rippleBorderless={true}>
                                    <View><Icon style={[styles.arrow, this.props.arrowStyle]} type="MaterialIcons" name="arrow-drop-down" /></View>
                                </RsTouchableNativeFeedback>
                            )
                        }
                    </View>
                </TouchableWithoutFeedback>
                <Modal
                    supportedOrientations={['portrait', 'landscape']}
                    style={styles.options}
                    visible={this.state.show}
                    transparent={true}
                    onRequestClose={this.hideDropdown}
                    onDismiss={Platform.OS == "ios" ? this.submitChange : () => { console.log("none dismiss") }}
                    animationType="fade" >
                    <TouchableWithoutFeedback onPress={this.hideDropdown}>
                        <View style={styles.dropdownContainer}>
                            <TouchableWithoutFeedback>
                                <View style={[styles.dropdown, dropdownStyle]}>
                                    {
                                        this.props.showSearchBox != false &&
                                        <View style={styles.search}>
                                            <RsTouchableNativeFeedback onPress={this.hideDropdown} rippleBorderless={true}>
                                                <View><Icon style={styles.searchIcon} type="MaterialIcons" name="arrow-back" /></View>
                                            </RsTouchableNativeFeedback>
                                            <TextInput
                                                placeholder={this.props.searchPlaceholder || 'Tìm kiếm...'}
                                                multiline={false}
                                                underlineColorAndroid='transparent'
                                                onChangeText={this.onTyping}
                                                returnKeyType='search'
                                                onSubmitEditing={this.search}
                                                value={this.state.keyword}
                                                style={styles.searchInput} />
                                            <RsTouchableNativeFeedback onPress={this.search} rippleBorderless={true} >
                                                <View><Icon type="MaterialIcons" name="search" style={styles.searchIcon} /></View>
                                            </RsTouchableNativeFeedback>
                                        </View>
                                    }
                                    <ScrollView
                                        ref={scrollView => { this.scrollView = scrollView }}
                                        onScroll={this.onScroll}
                                        onLayout={this.onListLayout}
                                        keyboardShouldPersistTaps='always'
                                        contentContainerStyle={styles.list}>
                                        {
                                            this.props.items &&
                                            this.props.items.map((item, index) => (
                                                <View key={index}>
                                                    <RsTouchableNativeFeedback
                                                        key={index} onPress={() => this.onItemPress(item)}
                                                        delayPressIn={100} >
                                                        {this.renderItem(item, index)}
                                                    </RsTouchableNativeFeedback>
                                                </View>
                                            ))
                                        }
                                        {
                                            this.props.loading == "search" &&
                                            <View style={styles.searchLoading}>
                                                <ActivityIndicator />
                                            </View>
                                        }
                                    </ScrollView>
                                    {
                                        this.props.loading == 'more' &&
                                        <View style={styles.footerLoading}>
                                            <ActivityIndicator />
                                        </View>
                                    }
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </View >
        )
    }

    renderItem = (item, index) => {
        const selected = this.state.selectedItems.find(tt => tt.value == item.value);
        if (this.props.renderItem) {
            return this.props.renderItem(item, selected);
        }
        else {
            return (
                <View style={[styles.item, selected ? styles.itemSelected : null]}>
                    <Text style={styles.itemText}>{item.label || 'no-text'}</Text>
                </View>
            )
        }
    }
}

SelectControl.propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.any.isRequired,
        group: PropTypes.string,
        data: PropTypes.any
    })).isRequired,
    selectedValue: PropTypes.any,
    multiple: PropTypes.bool,
    onValueChange: PropTypes.func,
    autoSearch: PropTypes.bool,
    onScrollEnd: PropTypes.func,
    onSearch: PropTypes.func,
    renderItem: PropTypes.func,
    showSearchBox: PropTypes.bool,
    loading: PropTypes.oneOf(["more", "search", "none"]),
    style: PropTypes.any,
    dropdownStyle: PropTypes.any,
    selectStyle: PropTypes.any,
    arrowStyle: PropTypes.any,
    searchPlaceholder: PropTypes.string,
    placeholder: PropTypes.string,
}

export default SelectControl;