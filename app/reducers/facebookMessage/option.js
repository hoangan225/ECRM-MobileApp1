import translator from '../../lib/translator';
import { types } from '../../actions/facebookMessage/option';


const initState = {
    pageOption: {},
    userNobita: [],
    branch: [],
    branchUser: [],
    department: [],
    prio: {},
    userManageIds: []
};

export default (state = initState, action) => {
    switch (action.type) {
        case types.GET_PAGE_OPTIONS:
            if (action.data.defaultLocale) {
                translator.setDefaultLocale(action.data.defaultLocale)
            }
            return {
                ...state,
                pageOption: action.data
            }
        case types.SET_PAGE_OPTIONS:
            return {
                ...state,
                pageOption: action.params
            }

        case types.GET_USER_NOBITA:
            return {
                ...state,
                userNobita: action.data
            }
        case types.GET_USER_MANAGE_PAGE:
            return {
                ...state,
                userManageIds: action.data
            }
        case types.GET_BRANCH_PAGE:
            return {
                ...state,
                branch: action.data
            }
        case types.GET_USER_BRANCHH:
            return {
                ...state,
                branchUser: action.data
            }
        case types.GET_DEPARTMENT:
            return {
                ...state,
                department: action.data
            }
        case types.SET_PRIO_OPTIONS:
            return {
                ...state,
                prio: action.params
            }
        case types.GET_PRIO_OPTIONS:
            return {
                ...state,
                prio: action.data
            }
        // case types.GET_PAGE_OPTION_MANAGE:
        //     return {
        //         ...state,
        //         userManageIds: action.data?.userManageIds
        //     }

        case types.SET_MANAGE_PAGE:
            return {
                ...state,
                userManageIds: action.data
            }
        default:
            return state;
    }
}

