import moment from 'moment';
import React, { PureComponent } from 'react';
import { Platform, Linking, StyleSheet, View, Text, Image, Alert } from 'react-native';
import { Icon, Button, CheckBox } from 'native-base';
import RsTouchableNativeFeedback from '../controls/touchable-native-feedback';
import Avatar from '../controls/avatar';
import { connect } from "../../lib/connect";
import APP_ID from "../../constants/app_id";
import RenderRadio from "../controls/checkBox";

class PagesListItem extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            checkeds: props.checkedsList,
        }
    }

    componentDidUpdate(props) {
        this.setState({
            checkeds: this.props.checkedsList,
        })
    }

    onPress = () => {
        this.props.showBox(this.props.pages, "convension");
    }

    onCheckPage = (page) => {
        var listChecked = this.props.checkedsList;
        if (!listChecked.contains(page.id)) {
            // // console.log(listChecked, "listChecked-", page.id)
            // this.setState({
            //     checkeds: [...listChecked, page.id].distinct()
            // })
            this.props.checkeds([...listChecked, page.id]);
        } else {
            listChecked = listChecked.filter(x => x != page.id).distinct();
            // // console.log(listChecked, "listChecked-=", page.id)

            // this.setState({
            //     checkeds: listChecked
            // })
            this.props.checkeds(listChecked);
        }
    }

    setSelectedValue = (page) => {
        console.log(page, "page")
        var listChecked = this.props.checkedsList;
        if (!listChecked.contains(page.id)) {
            // // console.log(listChecked, "listChecked-", page.id)
            // this.setState({
            //     checkeds: [...listChecked, page.id].distinct()
            // })
            this.props.checkeds([...listChecked, page.id]);
        } else {
            listChecked = listChecked.filter(x => x != page.id).distinct();
            // // console.log(listChecked, "listChecked-=", page.id)

            // this.setState({
            //     checkeds: listChecked
            // })
            this.props.checkeds(listChecked);
        }
        // this.setState(selectedValue : value)
    }
    render() {
        const { pages, fields, hideActionButton, showMerge } = this.props;
        if (!pages) return null;
        var numPhone = pages && pages.phone;
        var str = numPhone && numPhone.split(',');
        var listChecked = this.state.checkeds;
        // console.log(listChecked.contains(pages.id), "listCheckedlistChecked")

        return (
            <View style={showMerge && styles.wrapMerge}>
                <View style={styles.pages}>
                    {
                        showMerge &&
                        <View style={{ marginRight: 8, marginTop: 10, justifyContent: "center", alignItems: "center", width: 50, height: 50 }}>
                            <RenderRadio onChange={() => this.setSelectedValue(pages)} selectedValue={listChecked.contains(pages.id) ? true : false} value={listChecked.contains(pages.id) ? true : false} />
                        </View>
                    }


                    <Avatar
                        url={
                            `https://graph.facebook.com/${pages.pageId}/picture?app_id=${APP_ID.app_id}` ||
                            pages.avatar
                        }
                        style={{}}
                        name={pages.name}
                        id={pages.id} />
                    <RsTouchableNativeFeedback
                        onPress={this.onPress}
                        style={styles.pagesInfo}
                    // rippleBorderless={true}
                    >
                        <Text style={styles.pagesTitle} ellipsizeMode='tail' numberOfLines={2}>
                            {pages.name}
                        </Text>
                    </RsTouchableNativeFeedback>
                    {
                        // <View style={[styles.pagesAction]}>
                        //     <RsTouchableNativeFeedback
                        //         onPress={this.onPress}
                        //     >
                        //         <Icon type='MaterialIcons' name="chevron-right" style={styles.pagesActionIcon} />
                        //     </RsTouchableNativeFeedback>
                        // </View>
                    }
                </View>

            </View>
        )
    }
}

export default connect(PagesListItem, state => ({
    fbPage: state.fbPageMessage,
    message: state.fbMessage,
}));


const styles = StyleSheet.create({
    wrapMerge: {
        flex: 1
        // flexDirection: "row",
        // justifyContent: "center",
        // alignItems: "center"
    },
    pages: {
        flex: 1,
        flexDirection: 'row',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#f2f2f2',
        paddingVertical: 5
    },
    pagesInfo: {
        flex: 1,
        paddingLeft: 5,
        paddingRight: 10,
    },
    pagesTitle: {
        fontSize: 15,
        paddingTop: 10,
        marginTop: 10,
        color: '#222'
    },
    pagesProp: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    checkbox: {
        alignSelf: "center",
    },
    icon: {
        fontSize: 12,
        // color: '#999'
        color: '#00000096',
    },
    value: {
        fontSize: 12,
        color: '#00000096',
        marginLeft: 10
    },
    pagesAction: {
        padding: 7,
    },
    pagesActionIcon: {
        // flex: 1,
        padding: 3,
        fontSize: 28,
    },

});