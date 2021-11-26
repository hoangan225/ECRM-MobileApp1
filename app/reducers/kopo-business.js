import { types } from '../actions/kopo/business';


const initState = {
    current: null
};

export default (state = initState, action) => {
    switch (action.type) {
        case types.GET_ITEM_SUCCESS:
            return {
                current: action.data
            }
        case types.PATCH_SUCCESS:
            return {
                current: {
                    ...state.current,
                    ...action.params
                }
            };
        default:
            return state;
    }
}
