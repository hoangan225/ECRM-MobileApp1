import { types } from '@/actions/facebook/page';

const initState = {
    items: [],
    validatedItems: [],
    closedWarningItemIds: [],
    loaded: false,
};

export default (state = initState, action) => {
    let index;
    switch (action.type) {
        case types.GET_LIST_SUCCESS:
            return {
                ...state,
                items: action.data.items,
                loaded: true,
            }
        case types.GET_VALIDATED_LIST_SUCCESS:
            return {
                ...state,
                validatedItems: action.data
            }
        case types.UPDATE_CONNECTED_SUCCESS:
            return {
                ...state,
                items: action.data.pageList,
            }
        case types.ADD_LIST_SUCCESS:
            return {
                ...state,
                items: [...state.items, ...action.data],
            }
        case types.UPDATE_SUCCESS:
            index = state.items.findIndex(item => item.id == action.data.id);
            if (index >= 0) {
                state.items[index] = action.data;
            }
            return {
                ...state
            };
        case types.VIEW_SUCCESS:
            index = state.items.findIndex(item => item.id == action.data.id);
            if (index >= 0) {
                state.items[index] = action.data;
            }
            return {
                ...state
            };
        case types.CREATE_SUCCESS:
            return {
                ...state,
                items: [...state.items, action.data]
            };
        case types.DELETE_SUCCESS:
            state.items = state.items.filter(item => item.id != action.meta);
            return {
                ...state
            };
        case types.CLOSE_WARNING_ITEMS:
            return {
                ...state,
                closedWarningItemIds: action.closedWarningItemIds
            }
        default:
            return state;
    }
}
