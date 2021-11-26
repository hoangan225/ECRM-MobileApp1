import { types } from '@/actions/facebook/ad/adset';

const initState = {
    items: [],
    total:0,
    loaded: false,
};

export default (state = initState, action) => {
    switch ( action.type ) {

        case types.GET_LIST_SUCCESS:
            return {
                ...state,
                ...action.data,
                loaded: true,
            }
  
        default:
            return state;
    }
}
