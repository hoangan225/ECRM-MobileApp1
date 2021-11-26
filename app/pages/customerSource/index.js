import tvkd from 'tieng-viet-khong-dau';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from '../../lib/connect';
import * as actions from '../../actions/customercategory';
import Select from '../controls/select'

class CustomerSourceSelect extends Component {
    constructor(props) {
        super(props);

        this.state = {
            keyword: "",
            loading: false,
            options: [],
            total: 0,
            page: 1,
            search: null,
            showModal: false,
        }

        this.data = [];
    }

    componentDidMount() {
        if (!this.props.source.loaded) {
            this.setState({ loading: true });
            this.props.actions.getList().then(data => {
                this.setState({ loading: false })
            }).catch(err => {
                this.setState({ loading: false })
            });
        }
    }

    handleLoadmore = () => {
        if (this.state.total > this.state.options.length && !this.state.loading) {
            this.loadData(this.state.search, this.state.page + 1)
        }
    }

    loadData = (search, page) => {
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
        this.props.actions.search({ ...this.props.filter, search, page, stickyIds: stickyIds })
            .then(data => {
                this.setState({
                    options: page == 1 ? data.items : [...this.state.options, ...data.items],
                    total: data.total,
                    loading: false,
                    search,
                    page
                })
            })
            .catch(() => {
                this.setState({ loading: false });
            })
    }


    getData = () => {
        var data;

        data = this.data;

        return data.map(item => ({
            value: item.id,
            label: item.fullName + (this.props.showPhone && item.phone ? " - " + item.phone : "")
        }));
    }

    search = (keyword) => {
        this.setState({ keyword: (keyword || "").toLowerCase() })
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

    onValueChange = (value) => {
        const sources = this.props.source.items;

        if (this.props.multiple) {
            var items = sources.filter(item => value.indexOf(item.id) >= 0);
            if (this.props.onValueChange) {
                this.props.onValueChange(value, items);
            }
        }
        else {
            var item = sources.items.find(item => item.id == value);
            if (this.props.onValueChange) {
                this.props.onValueChange(value, item);
            }
        }
    }

    render() {

        const { options, createable, source, ...attributes } = this.props;
        // // console.log('srrrr',source)
        let lstOptions = source.items.items.map(item => ({
            value: item.id,
            label: item.name
        }));
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
                // autoSearch={true}
                onSearch={this.search}
                onValueChange={this.onValueChange} />
        )
    }
}

CustomerSourceSelect.propTypes = {
    selectedValue: PropTypes.any,
    multiple: PropTypes.bool,
    onValueChange: PropTypes.func,
    style: PropTypes.any,
    dropdownStyle: PropTypes.any,
    selectStyle: PropTypes.any,
    searchPlaceholder: PropTypes.string,
    placeholder: PropTypes.string,
}

export default connect(CustomerSourceSelect, state => ({
    source: state.customerSource,
    host: state.account.host,
}), {
    ...actions,
});