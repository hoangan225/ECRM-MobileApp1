import moment from 'moment';
import React, { PureComponent } from 'react';
import { Platform, Linking, StyleSheet, View, Text, Image } from 'react-native';
import { Icon } from 'native-base';
import RsTouchableNativeFeedback from '../../controls/touchable-native-feedback';
import Avatar from '../../controls/avatar';
import ButtonCall from '../../voip/buttoncall';
import { connect } from "../../../lib/connect";

class CustomerListItem extends PureComponent {
    constructor(props) {
        super(props);
    }

    onPress = () => {
        this.props.showBox(this.props.customer, "details");
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

    openActionSheet = () => {
        if (!this.props.hideActionButton) {
            this.props.showBox(this.props.customer, 'actionsheet');
        }
    }

    render() {
        const { customer, fields, hideActionButton } = this.props;
        if (!customer) return null;
        var numPhone = customer && customer.phone;
        var str = numPhone && numPhone.split(',');

        return (
            <RsTouchableNativeFeedback
                onPress={this.onPress}
            >
                <View style={styles.customer}>
                    <Avatar url={customer.avatar} name={customer.fullName} id={customer.id} />
                    <View style={styles.customerInfo}>
                        <Text style={styles.customerTitle} ellipsizeMode='tail' numberOfLines={1}>
                            {customer.fullName}
                        </Text>
                        {
                            fields &&
                            fields.map((item, key) => {
                                switch (item.fieldName) {
                                    case 'Avatar':
                                    case 'FullName':
                                        return null;

                                    case 'Phone':
                                        return !!customer.phone && (
                                            <View key={key}>
                                                {str && str.length >= 2 ?
                                                    str.map((item, k) => (
                                                        <View style={styles.customerProp} key={k}>
                                                            <Icon type='MaterialIcons' name="phone" style={styles.icon} />
                                                            <View style={{ flexWrap: 'wrap' }}>
                                                                <ButtonCall text={__("Gọi : {0}", item)} phone={item || ""} style={{ marginLeft: 10 }} />
                                                            </View>
                                                        </View>
                                                    ))
                                                    :
                                                    <View style={styles.customerProp}>
                                                        <Icon type='MaterialIcons' name="phone" style={styles.icon} />
                                                        <ButtonCall text={__("Gọi : {0}", customer.phone)} phone={customer.phone || ""} style={{ marginLeft: 10 }} />
                                                    </View>
                                                }
                                            </View>

                                        )
                                    case 'Email':
                                        return !!customer.email && (
                                            <View style={styles.customerProp} key={key}>
                                                <Icon type='MaterialIcons' name="mail" style={styles.icon} />
                                                <Text style={styles.value} ellipsizeMode='tail' numberOfLines={1}>{customer.email}</Text>
                                            </View>
                                        )
                                    case 'Birthdate':
                                        return !!customer.birthdate && (
                                            <View style={styles.customerProp} key={key}>
                                                <Icon type='MaterialIcons' name="today" style={styles.icon} />
                                                <Text style={styles.value} ellipsizeMode='tail' numberOfLines={1}>Ngày sinh: {moment(customer.birthdate).format("DD/MM/YYYY")}</Text>
                                            </View>
                                        )
                                    case 'Old':
                                        return !!customer.birthdate && (
                                            <View style={styles.customerProp} key={key}>
                                                <Icon type='MaterialIcons' name="info" style={styles.icon} />
                                                <Text style={styles.value} ellipsizeMode='tail' numberOfLines={1}>Tuổi:  {moment().diff(customer.birthdate, 'years')}</Text>
                                            </View>
                                        )
                                    case 'Gender':
                                        return !!customer.gender && (
                                            <View style={styles.customerProp} key={key}>
                                                <Icon type='MaterialIcons' name="person" style={styles.icon} />
                                                <Text style={styles.value} ellipsizeMode='tail' numberOfLines={1}>Giới tính: {getEnumLabel(customer.gender, this.props.gender)}</Text>
                                            </View>
                                        )
                                    case 'Address':
                                        return !!customer.address && (
                                            <View style={styles.customerProp} key={key}>
                                                <Icon type='MaterialIcons' name="place" style={styles.icon} />
                                                <Text style={styles.value} ellipsizeMode='tail' numberOfLines={1}>{customer.address}</Text>
                                            </View>
                                        )
                                    default:
                                        return null;
                                }
                            })
                        }
                    </View>
                    {
                        !hideActionButton && (
                            <View style={[styles.customerAction]}>
                                <RsTouchableNativeFeedback onPress={this.openActionSheet} rippleBorderless={true}>
                                    <View>
                                        <Icon type='MaterialIcons' name="more-vert" size={25} style={styles.customerActionIcon} />
                                    </View>
                                </RsTouchableNativeFeedback>
                            </View>
                        )
                    }
                </View>
            </RsTouchableNativeFeedback>
        )
    }
}

export default connect(CustomerListItem, state => ({
    gender: state.app.enums.gender
}));


const styles = StyleSheet.create({
    customer: {
        flexDirection: 'row',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#f2f2f2',
        paddingVertical: 5
    },
    customerInfo: {
        flex: 1,
        paddingLeft: 5,
        paddingRight: 10
    },
    customerTitle: {
        fontSize: 15,
        paddingTop: 10,
        color: '#222'
    },
    customerProp: {
        flexDirection: 'row',
        alignItems: 'center'
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
    customerAction: {
        padding: 7,
    },
    customerActionIcon: {
        flex: 1,
        padding: 3,
        fontSize: 25,
    },

});