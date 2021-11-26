import React, { Component } from 'react';
import moment from 'moment';
import {
    StyleSheet, View, TextInput, Modal, TouchableOpacity, ScrollView
} from 'react-native';
import { List, ListItem, Text, Left, Right, Icon } from 'native-base';
import { connect } from '../../../lib/connect';

class WhoAction extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            viewJobId: null,
            openModelJob: false,
        }
        this.canCreateJob = context.user.hasCap("Job.Create");
        this.canCreateEmail = context.user.hasCap("Email.Create");
        this.canCreateSms = context.user.hasCap("Sms.Create");
    }

    render() {
        var propProcess = this.props.pram;
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.row}>
                        <View style={styles.rowCenter}>
                            <View style={styles.rowLeft}>
                                <Icon type='FontAwesome' name='tasks' style={{ fontSize: 16 }} />
                                <Text style={{ padding: 10 }}>{__('Công việc')}</Text>
                            </View>
                        </View>
                        {
                            propProcess && propProcess.jobsCompleted.length <= 0 ?
                                <View><Text>{__("Không có công việc nào")}</Text></View> :
                                <View>
                                    {propProcess && propProcess.jobsCompleted.map(job => (
                                        <View style={styles.rowCenter} key={job.id}>
                                            <View style={styles.rowLeft}>
                                                <TouchableOpacity onPress={this.viewJob}>
                                                    <Text style={{ color: 'green' }}> {job.name}</Text>
                                                    <Text>
                                                        {this.props.processing ? __("Hạn chót : {0}", moment(job.deadline).format("L")) : __("Ngày hoàn thành {0}", moment(job.completeDate).format("L"))}
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                        }

                    </View>
                    <View style={[styles.row, { backgroundColor: '#eee' }]}>
                        <View style={styles.rowCenter}>
                            <View style={styles.rowLeft}>
                                <Icon type='FontAwesome' name='comments' style={{ fontSize: 16 }} />
                                <Text style={{ padding: 10 }}>{__('SMS')}</Text>
                            </View>


                        </View>
                        {
                            propProcess && propProcess.smsProcessing.length == 0 ?
                                <View><Text>{__("Không có chiến dịch nào")}</Text></View> :
                                <View>
                                    {propProcess && propProcess.smsProcessing.length > 0 && propProcess.smsProcessing.map(sms =>
                                        (
                                            <View key={sms.id} style={{ flexDirection: 'row' }}>
                                                <Text style={{ flex: 1 }}>{sms.name}</Text>
                                                <Text>{__("Thời gian gửi : {0}", moment(sms.sendDate).format("L"))}</Text>
                                            </View>
                                        )
                                    )}
                                </View>
                        }
                    </View>
                    <View style={styles.row}>
                        <View style={styles.rowCenter}>
                            <View style={styles.rowLeft}>
                                <Icon type='FontAwesome' name='envelope-open' style={{ fontSize: 16 }} />
                                <Text style={{ padding: 10 }}>{__('Email')}</Text>
                            </View>

                        </View>
                        {
                            propProcess && propProcess.emailsProcessing.length <= 0 ?
                                <View><Text>{__("Không có chiến dịch nào")}</Text></View> :
                                <View>
                                    {propProcess && propProcess.emailSended.length > 0 && propProcess.emailSended.map(email =>
                                        (
                                            <View key={email.id} style={{ flexDirection: 'row' }}>
                                                <Text style={{ flex: 1 }}>{email.name}</Text>
                                                <Text>{__("Thời gian gửi : {0}", moment(email.sendDate).format("L"))}</Text>
                                            </View>
                                        )
                                    )}
                                </View>
                        }
                    </View>

                </ScrollView>

            </View>
        );
    }
}

export default connect(WhoAction);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    row: { padding: 15, borderWidth: StyleSheet.hairlineWidth, borderColor: '#ccc', },
    rowCenter: { flexDirection: 'row', alignItems: 'center' },
    rowLeft: { flex: 1, flexDirection: 'row', alignItems: 'center' },
    textJob: {
        alignItems: 'center',
    },
    right: {
        alignItems: 'center',
    }

});