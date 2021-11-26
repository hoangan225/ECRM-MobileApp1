import { types } from '../../actions/facebookMessage/report';
const initState = {
    datagerena: null,
    dataQuantity: null,
    datarank: null,
    dataTag: null,
    dataReaction: null,
    dataTagView: null,
    searchPost: [],
    dataSales: null,
    dataViewSales:null,
    users: []
};


export default (state = initState, action) => {
    switch (action.type) {
        case types.GET_LIST_GERENA_SUCCESS:
            return {
                ...state,
                datagerena: action.data
            }
        case types.GET_LIST_QUANTITY_SUCCESS:
            return {
                ...state,
                dataQuantity: action.data
            }
        case types.GET_LIST_RANK_SUCCESS:
            return {
                ...state,
                datarank: action.data
            }
        case types.GET_LIST_TAG_SUCCESS:
            return {
                ...state,
                dataTag: action.data
            }

        case types.GET_LIST_TAG_VIEW_SUCCESS:
            return {
                ...state,
                dataTagView: action.data
            }
        case types.GET_LIST_REACTION_SUCCESS:
            return {
                ...state,
                dataReaction: action.data
            }
        case types.GET_LIST_SEARCH_POST_SUCCESS:
            return {
                ...state,
                searchPost: action.data
            }
        case types.GET_LIST_SALES_SUCCESS:
            return {
                ...state,
                dataSales: action.data
            }
        case types.GET_LIST_VIEW_SALES_SUCCESS:
            return {
                ...state,
                dataViewSales: action.data
            }

        case types.GET_LIST_USER:
            return {
                ...state,
                users: action.data
            }
        default:
            return state;

    }
}