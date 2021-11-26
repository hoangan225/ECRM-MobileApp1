import { types } from '../actions/app';

const initState = {
    enums: {},
    options: {},
    fields: {},
    storageLoaded: true
};

export default (state = initState, action) => {
    switch (action.type) {
        case types.GET_ENUMS:
            // // console.log(action.data, 'data enum')
            return {
                ...state,
                enums: action.data,
            }
        case types.GET_FIELDS:
            return {
                ...state,
                fields: action.data,
            }
        case types.GET_OPTIONS:
            return {
                ...state,
                options: action.data
            }
        case types.SET_OPTIONS:
            return {
                ...state,
                options: action.params
            }
        default:
            return state;
    }
    return state;
}