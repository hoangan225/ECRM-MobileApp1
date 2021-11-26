import { types } from '../actions/company';
import { REHYDRATE, PURGE, persistCombineReducers } from 'redux-persist';

const initState = {
    item: {},
    items: [],
    itemnews: [],
    total: 0,
    loaded: false,
    viewId: 0,
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
                obj = { ...obj, ...action.payload.customer }
            }
            return obj;
        case types.GET_SINGLE_SUCCESS:
            return {
                ...state,
                item: action.data.item,
                loaded: true,
            }
        case types.GET_LIST_SUCCESS:

            var list = action.data.items.map(item => ({
                ...item,
                metas: JSON.parse(item.metas)
            }));
            var viewId = action.data.viewId;
            var entity = { items: list, viewId: viewId };

            var olds = state.items;
            if (olds && olds.length > 0) {
                index = olds.findIndex(item => item.viewId == entity.viewId);
                if (index >= 0) {
                    state.items[index] = entity;
                }
                else {
                    state.items.push(entity);
                }
            }
            else {
                state.items.push(entity);
            }

            return {
                ...state,
                items: state.items,
                total: action.data.total,
                loaded: true,
                viewId: viewId,
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

            index = state.items.filter(t => t.viewId == action.data.viewId)[0].items.findIndex(item => item.id == action.data.item.id);
            indexNew = state.itemnews.findIndex(item => item.id == action.data.item.id);

            if (index >= 0) {
                state.items.filter(t => t.viewId == action.data.viewId)[0].items[index] = {
                    ...action.data.item,
                    metas: JSON.parse(action.data.item.metas)
                };

            }
            if (indexNew >= 0) {
                state.itemnews[indexNew] = {
                    ...action.data.item,
                    metas: JSON.parse(action.data.item.metas)
                };
                // state.items.filter(t => t.viewId == action.data.viewId)[0].items[indexNew] = {
                //     ...action.data.item,
                //     metas: JSON.parse(action.data.item.metas)
                // };
            }
            return {
                ...state
            };
        case types.DELETE_SUCCESS:
            var entitys = [];
            state.items.map((item, stt) => {
                if (item.id && item.id > 0) {
                    if (item.id != action.meta) {
                        entitys.push(item);
                    }
                }
                else {
                    entitys.push({ ...item, items: item.items.filter(item => item.id != action.meta) });
                }
            })
            if (entitys && entitys.length > 0) {
                state.items = entitys;
                state.itemnews = entitys.filter(t => t.id > 0);
            }
            else {
                state.items = state.items.filter(item => item.id != action.meta);
            }
            return {
                ...state
            };
        default:
            return state;
    }
}