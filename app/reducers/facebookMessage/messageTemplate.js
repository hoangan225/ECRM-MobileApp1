import { types } from '../../actions/facebookMessage/messageTemplates';
const initState = {
    items: [],
    total: 0,
    loaded: false,
    template: []
};

export default (state = initState, action) => {
    let index;
    switch (action.type) {
        case types.GET_LIST_SUCCESS:
            return {
                ...state,
                items: action.data.items,
                total: action.data.total,
                loaded: true,
            }
        case types.GET_LIST_SEARCH_TEMPLATE_TOPIC_SUCCESS:
            return {
                ...state,
                items: action.data,
                total: 0,
                loaded: true,
            }
        case types.CREATE_SUCCESS:
            return {
                ...state,
                items: [action.data, ...state.items],
                total: state.total + 1
            };
        case types.CREATE_IMG_SUCCESS:
            return {
                ...state,
                items: [action.data, ...state.items]
            };
        case types.UPDATE_SUCCESS:
            index = state.items.findIndex(item => item.id == action.data.id);
            if (index >= 0) {
                state.items[index] = action.data;
            }
            return {
                ...state
            }
        case types.DELETE_SUCCESS:
            state.items = state.items.filter(item => item.id != action.meta);
            return {
                ...state
            };
        case types.GET_LIST_TEMPLATE_SUCCESS:
            return {
                ...state,
                template: action.data,
                loaded: true,
            }
        case types.GET_LIST_SCROLL_SUCCESS:
            // console.log(action.data, "action.dat");
            state.items = [...state.items, ...action.data.items];
            return {
                ...state,
                loaded: true,
            }
        default:
            return state;
    }
}