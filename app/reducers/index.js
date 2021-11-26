import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // or whatever storage you are using
import account from './account';
import app from './app';
import customer from './customer';
import customview from './customview';
import customField from './customfield';
import customViewFilter from './customviewfilter';
import customerSource from './customersource';
import customerCategory from './customercategory';
import customerViewDetail from './customviewdetail';
import user from './user';
import company from './company';
import contract from './contract';
import opportunity from './opportunity';
import processes from './process';
import job from './job';
import jobstatus from './jobstatus';
import notification from './notification';
import activity from './activity';
import branch from './branch';
import customViewSort from './customviewsort';
import voip from './voip/call';
import hotline from './voip/hotline';
import widget from './widget';
import wifiCustomer from './wifi/customer';
import wifiLocation from './wifi/location';

import crossChecking from './kopo-cross-checking';
import booking from './kopo-booking';
import business from './kopo-business';
import order from './product/order';
import invoice from './product/invoice';
import fbMessage from './facebookMessage/message';
import fbPost from './facebookMessage/post'
import fbPageMessage from './facebookMessage/page';
import fbMessageTemplate from './facebookMessage/messageTemplate';
import fbAttachment from './facebookMessage/attachment';
import fbmessageTopic from './facebookMessage/messageTopic';
import fbOption from './facebookMessage/option';
import fbReport from './facebookMessage/report';
import autoMessage from './facebookMessage/autoMessage';

const config = {
    key: 'ecrm',
    blacklist: ['log', 'report', 'notification', 'user', 'role', 'department'],
    storage
}

const appReducers = combineReducers({
    account,
    app,
    customer,
    customview,
    customField,
    customViewFilter,
    customerSource,
    customerCategory,
    customerViewDetail,
    user,
    company,
    contract,
    processes,
    opportunity,
    job,
    jobstatus,
    notification,
    activity,
    branch,
    customViewSort,
    voip,
    hotline,
    widget,
    wifiCustomer,
    wifiLocation,
    crossChecking,
    booking,
    business,
    order,
    invoice,
    fbMessage,
    fbPost,
    fbPageMessage,
    fbMessageTemplate,
    fbAttachment,
    fbmessageTopic,
    fbOption,
    fbReport,
    autoMessage
})

const rootReducer = (state, action) => {
    if (action.type === 'ACCOUNT_LOGOUT') {
        //những reducer sẽ giữ lại sau khi logout
        state = {
            account: state.account, // lưu trạng thái đã load của account
        }
    }
    if (action.type === 'ACCOUNT_RESET_DATA') {
        state = {
            app: state.app,
            account: state.account,
            branch: state.branch
        }
    }
    return appReducers(state, action)
}

export default persistReducer(config, rootReducer);