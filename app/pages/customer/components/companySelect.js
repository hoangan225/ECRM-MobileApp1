import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { connect } from '../../../lib/connect';
import { validateComponent } from '../../../lib/validate';
import * as actions from '../../../actions/company';
import Select from '../../controls/select';

class CustomerSelect extends Component {
    constructor(props) {
        super(props);

        this.state = {
            keyword: "",
            page: 1,
            canLoadMore: true,
            result: [],
            options: [],
            total: 0,
            search: null,
            load: false,
            showModal: false,
        }

        this.data = [];
    }

    componentDidMount() {
        this.loadData('', 1);
    }

    handleLoadmore = () => {
        if (this.state.total > this.state.options.length && !this.state.load) {
            this.loadData(this.state.search, this.state.page + 1)
        }
    }

    loadData = (search, page) => {
        this.setState({ load: true });
        let stickyIds = null;
        if (this.props.value) {
            if (this.props.value instanceof Array) {
                stickyIds = this.props.value;
            }
            else {
                stickyIds = [this.props.value];
            }
        }
        this.props.actions.search({ ...this.props.filter, search, page, stickyIds: stickyIds })
            .then(data => {
                this.setState({
                    options: page == 1 ? data.items : [...this.state.options, ...data.items],
                    total: data.total,
                    load: false,
                    search,
                    page
                })
            })
            .catch(() => {
                this.setState({ load: false });
            })
    }

    filterOptions = (list) => {
        const { options, showPhone, showEmail, idCurrent } = this.props;

        let lstOptions = list.filter(t => t.id != idCurrent).map(item => {
            let label = item.fullName;
            if (showPhone && item.phone) {
                label += ' - ' + item.phone;
            }
            if (showEmail && item.email) {
                label += ' - ' + item.email;
            }
            return {
                value: item.id,
                label,
                model: item,
            }
        }
        );
        if (options) {
            if (options instanceof Array) {
                lstOptions = [...lstOptions, ...options];
            } else {
                lstOptions = [...lstOptions, options];
            }
        }
        return lstOptions;
    }
    getData = () => {
        var data;

        data = this.data;

        return data.map(item => ({
            value: item.id,
            label: item.fullName + (this.props.showPhone && item.phone ? " - " + item.phone : "")
        }));
    }

    onValueChange = (value) => {
        const customers = this.state.options;

        if (this.props.multiple) {
            var items = customers.filter(item => value.indexOf(item.id) >= 0);
            if (this.props.onValueChange) {
                this.props.onValueChange(value, items);
            }
        }
        else {
            var item = customers.find(item => item.id == value);
            if (this.props.onValueChange) {
                this.props.onValueChange(value, item);
            }
        }
    }

    search = (search) => {
        if (this.state.search !== search && !this.state.load) {
            //timeout: hạn chế tìm kiếm khi đăng gõ
            if (this.searchTimer) {
                clearTimeout(this.searchTimer);
            }
            this.searchTimer = setTimeout(() => {
                this.loadData(search, 1)
            }, 800);
        }
        return search;
    }

    loadData = (search, page) => {
        this.setState({ load: true });
        let stickyIds = null;
        if (this.props.value) {
            if (this.props.value instanceof Array) {
                stickyIds = this.props.value;
            }
            else {
                stickyIds = [this.props.value];
            }
        }
        this.props.actions.search({ ...this.props.filter, search, page, stickyIds: stickyIds })
            .then(data => {
                this.setState({
                    options: page == 1 ? data.items : [...this.state.options, ...data.items],
                    total: data.total,
                    load: false,
                    search,
                    page
                })
            })
            .catch(() => {
                this.setState({ load: false });
            })
    }

    render() {
        // this.data = this.getData();
        return (
            <Select
                {...this.props}
                // loading={this.state.loading}
                items={this.filterOptions(this.state.options)}
                autoSearch={true}
                onSearch={this.search}
                onScrollEnd={this.searchMore}
                onValueChange={this.onValueChange} />
        )
    }
}

export default connect(CustomerSelect, null, {
    ...actions,
});
