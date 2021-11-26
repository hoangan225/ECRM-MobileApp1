export const types = {
    CHANGE_LANGUAGE: 'APP_CHANGE_LANGUAGE',
    GET_OPTIONS: 'APP_GET_OPTIONS',
    SET_OPTIONS: 'APP_SET_OPTIONS',
    GET_ENUMS: 'APP_GET_ENUMS',
    GET_FIELDS: 'APP_GET_FIELDS',
}


export const getEnums = () => {
    return {
        url: '/api/enums',
        types: {
            success: types.GET_ENUMS,
        }
    };
};

export const getFields = () => {
    return {
        url: '/api/fields',
        types: {
            success: types.GET_FIELDS,
        }
    };
};

export const getOptions = () => {
    return {
        url: '/api/options',
        types: {
            success: types.GET_OPTIONS,
        }
    };
};

export const updateOptions = (options) => {
    return {
        url: '/api/options',
        params: options,
        method: 'post',
        types: {
            success: types.SET_OPTIONS,
        }
    };
};