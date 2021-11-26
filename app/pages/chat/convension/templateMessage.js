import React, { Component } from 'react';
import { connect } from "@/lib/connect";
import * as actions from "@/actions/facebookMessage/message";
import Button from '@/controls/button';
import { getTemplateScroll } from "@/actions/facebookMessage/messageTemplates";
import { getPageOptions } from "@/actions/facebookMessage/option";
import Loading from "@/controls/loading";
import Tooltip from "@/controls/tooltip";
const styles = {
    table: {
        maxHeight: "300px",
        overflow: "auto",
    },
    header: {
        background: "aliceblue",
        fontSize: "1.2rem",
        cursor: "pointer"
    }
}
class TemplateMore extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            search: {
                page: 1,
                pageSize: 20,
            },
            pageId: props.pageId || props.conversation.pageId,
            loading: false
        }
        this.inside = React.createRef();
        this.manager = this.context.user.hasCap('Conversation.Manage');
        this.createTemplate = this.context.user.hasCap('Conversation.Template.Create');
    }
    componentDidMount() {
        document.querySelector('body').addEventListener("click", this.handleClick, false);
    }
    componentWillUnmount() {
        document.querySelector('body').removeEventListener("click", this.handleClick, false);
    }
    handleClick = (e) => {
        if (this.inside.current && !this.inside.current.contains(e.target)) {
            e.preventDefault();
            e.stopPropagation();
            if (this.props.hide) this.props.hide();
        }
    }
    truncate = (str, n) => {
        return (str.length > n) ? str.substr(0, n - 1) + '...' : str;
    };
    setTemplate = (it, img) => {
        if (this.props.setTemplate) {
            this.props.setTemplate(it, img);
        }
        if (this.props.hide) this.props.hide();
    }
    loadMore = () => {
        const { path, pageId } = this.props;
        const { mergePages, checkMerge, conversation } = this.props.message;
        if (this.state.loading == false) {
            this.setState({
                loading: true,
                search: {
                    ...this.state.search,
                    page: parseInt(this.state.search.page + 1),
                    pageId: pageId ? pageId : conversation.pageId
                }
            }, () => {
                this.props.actions.getTemplateScroll(this.state.search)
                    .then(() => this.setState({ loading: false }))
                    .catch(() => this.setState({ loading: false }))
            })
        }
    }
    handleScroll = () => {
        const { items, total } = this.props;
        const { loading } = this.state;
        const isScroll = Math.ceil(this.scrollBar.scrollHeight - Math.abs(this.scrollBar.scrollTop))
            - this.scrollBar.clientHeight <= 3;
        if (total > items.count() && isScroll && !loading) {
            this.loadMore();
        }
    }
    subContent = (content) => {
        if (!content) return
        if (content.length > 50) {
            return (
                <Tooltip title={content}>
                    <span>{content.substring(0, 50) + "..."}</span>
                </Tooltip>
            )
        } else {
            return (
                <Tooltip title={content}>
                    <span>{content}</span>
                </Tooltip>
            )
        }
    }
    render() {
        const { items } = this.props;
        const { configPage } = this.props.message;
        const bottom = this.props.bottom ? this.props.bottom : '';
        const right = this.props.right ? this.props.right : '';
        const left = this.props.left ? this.props.left : '';
        return (
            <div className="search__outo"
                ref={this.inside}
                style={{ bottom: bottom, right: right, left: left }}>
                {
                    (this.manager || this.createTemplate) &&
                    <div className="text-white text-center d-block modal-header pointer"
                        onClick={() => this.props.createTemplate()}>
                        {__("Thêm mới tin nhắn mẫu")}
                    </div>
                }
                <Loading type="card" show={this.state.loading} />
                <div style={styles.table}
                    onScroll={this.handleScroll}
                    ref={ref => this.scrollBar = ref}>
                    <table className="table table-responsive-sm mb-0 table-hover">
                        <thead>
                            <tr>
                                <th>#</th>
                                {
                                    !configPage.FbChatMessageTemplateSetting?.ShowContent && (
                                        <React.Fragment>
                                            <th className="mw-150">{__('Chủ đề')}</th>
                                            <th className="mw-150">{__('Tên mẫu')}</th>
                                        </React.Fragment>
                                    )
                                }

                                <th className="mw-150">{__('Nội dung')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                items.map((it, i) => {
                                    return (
                                        <tr
                                            key={i} style={{ cursor: "pointer" }}
                                            onClick={() => this.setTemplate(it, { attachments: it.images })}
                                            key={i}
                                        >
                                            <td className="">{++i}</td>
                                            {
                                                !configPage.FbChatMessageTemplateSetting?.ShowContent && (
                                                    <React.Fragment>
                                                        <td className="">
                                                            <span className="badge text-white" style={{ backgroundColor: `${it.topicColor}` }}>
                                                                {it.topicName}
                                                            </span>
                                                        </td>
                                                        <td className="">{it.name}</td>
                                                    </React.Fragment>
                                                )
                                            }
                                            <td style={{ maxWidth: "250px", cursor: "pointer" }}>
                                                <div className="text-truncate display-block text-primary">
                                                    {this.subContent(it.content)}
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                    {
                        (items.length == 0) && (
                            <div className="list-empty-msg">{__("Danh sách trống")}</div>
                        )
                    }
                </div>
            </div>
        )
    }
}
export default connect(TemplateMore, (state) => ({
    message: state.fbMessage,
}), { ...actions, getTemplateScroll, getPageOptions });