import { types } from '../actions/widget';

const initState = {
    job: {},
    conversion: {},
    customer: [],
}

export default (state = initState, action) => {
    switch (action.type) {
        case types.GET_LIST_JOB_SUCCESS:
            let job = null;
            const key = [`status-${action.params.jobStatusId != null ? action.params.jobStatusId : 'all'}`];
            if (action.params.page == 1) {
                job = {
                    ...state.job,
                    [key]: action.data,
                }
            } else {
                job = {
                    ...state.job,
                    [state.job[key]]: [
                        ...state.job[key],
                        ...action.data
                    ],
                }
            }
            return {
                ...state,
                job: { ...job }
            }
        case types.GET_CONVERSION_SUCCESS:
            // // console.log('reduce============', action.data)
            return {
                ...state,
                conversion: {
                    ...state.conversion,
                    [`type-${action.params.rangeType}`]: { ...action.data },
                }
            }
        case types.GET_CUSTOMER_SUCCESS:
            return {
                ...state,
                customer: [
                    // ...state.customer,
                    ...action.data,
                ]
            }

        default:
            return state;
    }
}