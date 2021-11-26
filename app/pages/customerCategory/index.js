import React, { Component } from 'react';
import { connect } from '../../lib/connect';
import * as actions from '../../actions/customercategory';
import Select from '../controls/select';

class CustomerCategorySelect extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            options: [],
            total: 0,
            page: 1,
            pagesize: 20,
            search: '',
            loading: false,
            showModal: false,
        }

    }

    componentDidMount() {
        this.loadData(null, 1, this.props.idCurrent || []);
    }


    validate = () => {
        return this.select.validate();
    }

    handleSearch = (search) => {
        if (this.state.search !== search && !this.state.loading) {
            if (this.searchTimer) {
                clearTimeout(this.searchTimer);
            }
            this.searchTimer = setTimeout(() => {
                this.loadData(search, 1, this.props.idCurrent || [])
            }, 800);
        }
        return search;
    }

    handleLoadmore = () => {
        if (this.state.total > this.state.options.length && !this.state.loading) {
            this.loadData(this.state.search, this.state.page + 1, this.props.idCurrent || [])
        }
    }

    loadData = (search, page, nextIdCurrent) => {
        this.setState({ loading: true });
        let stickyIds = null;
        if (this.props.value) {
            if (this.props.value instanceof Array) {
                stickyIds = this.props.value;
            }
            else {
                stickyIds = [this.props.value];
            }
        }
        if (nextIdCurrent) {
            nextIdCurrent = [...nextIdCurrent];
        }

        this.props.actions.search({ ...this.props.filter, search, page, stickyIds: stickyIds, pagesize: this.state.pagesize })
            .then(data => {
                var list = page == 1 ? data.items.filter(t => !nextIdCurrent.contains(t.id) && t.isCompany == (!!this.props.isCompany)) : [...this.state.options, ...data.items];
                this.setState({
                    options: list,
                    total: data.total,
                    loading: false,
                    search,
                    page
                });
            })
            .catch(() => {
                this.setState({ loading: false });
            })
    }

    handleIconClick = () => {
        this.setState({ showModal: true });
        if (this.props.iconClick) {
            this.props.iconClick();
        }
    }

    onValueChange = (value) => {
        const categories = this.props.categories.items;
        if (this.props.multiple) {
            var items = categories.filter(item => value.indexOf(item.id) >= 0);
            if (this.props.onValueChange) {
                this.props.onValueChange(value, items);
            }
        }
        else {
            var item = categories.items.find(item => item.id == value);
            if (this.props.onValueChange) {
                this.props.onValueChange(value, item);
            }
        }
    }

    render() {
        const { options, createable, idCurrent, ...attributes } = this.props;
        let lstOptions = this.getListBig();
        if (options) {
            if (options instanceof Array) {
                lstOptions = [...lstOptions, ...options];
            } else {
                lstOptions = [...lstOptions, options];
            }
        }

        return (
            <Select
                {...this.props}
                items={lstOptions}
                autoSearch={true}
                onSearch={this.handleSearch}
                onValueChange={this.onValueChange} />
        );
    }

    getListBig = () => {
        var options = [];
        const list = this.state.options.filter(item => item.parentId == null);
        if (list && list.length > 0) {
            list.map((item, index) => {
                options.push({
                    value: item.id,
                    label: item.name
                });
                this.getListParent(item.id, 1, options);
            });
        }
        return options;
    }

    getListParent = (parentId = null, level = 0, options) => {
        const list = this.state.options.filter(item => item.parentId == parentId);
        if (list && list.length > 0) {
            list.map((item, index) => {
                var op = {
                    value: item.id,
                    label: "--".repeat(level) + " " + item.name
                };
                options.push(op);
                this.getListParent(item.id, level + 1, options);
            });
        }
    }
}

export default connect(CustomerCategorySelect, state => ({
    categories: state.customerCategory
}), actions);