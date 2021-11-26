import { types } from '../actions/opportunity';
import { REHYDRATE } from 'redux-persist';
const initState = {
    items: [],
    loaded: false,
    logs: [],
    loadedLog: false,
}

export default function opportunity(state = initState, action) {

    let index;
    switch (action.type) {
        // case REHYDRATE:
        case types.GET_LIST_SUCCESS:
            // // console.log('act data opp', action.data);

            return {
                ...state,
                items: action.data,
                opportunity: null,
                loaded: true,
            }
        case types.CREATE_SUCCESS:
            state.items = [...state.items, ...action.data];
            return {
                ...state,
            };
        case types.UPDATE_SUCCESS:
            index = state.items.findIndex(opp => {
                return opp.id == action.data.id;
            });
            state.items[index] = action.data;
            return {
                ...state
            };
        case types.DELETE_SUCCESS:
            if (action.meta.opportunity instanceof Array) {
                state.items = state.items.filter(item => !action.meta.opportunity.contains(item.id));
            } else {
                state.items = state.items.filter(item => item.id != action.meta.opportunity.id);
            }
            return {
                ...state
            };
        case types.UPDATE_STEP_START:
            index = state.items.findIndex(item => item.id == action.meta.opportunity.id);
            if (index >= 0) {
                state.items[index].stepId = action.meta.step.id;
                state.items[index].step = action.meta.step;
                state.items[index].probability = action.meta.step.percent;
            }
            return {
                ...state
            };
        case types.UPDATE_STEP_SUCCESS:
            index = state.items.findIndex(item => item.id == action.meta.opportunity.id);
            if (index >= 0) {
                state.items[index].disabled = action.data.disabled;
            }
            return {
                ...state
            };
        case types.UPDATE_STEP_ERROR:
            index = state.items.findIndex(item => item.id == action.meta.opportunity.id);
            if (index >= 0) {
                state.items[index].step = action.meta.opportunity.step;
                state.items[index].stepId = action.meta.opportunity.stepId;
                state.items[index].probability = action.meta.opportunity.probability;
            }
            return {
                ...state
            };

        case types.PATCH_SUCCESS:
            index = state.items.findIndex(item => item.id == action.meta);
            if (index >= 0) {
                state.items[index] = {
                    ...state.items[index],
                    ...action.params
                }
            }
            return {
                ...state
            };

        case types.BULK_UPDATE_STEP_START:
            action.meta.opportunities.map(opp => {
                index = state.items.findIndex(item => opp.id == item.id);
                if (index >= 0) {
                    state.items[index].stepId = action.meta.step.id;
                    state.items[index].step = action.meta.step;
                    state.items[index].probability = action.meta.step.percent;
                }
            });
            return {
                ...state
            };
        case types.BULK_UPDATE_STEP_SUCCESS:
            action.data.map(opp => {
                index = state.items.findIndex(item => item.id == opp.id);
                if (index >= 0) {
                    state.items[index].disabled = opp.disabled;
                }
            });
            return {
                ...state
            };
        case types.BULK_UPDATE_STEP_ERROR:
            action.meta.opportunities.map(opp => {
                index = state.items.findIndex(item => opp.id == item.id);
                if (index >= 0) {
                    state.items[index].step = opp.step;
                    state.items[index].stepId = opp.stepId;
                    state.items[index].probability = opp.probability;
                }
            });
            return {
                ...state
            };
        case types.GET_LOG_SUCCESS:
            return {
                ...state,
                logs: action.data,
                loadedLog: true,
            }
        case types.BULK_PATCH_SUCCESS:
            action.meta.opportunities.map(opp => {
                index = state.items.findIndex(item => item.id == opp.id);
                if (index >= 0) {
                    state.items[index] = {
                        ...state.items[index],
                        ...action.params.data
                    }
                }
            });
            return {
                ...state
            };
        default:
            return state;
    }
}
