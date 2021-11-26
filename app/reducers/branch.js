import { types } from '../actions/branch';
import { types as accountTypes } from '../actions/account';

const initState = {
    items: [],
    currentId: null,
    userBranchIds: [],
    canSeeAllBranchs: false,
    loaded: false,
};

export default (state = initState, action) => {
    let index;
    switch (action.type) {
        // case accountTypes.SET_PROFILE:
        //     let branchIds = action.data.roles.map(r => r.branchId).filter(id => id != null).distinct();
        //     state.canSeeAllBranchs = action.data.roles.any(r => r.name == "Administrators" || r.positionName != null && r.branchId == null);

        //     if (branchIds.length == 0 && state.canSeeAllBranchs && state.items.length > 0) {
        //         if (!state.items.find(item => item.id == state.currentId)) {
        //             state.currentId = state.items[0].id;
        //         }
        //     }
        //     else {
        //         if (!branchIds.contains(state.currentId)) {
        //             state.currentId = branchIds[0];
        //         }
        //     }
        //     return {
        //         ...state,
        //         userBranchIds: branchIds
        //     }
        case types.SET_BRANCH:
            return {
                ...state,
                currentId: action.branch.id
            }
        case types.GET_LIST_SUCCESS:
            if (state.currentId == null) {
                state.currentId = action.data.userCanSeeAllBranchs ? action.data.branches[0].id : action.data.userBranchIds[0];
            }
            return {
                ...state,
                items: action.data.branches,
                canSeeAllBranchs: action.data.userCanSeeAllBranchs,
                userBranchIds: action.data.userBranchIds,
                loaded: true
            }
        case types.CREATE_SUCCESS:
            return {
                ...state,
                items: [...state.items, action.data]
            };
        case types.UPDATE_SUCCESS:
            index = state.items.findIndex(item => item.id == action.data.id);
            if (index >= 0) {
                state.items[index] = action.data;
            }
            return {
                ...state
            };
        case types.DELETE_SUCCESS:
            state.items = state.items.filter(item => item.id != action.meta);
            state.userBranchIds = state.userBranchIds.filter(id => id != action.meta);

            if (state.currentId == action.meta) {
                if (state.canSeeAllBranchs) {
                    state.currentId = state.items[0].id;
                }
                else {
                    state.currentId = state.userBranchIds[0];
                }
            }
            return {
                ...state
            };
        default:
            return state;
    }
}