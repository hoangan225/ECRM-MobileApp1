
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import User from './user';
import request from './request';
import { connect as rdConnect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Redirect, Switch, Route } from 'react-router-dom';

//const AppContext = React.createContext()

// This context contains two interesting components
//const { Provider, Consumer } = AppContext;


export class ContextWrap extends Component {

    getChildContext() {
        return {
            user: new User(this.props.account, this.getCurrentBranchId, this.redirect),
            currentBranchId: this.props.branch.currentId,
            request: request,
            options: this.props.options,
            redirect: this.redirect,
            locale: this.props.account.user ? this.props.account.user.metas.locale : null,
        };
    }

    componentWillReceviceProps(props) {
        if (props.branch.currentId != this.props.branch.currentId) {
            this.forceUpdate();
        }
    }

    getCurrentBranchId = () => {
        return this.props.branch.currentId;
    }

    redirect = (to, push) => {
        if (typeof to == 'string') {
            to = {
                pathname: to,
            };
        }

        to = {
            state: null,
            search: '',
            ...to
        }

        if (push) {
            this.props.history.push(to.pathname + to.search, to.state);
        }
        else {
            this.props.history.replace(to.pathname + to.search, to.state);
        }
    }


    render() {
        return this.props.children;
    }
}

ContextWrap.propsTypes = {
    user: PropTypes.object,
    options: PropTypes.object,
    children: PropTypes.node,
    branch: PropTypes.object,
}

ContextWrap.childContextTypes = {
    user: PropTypes.object,
    request: PropTypes.object,
    options: PropTypes.object,
    redirect: PropTypes.func,
    locale: PropTypes.string,
    currentBranchId: PropTypes.number
};

export const Context = rdConnect(state => ({
    account: state.account,
    branch: state.branch,
    options: state.app.options
}))(ContextWrap);

export const connect = (component, mapStateToProp, actions, mapDispatchToProps) => {
    if (!component) {
        throw new Error("Component can not be null");
    }

    component.contextTypes = ContextWrap.childContextTypes;

    // Object.defineProperty(component.prototype, 'ctext', {
    //     get: function () {
    //         const ctx = this.props.context || {};
    //         return ctx.currentBranchId;
    //     }
    // });

    component.prototype.redirect = function (to, push) {
        if (this.context.redirect) {
            this.context.redirect(to, push);
        }
    }

    const make = actions ? rdConnect(mapStateToProp, dispatch => {
        if (typeof mapDispatchToProps == 'function') {
            return {
                actions: bindActionCreators(actions, dispatch),
                ...mapDispatchToProps(dispatch)
            }
        }
        else {
            return {
                actions: bindActionCreators(actions, dispatch)
            }
        }
    }, null, { withRef: true }) : rdConnect(mapStateToProp, mapDispatchToProps, null, { withRef: true });

    // const ConnectedComponent = make(component);

    // return React.forwardRef((props, ref) => (
    //     <Consumer>{ctx => <ConnectedComponent {...props} context={ctx} ref={ref} />}</Consumer>
    // ));

    return make(component);
}