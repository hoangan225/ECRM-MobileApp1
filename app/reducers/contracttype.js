import { types } from '../actions/contracttype';
import { REHYDRATE, PURGE, persistCombineReducers } from 'redux-persist';

const initState = {
    items: [],
    itemnews: [],
    total: 0,
    loaded: false,
};

export default function user(state = initState, action) {
    let index;
    let indexNew;
    switch (action.type) {
        case REHYDRATE:
            let obj = {
                ...state,
                storageLoaded: true
            };
            if (action.payload) {
                obj = { ...obj, ...action.payload.contractType }
            }
            return obj;
        case types.GET_LIST_SUCCESS:
            return {
                ...state,
                items: action.data.items.map(item => ({
                    ...item, 
                })),
                total: action.data.total,
                loaded: true,
            }
        case types.CREATE_SUCCESS:
            return {
                ...state,
                items: [...state.items, {
                    ...action.data, 
                }],
                itemnews: [...state.itemnews, {
                    ...action.data, 
                }],
                loaded: true,
            };
        case types.UPDATE_SUCCESS:
            index = state.items.findIndex(item => item.id == action.data.id);
            indexNew = state.itemnews.findIndex(item => item.id == action.data.id);
            if (index >= 0) {
                state.items[index] = {
                    ...action.data, 
                };

            }
            if (indexNew >= 0) {
                state.itemnews[indexNew] = {
                    ...action.data, 
                };
            }
            return {
                ...state
            };
        case types.DELETE_SUCCESS:
            state.items = state.items.filter(item => item.id != action.meta);
            return {
                ...state
            };
        default:
            return state;
    }
}