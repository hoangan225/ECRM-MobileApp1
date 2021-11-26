import { types } from '../../actions/facebookMessage/page';

const initState = {
    fbLogin: false,
    items: [],
    loaded: false,
    validatedItems: [],
    pageId: null,
    fbUserId: null,
    pageIdFb: null,
    pageProfile: null
};

export default (state = initState, action) => {
    var itemsFilter = null;
    var index = -1;
    switch (action.type) {
        case types.GET_LIST_PAGES_SUCCESS:
            state.items = action.data;
            if (state.pageId) {
                index = state.items.findIndex(x => x.id == state.pageId);
                if (index < 0) {
                    state.pageId = null;
                    state.fbUserId = null;
                }
            }
            return {
                ...state,
                loaded: true,
            }
        case types.GET_VALIDATED_LIST_PAGES_SUCCESS:
            return {
                ...state,
                validatedItems: action.data
            }
        case types.FACEBOOK_SELECT_PAGE:
            return {
                ...state,
                pageId: action.data.id,
                pageIdFb: action.data.pageIdFb,
                pageProfile: action.data.item
            }
        case types.UPDATE_CONNECTED_PAGES_SUCCESS:
            state.items = action.data.pageList;
            return {
                ...state
            }
        case types.ADD_LIST_SUCCESS:
            return {
                ...state,
                items: [...state.items, ...action.data],
            }
        case types.FACEBOOK_USER:
            return {
                ...state,
                fbUserId: action.data,
                fbLogin: true
            }
        case types.CHANGE_PAGE_FACEBOOK:
            return {
                ...state,
                pageProfile: action.data.item,
                pageId: action.data.ecrmPageId,
                pageIdFb: action.data.pageIdFb
            }
        case types.DELETE_PAGE_SUCCESS:
            state.items = state.items.filter(item => item.id != action.meta);
            return {
                ...state
            }
        case types.CREATE_FAVORITE_PAGES_SUCCESS:
            index = state.items.findIndex(item => item.id == action.meta);
            if (index >= 0) {
                state.items[index].favorite = true;
            }
            return {
                ...state
            }
        case types.REMOVE_FAVORITE_PAGES_SUCCESS:
            index = state.items.findIndex(item => item.id == action.meta);
            if (index >= 0) {
                state.items[index].favorite = false;
            }
            return {
                ...state
            }
        case types.CONNECT_FBCHAT_SUCCESS:
            index = state.items.findIndex(item => item.id == action.meta);
            if (index >= 0) {
                state.items[index].fbChatAble = true;
            }
            return {
                ...state
            }
        case types.REMOVE_CONNECT_FBCHAT_SUCCESS:
            index = state.items.findIndex(item => item.id == action.meta);
            if (index >= 0) {
                state.items[index].fbChatAble = false;
            }
            return {
                ...state
            }
        default:
            return state;

    }
}


