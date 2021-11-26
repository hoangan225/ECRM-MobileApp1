import { types } from '../actions/contract';
import { REHYDRATE, PURGE, persistCombineReducers } from 'redux-persist';

const initState = {
    items: [],
    itemAll: [],
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
                obj = { ...obj, ...action.payload.contract }
            }
            return obj;
        case types.GET_LIST_SUCCESS:
            var alls = action.data.itemAll;
            if (alls && alls.length > 0) {
                return {
                    ...state,
                    // items: action.data.items.map(item => ({
                    //     ...item,
                    //     metas: JSON.parse(item.metas)
                    // })),
                    itemAll: alls.map(item => ({
                        ...item,
                        metas: JSON.parse(item.metas)
                    })),
                    itemnews: [],
                    total: action.data.total,
                    loaded: true,
                }
            }
            var items = action.data.items;
            if (items && items.length > 0) {
                return {
                    ...state,
                    items: action.data.items.map(item => ({
                        ...item,
                        metas: JSON.parse(item.metas)
                    })),
                    itemnews: [],
                    total: action.data.total,
                    loaded: true,
                }
            }
            return {
                ...state,
                items: [],
                itemnews: [],
                total: action.data.total,
                loaded: true,
            }

        case types.CREATE_SUCCESS:
            return {
                ...state,
                items: [...state.items, {
                    ...action.data,
                    metas: JSON.parse(action.data.metas)
                }],
                itemnews: [...state.itemnews, {
                    ...action.data,
                    metas: JSON.parse(action.data.metas)
                }],
                loaded: true,
            };
        case types.UPDATE_SUCCESS:
            // console.log('data --3:', action.data)
            index = state.items.findIndex(item => item.id == action.data.id);
            indexNew = state.itemnews.findIndex(item => item.id == action.data.id);
            if (index >= 0) {
                state.items[index] = {
                    ...action.data,
                    metas: JSON.parse(action.data.metas)
                };

            }
            if (indexNew >= 0) {
                state.itemnews[indexNew] = {
                    ...action.data,
                    metas: JSON.parse(action.data.metas)
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