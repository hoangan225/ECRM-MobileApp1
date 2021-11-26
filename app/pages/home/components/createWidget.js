import React, { Component } from 'react';
import { Platform, StyleSheet, View, Image, Text, ScrollView, Dimensions, TouchableOpacity, TextInput } from 'react-native';
import { Icon } from 'native-base';
import Toolbar from '../../controls/toolbars';
import Select from '../../controls/select';
import Menu, { MenuModalContext } from '../../controls/action-menu';
import defaultLayout from '../defaultLayout';
import { connect } from '../../../lib/connect';
let screenWidth = Dimensions.get("window").width;
let screenHeight = Dimensions.get("window").height;
class CreateWidget extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            loading: false,
            refreshing: false,
            ready: false,
            widgetSelected: null,
            widget: {
                calendar: {
                    title: "Lịch công việc",
                },
                job: {
                    title: "Công việc hiện tại",
                    statusId: '',
                },
                conversion: {
                    title: "Tỉ lệ chuyển đổi cơ hội",
                    rangeType: '',
                },
                customer: {
                    title: "Thống kê khách hàng",
                    rangeType: '',
                },
                wifi: {
                    title: "Truy cập wifi",
                }
            },
            widgets: this.props.param || {},
        }
    }



    setWidget = (obj, key) => {
        // console.log(obj, key)
        this.setState({
            widget: {
                ...this.state.widget,
                [key]: {
                    ...this.state.widget[key],
                    ...obj
                }
            }
        })
    }

    getLayout = () => {
        if (defaultLayout[this.state.widgetSelected]) {
            return defaultLayout[this.state.widgetSelected];
        }
        return defaultLayout.extra;
    }


    save = () => {
        const data = {
            ...this.state.widget[this.state.widgetSelected],
            type: this.state.widgetSelected,
            layout: this.getLayout(),
        }
        this.props.onSave(data);
        this.props.onRequestClose();
    }

    hasCap = (key) => {
        const lstCaps = this.props.caps[key];
        if (Array.isArray(lstCaps))
            return lstCaps.filter(cap => !this.context.user.hasCap(cap)).isEmpty();
    }

    render() {
        let widgets = this.props.canCreateWidget;
        return (
            <MenuModalContext onRequestClose={this.props.onRequestClose}>
                <View style={styles.page}>
                    <Toolbar
                        icon={<Icon type='MaterialIcons' style={{ fontSize: 22, color: '#fff' }} name='arrow-back' size={22} />}
                        onIconPress={this.props.onRequestClose}
                        titleText='Thêm widget'
                        actions={[
                            {
                                icon: <Icon type='MaterialIcons' name='save' style={{ fontSize: 22, color: '#fff', paddingRight: 5 }} />,
                                onPress: this.save
                            }
                        ]}
                    ></Toolbar>

                    <ScrollView>
                        {widgets && widgets.layout.map((item, key) => {
                            switch (item.i) {
                                case 'calendar':
                                    return null
                                default:
                                    break;
                            }
                        })}
                        {
                            this.hasCap("job") &&
                            <TouchableOpacity onPress={() => this.setState({ widgetSelected: 'job' })} style={styles.box}>
                                <View style={[styles.titleThumbnail, { marginTop: 0 }, this.state.widgetSelected === 'job' ? { backgroundColor: 'rgb(58, 175, 255)' } : { backgroundColor: 'rgba(50,199,135,.6)' }]}>
                                    <Text style={styles.titleTextThumb}>Công việc</Text>
                                </View>
                                <View style={styles.imgThumbnails}>
                                    <Image
                                        source={require('../../../assets/widget/job.png')}
                                        resizeMode='cover'
                                    />
                                </View>
                                {this.state.widgetSelected === 'job' && <View style={styles.titleInp}>
                                    <Text style={{ color: '#fff', paddingLeft: 5 }}>Tiêu đề</Text>
                                    <TextInput
                                        value={this.state.widget.job.title}
                                        onChangeText={title => this.setWidget({ title }, 'job')}
                                        underlineColorAndroid='transparent'
                                        style={styles.input}
                                    />
                                </View>
                                }
                            </TouchableOpacity>
                        }
                        <TouchableOpacity onPress={() => this.setState({ widgetSelected: 'calendar' })} style={styles.box}>
                            <View style={[styles.titleThumbnail, { marginTop: 0 }, this.state.widgetSelected === 'calendar' ? { backgroundColor: 'rgb(58, 175, 255)' } : { backgroundColor: 'rgba(50,199,135,.6)' }]}>
                                <Text style={styles.titleTextThumb}>Lịch</Text>
                            </View>
                            <View style={styles.imgThumbnails}>
                                <Image
                                    source={require('../../../assets/widget/calendar.png')}
                                    resizeMode='cover'
                                    style={styles.image}
                                />
                            </View>
                            {this.state.widgetSelected === 'calendar' && <View style={styles.titleInp}>
                                <Text style={{ color: '#fff', paddingLeft: 5 }}>Tiêu đề</Text>
                                <TextInput
                                    value={this.state.widget.calendar.title}
                                    onChangeText={title => this.setWidget({ title }, 'calendar')}
                                    underlineColorAndroid='transparent'
                                    style={styles.input}
                                />
                            </View>
                            }
                        </TouchableOpacity>


                        <TouchableOpacity onPress={() => this.setState({ widgetSelected: 'customer' })} style={styles.box}>
                            <View style={[styles.titleThumbnail, this.state.widgetSelected === 'customer' ? { backgroundColor: 'rgb(58, 175, 255)' } : { backgroundColor: 'rgba(50,199,135,.6)' }]}>
                                <Text style={styles.titleTextThumb}>Khách hàng</Text>
                            </View>
                            <View style={styles.imgThumbnails}>
                                <Image
                                    source={require('../../../assets/widget/customer.png')}
                                    resizeMode='cover'
                                    style={styles.image}
                                />
                            </View>
                            {this.state.widgetSelected === 'customer' && <View style={styles.titleInp}>
                                <Text style={{ color: '#fff', paddingLeft: 5 }}>Tiêu đề</Text>
                                <TextInput
                                    value={this.state.widget.customer.title}
                                    onChangeText={title => this.setWidget({ title }, 'customer')}
                                    underlineColorAndroid='transparent'
                                    style={styles.input}
                                />
                                <Text style={{ color: '#fff', paddingLeft: 5 }}>Khoảng thời gian</Text>
                                <Select
                                    style={{ backgroundColor: '#fff', paddingLeft: 10, margin: 5 }}
                                    items={this.props.ranges}
                                    selectTextStyle={styles.selectTextStyle}
                                    arrowStyle={styles.arrowStyle}
                                    selectedValue={this.state.widget.customer.rangeType}
                                    showSearchBox={false}
                                    onValueChange={rangeType => this.setWidget({ rangeType }, 'customer')} />
                            </View>
                            }
                        </TouchableOpacity>

                    </ScrollView>
                </View>
            </MenuModalContext>
        );
    }
}

export default connect(CreateWidget, state => ({
    ranges: state.app.enums.rangeType
}), null);


const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: '#eee'
    },
    toolbar: {
        flexDirection: 'row',
        padding: 6,
        backgroundColor: '#eee'
    },
    imgThumbnails: {
        width: screenWidth,
        height: screenHeight / 4,
        alignItems: 'center',
        overflow: 'hidden',
    },
    titleThumbnail: {
        paddingVertical: 5,
    },
    titleTextThumb: {
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold',
    },
    box: {
        backgroundColor: '#ffff',
        margin: 10,
    },
    image: {
        // borderBottomColor: 'green',
        // borderBottomWidth: 2,
    },
    titleInp: {
        backgroundColor: 'rgb(58, 175, 255)',
        position: 'absolute',
        bottom: 0, left: 0,
        right: 0
    },
    input: {
        backgroundColor: '#fff',
        color: '#333',
        paddingLeft: 10,
        margin: 5,
    },
    selectTextStyle: {
        color: '#333',
        // fontSize: 16,
        // fontWeight: 'bold',
    },
    arrowStyle: {
        color: '#333',
        fontSize: 30
    },
});
