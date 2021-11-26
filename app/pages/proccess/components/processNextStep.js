import React, { Component } from 'react';
import moment from 'moment';
import {
    StyleSheet, View, TextInput, Modal, TouchableOpacity, ScrollView
} from 'react-native';
import { List, ListItem, Text, Left, Right, Icon } from 'native-base';
import { connect } from '../../../lib/connect';
// import JobBox from '../../job/jobPartBox';

class NextStep extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            viewJobId: null,
            openModelJob: false,
            currentJob: null,
        }
        this.canCreateJob = context.user.hasCap("Job.Create");
        this.canCreateEmail = context.user.hasCap("Email.Create");
        this.canCreateSms = context.user.hasCap("Sms.Create");
    }

    viewJob = (id) => {
        // console.log('viewJobId', id);
        // this.setState({ viewJobId: id })
    }

    addJob = () => {
        // console.log('create');
        this.setState({ openModelJob: true, currentJob: {}, })
    }

    handleCloseJob = () => {
        this.setState({ openModelJob: false, currentJob: null, })
    }

    render() {
        var dataProps = this.props.pram;
        if (dataProps) {
            var customerIds = [dataProps.customer.id];
            var processId = dataProps.processId;
            var stepId = dataProps.stepId;
        }

        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.row}>
                        <View style={styles.rowCenter}>
                            <View style={styles.rowLeft}>
                                <Icon type='FontAwesome' name='tasks' style={{ fontSize: 16 }} />
                                <Text style={{ padding: 10 }}>{__('Công việc')}</Text>
                            </View>
                            {
                                /* (this.props.processing && this.canCreateJob) &&
                                <View style={styles.right}>
                                    <TouchableOpacity onPress={this.addJob}>
                                        <Icon type='FontAwesome' name="plus-circle" style={{ fontSize: 22, padding: 5 }} />
                                    </TouchableOpacity>
                                </View> */
                            }
                        </View>
                        {
                            dataProps && dataProps.jobsProcessing.length == 0 ?
                                <View><Text>{__("Không có công việc nào")}</Text></View> :
                                <View>
                                    {dataProps && dataProps.jobsProcessing.map(job => (
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
                            dataProps && dataProps.customer.phone && dataProps.smsSended.length <= 0 ?
                                <View><Text>{__("Không có chiến dịch nào")}</Text></View> :
                                <View>
                                    {dataProps && dataProps.smsSended.length > 0 && dataProps.smsSended.map(sms =>
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
                            dataProps && dataProps.customer.email && dataProps.emailSended.length <= 0 ?
                                <View><Text>{__("Không có chiến dịch nào")}</Text></View> :
                                <View>
                                    {dataProps && dataProps.emailSended.length > 0 && dataProps.emailSended.map(email =>
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
                {/* <JobBox
                    customerIds={customerIds}
                    processId={processId}
                    stepId={stepId}
                    entry={this.state.currentJob}
                    show={this.state.openModelJob == true}
                    onRequestClose={this.handleCloseJob}
                    box='create' /> */}
            </View>
        );
    }
}

export default connect(NextStep);

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