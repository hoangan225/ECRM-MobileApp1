import React, { PureComponent } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import RsTouchableNativeFeedback from '../controls/touchable-native-feedback';
import { Icon } from 'native-base';
import Avatar from '../controls/avatar';
import ButtonCall from '../voip/buttoncall';
class ProcessListItem extends PureComponent {
    constructor(props) {
        super(props);
    }

    onPress = () => {
        this.props.showBox(this.props.data, 'details')
    }

    openActionSheet = () => {
        if (!this.props.hideActionButton) {
            this.props.showBox(this.props.data, 'actionSheet')
        }
    }

    render() {

        const { data, entryField } = this.props;
        const price = (data.revenue || data.expectedRevenue || 0).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
        if (!data) return null;

        return (
            <RsTouchableNativeFeedback
                onPress={this.onPress}
            // onLongPress={this.openActionSheet}
            >

                <View style={styles.item}>
                    <Avatar url={data.customer.avatar} name={data.name} id={data.id} />
                    <View style={styles.itemInfo}>
                        <Text style={styles.itemTitle} ellipsizeMode='tail' numberOfLines={1}>
                            {data.customer.fullName}
                        </Text>
                        {
                            this.props.step && this.props.step.name && (
                                <View style={styles.itemProp}>
                                    <Text style={styles.stepName}>{this.props.step.name}</Text>
                                </View>
                            )
                        }
                        {
                            !this.props.hidePrice && (
                                <View style={styles.itemProp}>
                                    <Icon name="attach-money" type='MaterialIcons' style={styles.icon} />
                                    <Text style={styles.value}>
                                        {price.toLocaleString()} VNĐ</Text>
                                </View>
                            )
                        }
                        {
                            this.props.showCompany && !!data.company && (
                                <View style={styles.itemProp}>
                                    <Icon type='MaterialIcons' name="business" style={styles.icon} />
                                    <Text style={styles.value}>
                                        {data.company}</Text>
                                </View>
                            )
                        }
                        {

                            !!data.customer.phone && (
                                <View style={styles.itemProp}>
                                    <Icon type='MaterialIcons' name="phone" style={styles.icon} />
                                    <ButtonCall text={__("Gọi : {0}", data.customer.phone)} phone={data.customer.phone || ""} style={{ marginLeft: 10 }} />
                                    {/* 
                                    <Text style={styles.value}>
                                        {data.customer.phone}</Text>
                                        */}
                                </View>
                            )
                        }
                        {
                            !!data.customer.email && (
                                <View style={styles.itemProp}>
                                    <Icon type='MaterialIcons' name="mail" style={styles.icon} />
                                    <Text style={styles.value}>
                                        {data.customer.email}</Text>
                                </View>
                            )
                        }
                        {
                            this.props.showReason && !!data.reason && (
                                <View style={styles.itemProp}>
                                    <Icon type='MaterialIcons' name="info" style={[styles.icon, { color: 'red' }]} />
                                    <Text style={[styles.value, { color: 'red' }]}>
                                        {data.reason}</Text>
                                </View>
                            )
                        }


                    </View>
                    {
                        !this.props.hideActionButton && (
                            <View style={styles.itemAction}>
                                <RsTouchableNativeFeedback onPress={this.openActionSheet} rippleBorderless={true}>
                                    <View>
                                        <Icon name="more-vert" type='MaterialIcons' size={25} style={styles.itemActionIcon} />
                                    </View>
                                </RsTouchableNativeFeedback>
                            </View>
                        )
                    }
                </View>
            </RsTouchableNativeFeedback>
        );
    }
}

export default ProcessListItem;


const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#f2f2f2',
        paddingVertical: 5
    },
    itemInfo: {
        flex: 1,
        paddingLeft: 5,
        paddingRight: 10
    },
    itemTitle: {
        fontSize: 14,
        paddingTop: 10,
        color: '#222'
    },
    itemProp: {
        flexDirection: 'row',
        //alignItems: 'center'
    },
    icon: {
        fontSize: 14,
        color: '#999',
        marginTop: 2
    },
    value: {
        fontSize: 14,
        color: '#999',
        marginLeft: 10
    },
    itemAction: {
        padding: 7,
    },
    itemActionIcon: {
        flex: 1,
        padding: 3,
    },
    stepName: {
        backgroundColor: '#F39C12',
        color: '#fff',
        borderRadius: 3,
        paddingHorizontal: 5
    }
});
