import { types } from '../actions/process';
import { REHYDRATE } from 'redux-persist';

const initState = {
    process: null,
    items: [],
    loaded: false,
    viewId: 2,
};

export default function processes(state = initState, action) {
    let index;
    switch (action.type) {
        // case REHYDRATE:

        case types.GET_LIST_SUCCESS:
            if (state.process) {
                state.process = action.data.items.find(item => item.id == state.process.id);
            }
            // // console.log('action.data',action.data)
            return {
                ...state,
                loaded: true,
                items: action.data.items,
                process: state.process || action.data.items[0] || null,
            }

        case types.CREATE_SUCCESS:
            //set quy trình mới thành quy trình hiện tại
            state.process = action.data;
            return {
                ...state,
                items: [action.data, ...state.items]
            };

        case types.UPDATE_SUCCESS:
            index = state.items.findIndex(item => item.id == action.data.id);
            state.process = action.data;
            if (index >= 0) {
                state.items[index] = action.data;
            }
            return {
                ...state
            };

        case types.DELETE_SUCCESS:
            state.items = state.items.filter(item => item.id != action.meta);
            state.process = state.items[0] || null;
            return {
                ...state
            };

        case types.SWITCH_PROCESS:
            return {
                ...state,
                process: state.items.find(item => item.id == action.id),
            }
        case types.SWITCH_VIEW:
            return {
                ...state,
                viewId: action.id
            }
        default:
            return state;
    }
}