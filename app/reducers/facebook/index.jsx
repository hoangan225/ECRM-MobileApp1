import { types } from '../../actions/facebook';
import moment from 'moment';

const initState = {
    campaign: {
        items: [],
        total: 0,
        loaded: false
    },
    automation: {
        items: [],
        total: 0,
        loaded: false
    },
    campaignStartExtension: null
};

const typeEnumMapping = ["", "", "campaign", "automation"];

export default (state = initState, action) => {
    let index, campaign;
    switch (action.type) {
        case types.GET_LIST_SUCCESS:
            if (action.params.type === "campaign") {
                const timeNow = moment.utc();
                const listCampaignSendExtension = action.data.items.filter(item => item.sendExtension);
                const listCampaignNoProcess = listCampaignSendExtension.filter(item => timeNow <= moment(item.sendDate))
                if (listCampaignNoProcess.length > 0) {
                    const CampaignNoProcess = listCampaignNoProcess[listCampaignNoProcess.length - 1];
                    state.campaignStartExtension = { ...CampaignNoProcess, status: 4, timeStart: moment(CampaignNoProcess.sendDate).diff(timeNow) }
                }
            }

            return {
                ...state,
                [action.params.type]: {
                    items: action.data.items.map(item => ({
                        ...item,
                        type: typeEnumMapping[item.type]
                    })),
                    total: action.data.total,
                    loaded: true
                }

            }
        case types.GET_CUSTOMER_NUMBER:
            return {
                ...state,
                total: action.data.total,
                loaded: true,
            }
        case types.CREATE_SUCCESS:
            action.data.type = typeEnumMapping[action.data.type];
            if (!state[action.data.type]) {
                state[action.data.type] = {
                    items: []
                }
            }
            state[action.data.type].items = [action.data, ...state[action.data.type].items];
            return {
                ...state
            };
        case types.CREATE_ERROR:
            if (action.error.campaign) {
                campaign = action.error.campaign;
                campaign.type = typeEnumMapping[campaign.type];
                state[campaign.type].items = [campaign, ...state[campaign.type].items];
            }
            return {
                ...state
            };
        case types.UPDATE_SUCCESS:
            action.data.type = typeEnumMapping[action.data.type];
            index = state[action.data.type].items.findIndex(item => item.id == action.data.id);
            if (index >= 0) {
                state[action.data.type].items[index] = action.data;
            }
            return {
                ...state,
                modified: Date.now()
            };
        case types.UPDATE_ERROR:
            if (action.error.campaign) {
                campaign = action.error.campaign;
                campaign.type = typeEnumMapping[campaign.type];
                index = state[campaign.type].items.findIndex(item => item.id == campaign.id);
                if (index >= 0) {
                    state[campaign.type].items[index] = campaign;
                }
            }
            return {
                ...state
            };
        case types.DELETE_SUCCESS:
            state[action.meta.type].items = state[action.meta.type].items.filter(item => item.id != action.meta.id);
            return {
                ...state
            };
        case types.COUNT_SUCCESS:
            var countItem = state['campaign'].items.find(item => item.id == action.meta);
            if (countItem) countItem.total = action.data;
            return {
                ...state
            }
        case types.UPDATE_STATUS_CAMPAIGN_SUCCESS:
            // console.log(action.data,"UPDATE_STATUS_CAMPAIGN_SUCCESS")
            return {
                ...state,
                campaignStartExtension: { ...state.campaignStartExtension, status: action.data.status }
            }
        default:
            return state;
    }
}

function reduceReportArray(obj, item) {
    let key = moment(item.date).format('L');
    obj[key] = item;
    return obj;
}