import { transform, isEqual, isObject } from 'lodash';
export const difference = (object, base) => {
    // console.log(object,base);
    const changes = (object, base) => {
        return transform(object, (result, value, key) => {
            if (!isEqual(value, base[key])) {
                result[key] = (isObject(value) && isObject(base[key])) ? changes(value, base[key]) : value;
            }
        });
    }
    return changes(object, base);
}