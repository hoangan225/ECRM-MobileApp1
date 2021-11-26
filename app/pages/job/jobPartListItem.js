import moment from 'moment';
import React, { PureComponent } from 'react';
import { Platform, StyleSheet, View, RefreshControl, Text } from 'react-native';
import { Icon } from 'native-base';

import RsTouchableNativeFeedback from '../controls/touchable-native-feedback';

class JobListItem extends PureComponent {
    constructor(props) {
        super(props);
    }

    onPress = () => {
        this.props.showBox(this.props.job, "details");
    }

    openActionSheet = () => {
        if (!this.props.hideActionButton) {
            this.props.showBox(this.props.job, "actionSheet");
        }
    }

    render() {
        const job = this.props.job;
        // // console.log('this.props.job.itemslist',job)
        const customer = job.customers.map(c => c.name).join(', ');
        return (
            <RsTouchableNativeFeedback
                onPress={this.onPress}
            // onLongPress={this.openActionSheet}
            >
                <View style={styles.job}>
                    <View style={styles.jobInfo}>
                        <View style={styles.jobProp}>
                            <Icon type='MaterialIcons' name="label" style={[styles.propIcon, { color: job.color }]} />
                            <Text style={[styles.propValue, styles.jobName]}
                                numberOfLines={1}
                                ellipsizeMode='tail'>
                                {job.name}
                            </Text>
                        </View>
                        {
                            !!customer &&
                            <View style={styles.jobProp}>
                                <Icon type='MaterialIcons' name="account-box" style={styles.propIcon} />
                                <Text style={styles.propValue}>{job.customers.map(c => c.name).join(', ')}</Text>
                            </View>
                        }
                        <View style={styles.jobProp}>
                            <Icon type='MaterialIcons' name="person" style={styles.propIcon} />
                            <Text style={styles.propValue}>{job.users.filter(u => u.isPrimary).map(c => c.name)[0]}</Text>
                        </View>
                        <View style={styles.jobProp}>
                            <Icon type='MaterialIcons' name="access-time" style={styles.propIcon} />
                            <Text style={styles.propValue}>
                                {moment(job.startDate).format('L HH:mm')} - {moment(job.deadline).format('L HH:mm')}
                            </Text>
                        </View>
                    </View>
                    {
                        !this.props.hideActionButton && (
                            <View style={styles.jobAction}>
                                <RsTouchableNativeFeedback onPress={this.openActionSheet} rippleBorderless={true}>
                                    <View>
                                        <Icon type='MaterialIcons' name="more-vert" size={25} style={styles.jobActionIcon} />
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

export default JobListItem


const styles = StyleSheet.create({
    job: {
        flexDirection: 'row',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#f2f2f2',
        paddingVertical: 5
    },
    jobInfo: {
        flex: 1,
        marginVertical: 5,
        paddingHorizontal: 10,
    },
    jobTitle: {
        fontSize: 14,
        paddingTop: 10,
        color: '#222'
    },
    jobAction: {
        padding: 7,
    },
    jobActionIcon: {
        flex: 1,
        padding: 3,
        fontSize: 25
    },
    jobName: {
        color: '#111'
    },
    jobProp: {
        flexDirection: 'row',
    },
    propIcon: {
        fontSize: 14,
        color: '#999',
        paddingTop: 3,
        paddingLeft: 2
    },
    propValue: {
        fontSize: 14,
        color: '#999',
        marginLeft: 10
    },
    cancel: {
        textDecorationLine: 'line-through'
    }
});
