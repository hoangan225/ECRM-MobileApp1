import React, { Component } from 'react';
import { FlatList, StyleSheet, Alert, RefreshControl, TouchableOpacity, ActivityIndicator } from "react-native";
import { List, View, Spinner, Text, Button, Content } from 'native-base';
import * as actions from '../../actions/facebookMessage/page';
import * as fbactions from "../../actions/facebookMessage/message";
import { connect } from '../../lib/connect';
import Loading from '../controls/loading';
import PagesListItem from './pagesListItems';
import { search as s } from "../../lib/helpers";
import Toast from '../controls/toast';
class Pages extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            page: this.props.page,
            pagesize: 20,
            msg: null,
            refreshing: false,
            selectedValueName: null,
            curentBox: null,
            curentCustomer: null,
            canLoadMore: false,
            checkeds: props.message.mergePages || [],
            filter: {
                search: ""
            }
        };
        this.timer = null;
    }

    componentDidMount() {
        let page = this.state.page;
        let pagesize = this.state.pagesize;
        this.setState({ loading: true })
        this.props.actions.getList({ page, pagesize }).then((d) => {
            // console.log(d, "pages")
            this.setState({ loading: false })
        }).catch(e => {
            this.setState({ loading: false })
        })
    }

    _makeGetList = () => {
        let page = this.state.page;
        let pagesize = this.state.pagesize;
        this.setState({ loading: true })
        this.props.actions.getList({ page, pagesize }).then(res => {
            this.setState({
                msg: res.error || null,
                loading: false,
                refreshing: false
            });
        }).catch((error) => {
            this.setState({
                msg: error,
                refreshing: false,
                loading: false
            });
        })

    }

    handleRefresh = () => {
        this.setState({
            page: 1,
            pagesize: 20,
            refreshing: true
        },
            () => {
                // this.props.onRefresh(true);
                this.setState({
                    page: 1,
                    pagesize: 20,
                    refreshing: false
                })
            }
        );
    };

    handleLoadMore = () => {
        var { total, viewIndex, fbPageMessage } = this.props;
        if ((fbPageMessage.items.length < total)) {
            let pagesize = this.state.pagesize;
            this.setState({
                ...this.state,
                canLoadMore: true,
                loading: true,
                page: this.state.page,
                pagesize: pagesize + 20
            }, this.props.onChange(pagesize))
            // this.props.onPageChange(page)

        } else {
            this.setState({
                canLoadMore: false,
                loading: false,
            })
        }

    };


    renderFooter = () => {
        return (
            <View style={styles.flatlistfooter}>
                {
                    this.state.canLoadMore &&
                    <Spinner color='green' />
                }
                {
                    (!this.state.canLoadMore) ?
                        <Text>{__('')}</Text> :
                        <Text style={{ color: 'red' }}>{__('Đang tải..')}</Text>
                }
            </View>
        )
    };

    checkeds = (checkeds) => {
        // // console.log(checkeds, "checkeds---")
        this.setState({
            checkeds: checkeds
        })
        // if (this.state.checkeds.contains(checkeds)) {
        //     this.setState({
        //         checkeds: this.state.checkeds.filter(x => x != checkeds).distinct()
        //     })
        // } else {
        //     this.setState({
        //         checkeds: [...this.state.checkeds, ...checkeds].distinct()
        //     })
        // }

    }

    renderItem = ({ item }) => {
        return (
            <PagesListItem
                showMerge={this.props.showMerge}
                checkeds={this.checkeds}
                checkedsList={this.state.checkeds}
                pages={item}
                showBox={this.props.showBox} />
        );
    }

    convertToUrl = (check) => {
        var url = "";
        check.map((item, index) => {
            if (index == 0) {
                url += 'groupPage[' + index + ']' + "=" + item;
            } else {
                url += "&" + 'groupPage[' + index + ']' + "=" + item;
            }
        });
        return url;
    }

    mergePage = () => {
        const { checkeds } = this.state;
        Alert.alert(
            __('Bạn có chắc muốn gộp trang?'),
            __('Nếu Ok các trang này sẽ gộp lại'),
            [
                {
                    text: 'Cancel', onPress: () => { this.props.hideMerge() }
                },
                {
                    text: 'OK', onPress: () => {
                        this.setState({ loading: true }, () => {
                            var param = this.convertToUrl(checkeds);
                            this.props.actions.getConfigPage(checkeds.first());
                            this.props.actions.mergePage(param, checkeds)
                                .then(() => {
                                    this.setState({ loading: false });
                                    // alert("Gộp thành công");
                                    Toast.show({
                                        text: 'Gộp thành công',
                                        duration: 2500,
                                        position: 'bottom',
                                        textStyle: { textAlign: 'center' },
                                        buttonText: '',
                                    });
                                    this.props.actions.resetPageProfile();
                                    this.props.hideMerge();
                                    // this.props.navigation.navigate("ConvensionBox", {});
                                    this.props.showBox({}, "convension");

                                }).catch((e) => {
                                    this.setState({ loading: false });
                                    this.props.hideMerge();
                                    Toast.show({
                                        text: 'Gộp thất bại',
                                        duration: 2500,
                                        position: 'bottom',
                                        textStyle: { textAlign: 'center' },
                                        buttonText: '',
                                    });
                                });
                        })
                    }
                },
            ],
            { cancelable: false }
        )
    }

    render() {
        let checkeds = !!this.state.checkeds ? this.state.checkeds.distinct() : []
        // let fbPageMessage = this.props.fbPageMessage.items;
        // fbPageMessage = fbPageMessage.map(item => {
        //     return {
        //         ...item,
        //         title: item.name
        //     }
        // })

        // const items = this.props.fbPageMessage.items
        //     .filter((item) => s(this.state.filter.search, item.name))
        //     .filter((item) => !item.fbChatAble)
        //     .orderByDesc((it) => it.favorite);

        const itemsChat = this.props.fbPageMessage.items
            .filter((item) => s(this.state.filter.search, item.name))
            .filter((item) => item.fbChatAble)
        // .orderByDesc((it) => it?.favorite);
        // // console.log(itemsChat)
        const loading = this.state.loading && !this.state.refreshing

        return (
            itemsChat ?
                <View style={styles.page}>
                    <Toast
                        ref={c => {
                            if (c) Toast.toastInstance = c;
                        }}
                    />
                    <FlatList
                        data={itemsChat}
                        renderItem={this.renderItem}
                        keyExtractor={item => ('ID' + item.id)}
                        refreshControl={
                            <RefreshControl
                                tintColor="#28cc54"
                                title="Loading..."
                                titleColor="#00ff00"
                                colors={['#28cc54', '#00ff00', '#ff0000']}
                                refreshing={this.state.refreshing}
                                onRefresh={this.handleRefresh}
                            />
                        }
                        onEndReached={this.handleLoadMore}
                        ListFooterComponent={this.renderFooter()}
                    />
                    {
                        this.props.showMerge && checkeds.length > 0 &&
                        <Button block
                            disabled={checkeds.length < 1}
                            onPress={checkeds.length < 2 ? console.log("no") : this.mergePage}
                            style={{ marginTop: 30, backgroundColor: '#ffb400' }} >
                            {
                                // this.state.loading && <Spinner color='white' />
                            }
                            <Text>{checkeds.length < 2 ? __('Bạn cần chọn từ 2 page trở lên') : __('Gộp page')}</Text>
                        </Button>
                    }
                    {
                        loading &&
                        <Loading />
                    }
                </View>
                :
                <View style={styles.header}>
                    <Text style={styles.headerText}>{(this.state.loading || this.props.loading) ? 'Đang tải..' : 'Không có dữ liệu'}</Text>
                </View>


        );
    }
}
export default connect(Pages, state => ({
    host: state.account.host,
    fbPageMessage: state.fbPageMessage,
    message: state.fbMessage,
}), { ...actions, ...fbactions });


const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: '#fff'
    },
    headerText: {
        color: 'red',
        textAlign: 'center',
        padding: 20
    },
    header: {
        flex: 1
    },
    flatlistfooter: {
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    notData: {
        paddingTop: 10,
        alignItems: 'center'
    }
})