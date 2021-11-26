import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { connect } from '../../../lib/connect';
import { validateComponent } from '../../../lib/validate';
import * as actions from '../../../actions/customer';
import Select from '../../controls/select';

class CustomerSelect extends Component {
    constructor(props) {
        super(props);

        this.state = {
            keyword: "",
            page: 1,
            pagesize: 20,
            total: 0,
            search: null,
            canLoadMore: true,
            result: [],
            loading: 'none',
            load: false
        }

        this.data = [];
    }

    componentDidMount() {
        // if (this.props.customer.items.length == 0) {
        //     this.props.actions.getlist();
        // }
        // else {
        //     this.setState({ page: Math.ceil(this.props.customer.items.length / 20) });
        // }
        this.loadData(null, 1);
    }


    getData = () => {
        // var data;
        // if (this.state.search) {
        //     data = this.state.result;
        // }
        // else {
        //     data = this.props.customer.items.slice(0, this.state.page * 20);
        // }
        // // data = this.props.customer.items;

        return this.state.result.map(item => ({
            value: item.id,
            label: item.fullName + (this.props.showPhone && item.phone ? " - " + item.phone : "")
        }));
    }

    onValueChange = (value) => {
        const customers = this.state.result;

        if (this.props.multiple) {
            var items = customers.filter(item => value.indexOf(item.id) >= 0);
            if (this.props.onValueChange) {
                this.props.onValueChange(value, items);
            }
        }
        else {
            var item = customers.find(item => item.id == value);
            if (!item) {
                // console.log('customer select: not found customer', value)
            }
            else {
                // console.log('customer select: found', value)
            }
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
        if (this.props.selectedValue) {
            if (this.props.selectedValue instanceof Array) {
                stickyIds = this.props.selectedValue;
            }
            else {
                stickyIds = [this.props.selectedValue];
            }
        }
        this.props.actions.search({ search, page, stickyIds: stickyIds, pagesize: this.state.pagesize })
            .then(data => {
                this.setState({
                    result: page == 1 ? data.items : [...this.state.result, ...data.items],
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

    searchMore = () => {
        if (this.state.total > this.state.result.length && !this.state.load) {
            this.loadData(this.state.search, this.state.page + 1)
        }
    }

    render() {
        this.data = this.getData();
        return (
            <Select
                {...this.props}
                loading={this.state.loading}
                items={this.data}
                autoSearch={true}
                onSearch={this.search}
                onScrollEnd={this.searchMore}
                onValueChange={this.onValueChange} />
        )
    }
}

export default connect(CustomerSelect, state => ({
    customer: state.customer,
    host: state.account.host,
}), {
    ...actions,
});
