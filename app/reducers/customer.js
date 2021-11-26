import { types } from '../actions/customer';
import { types as viewTypes } from '../actions/customview';
import { REHYDRATE, PURGE, persistCombineReducers } from 'redux-persist';

const initState = {
    item: {},
    items: [], //chứa toàn bộ khách hàng (thông tin cơ bản) của tất cả các views
    views: [], //Chứa toàn bộ các views kèm khách hàng [{viewId, items, total, filter}]
    itemnews: [],
    itemNotes: [],
    recommenders: [],
    total: 0,
    loaded: false,
    viewId: 0,
    viewIds: [],
    birthdate: {
        countToDay: 0,
        countNextDay: 0,
        countWeekDate: 0,
        countMonthDate: 0
    },
    eventDate: {
        countToDay: 0,
        countNextDay: 0,
        countWeekDate: 0,
        countMonthDate: 0
    },
    customerAmount: {
        oppCount: 0,
        oppAmount: 0,
        contractAmount: 0,
        lastActive: 0
    },
    listBirthdate: [],
    listEvent: [],
    list: [], //list khách hàng chung
    typeBirhday: '', //loại ngày của sinh nhật
    eventValue: '', //loại ngày của sự kiện
    evaluations: [],
};

export default function user(state = initState, action) {
    let index;
    let indexNew;
    let customer;
    switch (action.type) {
        case 'BRANCH_SWITCH_CURRENT':
            return initState;
        case REHYDRATE:
            let obj = {
                ...state,
                storageLoaded: true
            };
            if (action.payload) {
                obj = { ...obj, ...action.payload.customer, itemnews: [] }
            }
            return obj;
        case types.GET_SINGLE_SUCCESS:
            return {
                ...state,
                item: action.data.item,
                loaded: true,
            }
        case types.GET_LIST_SUCCESS:
            var actionData = action.data;

            //#1-Sinh nhật
            if (actionData.typeBirhday || actionData.eventValue) {
                return {
                    ...state,
                    total: action.data.total,
                    loaded: true,
                    viewId: viewId,
                    itemnews: [],
                    typeBirhday: actionData.typeBirhday,
                    listBirthdate: actionData.listBirthdate,
                    eventValue: actionData.eventValue,
                    listEvent: actionData.listEvent,
                }
            }
            //#2- Danh sách các view
            //items từ action
            var items = actionData.items.map(item => ({
                ...item,
                metas: JSON.parse(item.metas)
            }));
            // // console.log('items', items);
            //info action
            var viewId = actionData.viewId;
            // console.log('items', viewId);
            // state.viewIds = state.viewIds.push(viewId);
            // state.viewIds = Array.from(new Set(state.viewIds.map(item => item)));
            var total = actionData.total;
            var entity = { items: [...items], viewId: viewId, total: total, typeBirhday: actionData.typeBirhday };
            //cập nhật lại views
            var olds = state.views;
            if (olds && olds.length > 0) {
                index = olds.findIndex(item => item.viewId == actionData.viewId);

                if (index >= 0) {
                    // // console.log('state.views', state.views);
                    state.views[index] = entity;
                }
                else {
                    state.views.push(entity);
                }
            }
            else {
                state.views.push(entity);
            }

            //đưa toàn bộ khách hàng vào items chung:
            if (!state.items || state.items.length == 0) {
                state.items = items;
            }
            else if (items && items.length > 0) {
                var idCustomers = state.items.map(item => { return item.id; });
                var listNew = items.filter(t => !idCustomers.contains(t.id));
                if (listNew && listNew.length > 0) {
                    state.items = [...state.items, ...listNew];

                }
            }
            //Sắp xếp lại theo id
            var stateList = state.items;
            if (stateList && stateList.length > 0) {
                state.items = stateList.sort((t1, t2) => t1.id - t2.id);
            }
            return {
                ...state,
                items: state.items,
                views: state.views,
                total: action.data.total,
                loaded: true,
                viewId: viewId,
                //  itemnews: [],
                typeBirhday: actionData.typeBirhday,
                listBirthdate: actionData.listBirthdate,
                eventValue: actionData.eventValue,
                listEvent: actionData.listEvent,
            }
        case types.CREATE_SUCCESS:
            return {
                ...state,
                items: [...state.items, {
                    ...action.data,
                    metas: JSON.parse(action.data.metas)
                }],
                itemnews: [...state.itemnews, {
                    ...action.data,
                    metas: JSON.parse(action.data.metas)
                }],
                loaded: true,
            };
        case types.UPDATE_SUCCESS:
            var itemViewId = state.items.filter(t => t.viewId == action.data.viewId);
            if (itemViewId && itemViewId.length > 0) {
                index = itemViewId[0].items.findIndex(item => item.id == action.data.item.id);
            }
            indexNew = state.itemnews.findIndex(item => item.id == action.data.item.id);

            if (index >= 0) {
                itemViewId[0].items[index] = {
                    ...action.data.item,
                    metas: JSON.parse(action.data.item.metas)
                };

            }
            if (indexNew >= 0) {
                state.itemnews[indexNew] = {
                    ...action.data.item,
                    metas: JSON.parse(action.data.item.metas)
                };
            }
            return {
                ...state
            };
        case types.UPDATES_SUCCESS: //cập nhật nhiều rows
            var list = state.items;
            if (list && list.length > 0) {
                action.data.items.map((customer) => {
                    list.map((item, index) => {
                        //tìm kiếm customer có trong item.items
                        if (item && item.items && item.items.length > 0) {
                            var indexMain = item.items.findIndex(t => t.id == customer.id);
                            if (indexMain >= 0) {
                                state.items[index].items[indexMain] = {
                                    ...customer,
                                    metas: JSON.parse(customer.metas)
                                };
                            }
                        }
                    });
                })

            }
            return {
                ...state
            };
        case types.DELETE_SUCCESS:
            var entitys = [];
            var indexCus = state.itemnews.findIndex(item => item.id == action.meta);
            state.items.map((item, stt) => {
                if (item.id && item.id > 0) {
                    if (item.id != action.meta) {
                        entitys.push(item);
                    }
                }
                else {
                    entitys.push({ ...item, items: item.items.filter(item => item.id != action.meta) });
                }
            })
            if (entitys && entitys.length > 0) {
                state.items = entitys;
                // state.itemnews = entitys.filter(t => t.id > 0);
            }
            else {
                state.items = state.items.filter(item => item.id != action.meta);
            }
            if (indexCus) {
                state.itemnews = state.itemnews.splice(indexCus, 1);
            }
            return {
                ...state
            };
        case types.DELETE_MULTI_SUCCESS:
            var list = state.items;
            var views = state.views;

            if (list && list.length > 0) {
                list = list.filter(t => !action.meta.contains(t.id));
                state.items = list;
            }
            var itemNews = []; //khởi tạo lại
            if (views && views.length > 0) {
                views.map((view, index) => {
                    if (view && view.items && view.items.length > 0) {
                        itemNews = [...itemNews, { ...view, items: view.items.filter(t => !action.meta.contains(t.id)) }]
                    } else {
                        itemNews = [...itemNews, view];
                    }
                })
            }
            state.views = itemNews;

            return {
                ...state
            };
        case types.CREATENOTE_SUCCESS:
            return {
                ...state,
                itemNotes: [...state.itemNotes, {
                    ...action.data,
                }],
                loaded: true,
            };
        case types.COUNTBIRTHDATE_SUCCESS:
            //#birthdate
            var actionData = action.data;
            var birthdate = {
                ...actionData.birthdate
            };
            return {
                ...state,
                birthdate: birthdate,
            }
        case types.COUNTEVENT_SUCCESS:
            //#eventDate
            var actionData = action.data;
            var eventDate = [...actionData.eventDate];
            return {
                ...state,
                eventDate: eventDate,
            }
        case types.UPDATE_AVATAR_SUCCESS:
            state.items.map(view => {
                if (view.items) {
                    customer = view.items.find(item => item.id != action.meta);
                    if (customer) customer.avatar = action.params.url;
                }
            })

            customer = state.itemnews.find(item => item.id != action.meta);
            if (customer) customer.avatar = action.params.url;

            return {
                ...state
            }
        case viewTypes.DELETE_SUCCESS:
            var views = state.views.filter(t => t.viewId != action.meta && t.viewId != null);
            if (views && views.length > 0) {
                state.views = views;
            }
            return {
                ...state
            };
        case types.GET_LIST_RECOMMENDER_SUCCESS:
            return {
                ...state,
                recommenders: action.data.item,
                loaded: true,
            }
        case types.CUSTOMERAMOUNT_SUCCESS:
            var actionData = action.data;
            var customerAmount = {
                ...actionData.customerAmount
            };
            return {
                ...state,
                customerAmount: customerAmount,
            }
        case types.LIST_EVALUATION_SUCCESS:
            var actionData = action.data;
            // console.log('list: render customer 2;', action, actionData)
            var evaluations = [...actionData.evaluations];
            return {
                ...state,
                evaluations: evaluations,
            }
        case types.CREATE_EVALUATION_SUCCESS:
            return {
                ...state,
                evaluations: [action.data, ...state.evaluations]
            };
        case types.UPDATE_EVALUATION_SUCCESS:
            index = state.evaluations.findIndex(item => item.id == action.data.id);
            if (index >= 0) {
                state.evaluations[index] = action.data;
            }
            return {
                ...state
            };
        case viewTypes.DELETE_EVALUATION_SUCCESS:
            state.evaluations = state.evaluations.filter(item => item.id != action.meta);
            return {
                ...state
            };
        default:
            return state;
    }
}