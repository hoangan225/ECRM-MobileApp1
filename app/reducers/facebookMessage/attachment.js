import { types } from '../../actions/facebookMessage/attachments';
const initState = {
    filesImg: [],
    filesImgforder: [],
    imgSync:[],

};
export default (state = initState, action) => {
    let index;
    switch (action.type) {
        case types.GET_FILE_SUCCES:
            const filesImg = action.data
            return {
                ...state,
                filesImg: filesImg,
            }
        case types.GET_FILE_IMAGE_SUCCES:
            const filesImgforder = action.data;
            return {
                ...state,
                filesImgforder: filesImgforder,

            }

        case types.CREATE_FILE_IMAGE_SUCCES:
            return {
                ...state,
                filesImg: [...state.filesImg, action.data]
            };
        case types.DELETE_FILE_IMAGE_SUCCES:
            state.filesImg = state.filesImg.filter(filesImg => filesImg.id != action.meta);
            return {
                ...state
            };
            case types.GET_LIST_IMG_SYNC_SUCCESS:
                
                return {
                    ...state,
                    imgSync: action.data,
                    loaded: true,
                }

        case types.UPDATE_FILE_IMAGE_SUCCES:

            index = state.filesImg.findIndex(filesImg => filesImg.id == action.data.id);
            if (index >= 0) {
                state.filesImg[index] = action.data;
            }
            return {
                ...state
            };
        default:
            return state;
    }
}