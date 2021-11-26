import { types } from '@/actions/facebook/extension';

const initState = {
    totalCustomerWithoutUId: 0,
    startProcess: false,
    sending: false,
    customers: [],
    listCustomerSending: [],
    pageId: null,
    offset: 0
};

export default (state = initState, action) => {
    switch (action.type) {
        case types.GET_TOTAL_CUSTOMER_WITHOUT_UID_SUCCESS:
            return {
                ...state,
                totalCustomerWithoutUId: action.data.total
            }
        case types.SET_PROCESS_SEND_MSG_EXTENSION:
            return {
                ...state,
                startProcess: { timeStart: action.timeStart }
            }

        case types.STOP_PROCESS_SEND_MSG_EXTENSION:
            return {
                ...state,
                listCustomerSending: [],
                startProcess: false
            }
        case types.SET_START_SENDING_MSG_EXTENSION:
            return {
                ...state,
                listCustomerSending: [],
                sending: true
            }

        case types.SET_STOP_SENDING_MSG_EXTENSION:
            return {
                ...state,
                sending: false
            }

        case types.REMOVE_CUSTOMER_SENT_SUCCESS:
            // console.log(action.customerId, 'customerId');
            const listCustomerSending = [...state.listCustomerSending];
            const index = listCustomerSending.findIndex(item => item.customerId == action.customerId);
            listCustomerSending.splice(index, 1);
            return {
                ...state,
                listCustomerSending: listCustomerSending
            }
        case types.GET_CUSTOMERS_CAMPAIGN_FROM_EXTENSION_SUCCESS:
            return {
                ...state,
                listCustomerSending: action.data.offset === 2 ? [...state.listCustomerSending, ...action.data.items] : action.data.items,
                offset: action.data.offset + 1,
                pageId: action.data.pageId,
                campaignId: action.data.campaignId,
            }

        default:
            return state;
    }
}
