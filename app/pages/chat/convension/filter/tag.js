import React, { Component } from 'react';
import { FlatList, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, ActivityIndicator, Alert, View, Text } from "react-native";
import { connect } from '../../../../lib/connect';
import * as actions from '../../../../actions/facebookMessage/message';
import { search as s } from "../../../../lib/helpers";
import Loading from "../../../controls/loading";
const color = "#ffb400";

class FbTag extends Component {
    constructor(props) {
        super(props);
        this.state = {
            check: props.checkTags,
            search: "",
            tags: [],
            loading: false
        }
    }
    componentDidMount() {
        const { checkMerge, mergePages } = this.props.message;
        const { path, pageId } = this.props;
        this.setState({ loading: true });
        if (checkMerge) {
            this.props.actions.getConversationTagsMerge({ groupPage: mergePages })
                .then((data) => {
                    this.setState({
                        loading: false,
                        tags: data.distinct(x => x.id)
                    });
                }).catch(() => this.setState({ loading: false }));
        } else {
            // console.log(pageId, "pageId")
            this.props.actions.getConversationTags(pageId)
                .then((data) => {
                    this.setState({
                        loading: false,
                        tags: data
                    });
                }).catch(() => this.setState({ loading: false }));
        }
    }

    showMoreTag = () => {
        const { tags } = this.state;
        const items = tags.filter((item) =>
            s(this.state.search, item.name)
        );
        if (tags.length > 0) {
            return (
                <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap", alignItems: "center", marginTop: 6 }}>{
                    items.orderBy(x => x.order).map((item, index) => {
                        return (
                            <TouchableOpacity key={index}
                                style={{ backgroundColor: item.color, margin: 2, paddingVertical: 3, borderRadius: 2, width: 80 }}
                                onPress={() => this.handleClickFilter(item.id)}>
                                <Text
                                    numberOfLines={1}
                                    style={{ color: this.state.check.includes(item.id) ? color : "#fff", paddingHorizontal: 6, textAlign: "center" }}>{item.name}</Text>

                            </TouchableOpacity>
                        )
                    })
                }
                </View>
            )
        } else {
            return (
                <View>
                    <Text>{__("Bạn chưa tạo thẻ")}</Text>
                </View>
            )
        }
    }

    handleClickFilter = (id) => {
        if (this.state.check.includes(id)) {
            const newCheck = this.state.check.filter(it => it != id);
            this.setState({
                check: newCheck
            }, () => {
                this.props.filterTags(this.state.check);
            })
        } else {
            this.setState({
                check: [...this.state.check, id]
            }, () => {
                this.props.filterTags(this.state.check);
            })
        }
    }

    removeFilterTags = () => {
        this.setState({
            check: [],
            messagesFilter: null,
        })
        this.props.removeFilterTags();
    }

    checkAllTags = () => {
        const { tags } = this.state;
        const { check } = this.state;
        const items = tags.filter((item) =>
            s(this.state.search, item.name)
        );
        if (items.length == check.length) {
            this.setState({ allTags: false, check: [] }, () => {
                this.props.filterTags(this.state.check);
            });
        } else {
            const idTags = items.map(item => item.id);
            this.setState({ allTags: true, check: idTags }, () => {
                this.props.filterTags(this.state.check);
            });
        }
    }

    render() {
        const { check, tags } = this.state;
        const items = tags.filter((item) =>
            s(this.state.search, item.name)
        );
        return (
            <React.Fragment>
                {
                    // this.state.loading ?
                    //     <Loading show={this.state.loading} />
                    //     :
                    this.showMoreTag()
                }
                <TouchableOpacity
                    style={{ backgroundColor: color, margin: 2, marginTop: 10, borderRadius: 2, width: 80, height: 30, justifyContent: "center", alignItems: "center" }}
                    onPress={() => this.removeFilterTags()}>
                    <View>
                        <Text style={{ color: "#fff" }}>{"Reset"}</Text>
                    </View>
                </TouchableOpacity>
            </React.Fragment>
        )
    }
}
export default connect(FbTag, state => ({
    message: state.fbMessage
}), actions);
