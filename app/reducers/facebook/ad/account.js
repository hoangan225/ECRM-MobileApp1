import { types } from '@/actions/facebook/ad/account';

const initState = {
    items: [],
    total: 0,
    loaded: false,
};

export default (state = initState, action) => {
    switch ( action.type ) {

        case types.GET_LIST_SUCCESS:
            return {
                ...state,
                items: action.data.items,
                total: action.data.total,
                loaded: true,
            }
        case types.CREATE_SUCCESS:
            return {
                ...state,
                total: state.total + 1,
                items: [...state.items, action.data],
            }
        case types.DELETE_SUCCESS:
            const items = state.items.filter(x => x.id != action.meta);
            return {
                ...state,
                items: [...items],
                total: state.total - 1,
            }
        default:
            return state;
    }
}
