import { types } from '../actions/job';

const initState = {
    items: [],
    newItems: [],
    viewId: 5,
    loaded: false,
    canLoadMore: false,
    // page: 1,
    from: null,
    to: null,
    total: null
};

export default function user(state = initState, action) {
    let index;
    let indexNew;
    switch (action.type) {
        case types.CHANGE_VIEW_SUCCESS:
            return {
                ...state,
                viewId: action.id,
            }
        case types.GET_LIST_SUCCESS:
            var ids = state.items.map(item => item.id);
            var ref = action.params.refresh;
            if (ref) {
                state.items = [];
                var newItems = [];
            } else {
                var newItems = action.data.items.filter(item => ids.indexOf(item.id) < 0);
            }
            // // console.log(newItems);
            var newIds = newItems.map(item => item.id);
            // // console.log(ids, newIds);
            // // console.log(state.from, 'from');
            return {
                ...state,
                total: action.data.total,
                items: action.params.to == null ? action.data.items : [...state.items, ...newItems],
                loaded: true,
                newItems: [],
                from: action.params.from,
                viewId: action.params.viewId,
            }

        case types.CREATE_SUCCESS:
            return {
                ...state,
                items: [...state.items, action.data],
                newItems: [...state.newItems, action.data],
            };
        case types.UPDATE_SUCCESS:
            index = state.items.findIndex(item => item.id == action.data.id);
            indexNew = state.newItems.findIndex(item => item.id == action.data.id);
            if (indexNew >= 0) {
                state.newItems[indexNew] = action.data;
            }
            if (index >= 0) {
                state.items[index] = action.data;
            }
            return {
                ...state
            };
        case types.DELETE_SUCCESS:
            state.newItems = state.newItems.filter(item => item.id != action.meta);
            state.items = state.items.filter(item => item.id != action.meta);
            return {
                ...state
            };
        case types.CHANGE_STATUS_START:
            index = state.items.findIndex(item => item.id == action.meta.job.id);
            indexNew = state.newItems.findIndex(item => item.id == action.meta.job.id);
            if (indexNew >= 0) {
                state.newItems[indexNew].statusId = action.meta.status.id;
                state.newItems[indexNew].statusName = action.meta.status.name;
            }
            if (index >= 0) {
                state.items[index].statusId = action.meta.status.id;
                state.items[index].statusName = action.meta.status.name;
            }
            return {
                ...state
            };
        case types.CHANGE_STATUS_ERROR:
            index = state.items.findIndex(item => item.id == action.meta.job.id);
            indexNew = state.newItems.findIndex(item => item.id == action.meta.job.id);
            if (indexNew >= 0) {
                state.newItems[indexNew].statusId = action.meta.job.statusId;
                state.newItems[indexNew].statusName = action.meta.job.statusName;
            }
            if (index >= 0) {
                state.items[index].statusId = action.meta.job.statusId;
                state.items[index].statusName = action.meta.job.statusName;
            }
            return {
                ...state
            };
        default:
            return state;
    }
}