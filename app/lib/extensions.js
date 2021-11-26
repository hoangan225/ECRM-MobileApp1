

String.prototype.contains = function (str, toLower = true) {
    let _this = this;
    if (toLower) {
        _this = _this.toLowerCase();
        str = str.toLowerCase();
    }
    return _this.indexOf(str) !== -1;
}

String.prototype.parseJson = function () {
    if (!this) return {};
    return JSON.parse(this);
}

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}


Number.prototype.toLocaleString = function () {
    return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

Array.prototype.remove = function (func) {
    if (typeof func == 'number') {
        return this.splice(func, 1);
    }
    if (typeof func == 'function') {
        var index = this.findIndex(func);
        if (index >= 0) return this.splice(index, 1);
    }
    return this;
}

Array.prototype.sum = function (func) {
    if (typeof func == 'function') {
        let sum = 0;
        this.forEach(item => {
            let value = Number(func.call(this, item));
            if (value) sum += value;
        });
        return sum;
    }
    else {
        let sum = 0;
        this.forEach(item => {
            let value = Number(item);
            if (value) sum += value;
        });
        return sum;
    }
}

Array.prototype.toJson = function () {
    if (!this) return {};
    return JSON.stringify(this);
}

Array.prototype.count = function (func) {
    if (typeof func == 'function') {
        return this.filter(func).length;
    }
    else {
        return this.length;
    }
}

Array.prototype.contains = function (item) {
    return this.indexOf(item) !== -1;
}

Array.prototype.distinct = function () {
    return Array.from(new Set(this));
}

Array.prototype.isNotEmpty = function () {
    return this.length > 0;
}

Array.prototype.any = function (func) {
    if (func) return this.find(func) != null;
    return this.length > 0;
}

Array.prototype.isEmpty = function () {
    return this.length === 0;
}

Array.prototype.lastIndex = function () {
    return this.length - 1;
}

Array.prototype.last = function () {
    return this[this.length - 1];
}

Array.prototype.first = function () {
    return this[0];
}

/**
 * @description lấy 1 thuộc tính của object nằm trong mảng.
 * @param {string} key = 'key1.key2 || key
 */
Array.prototype.select = function (key) {
    let lst = this;
    const keys = key.split(".");
    keys.map(k => {
        lst = lst.map(item => item[k]).filter(item => item != null)
    });
    return lst;
}

Array.prototype.joinObj = function (key, separator = ',') {
    return this.select(key).join(separator);
}

Array.prototype.uniqueObj = function (objKey) {
    return this.filter((item, index, self) =>
        index === self.findIndex((t) => (
            t[objKey] === item[objKey]
        ))
    );
}

Array.prototype.orderBy = function (func) {
    return this.sort((a, b) => {
        return func(a) - func(b);
    });
}

Array.prototype.orderBy = function (func) {
    return this.sort((a, b) => {
        return func(a) - func(b);
    });
}

Array.prototype.orderByDesc = function (func) {
    return this.sort((a, b) => {
        return func(b) - func(a);
    });
}

Array.prototype.groupBy = function (func, toArray = true) {
    let obj = this.reduce(function (rv, x) {
        let key = func(x);
        (rv[key] = rv[key] || []).push(x);
        return rv;
    }, {});

    if (toArray) {
        return Object.entries(obj).map(data => ({ key: data[0], items: data[1] }));
    }
    return obj;
};

String.prototype.toMoney = function () {
    if (!this) return 0;
    return this.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
}
String.prototype.toJson = function () {
    if (!this) return {};
    return JSON.parse(this);
}

Number.prototype.toMoney = function () {
    if (!this) return 0;
    return this.toString().toMoney();
}

Array.prototype.max = function (func) {
    if (typeof func == 'function') {
        let max = this.length > 0 ? func.call(this, this[0]) : undefined;
        this.forEach(item => {
            let value = Number(func.call(this, item));
            if (max < value) max = value;
        });
        return max;
    }
    else {
        let max = this.length > 0 ? this[0] : undefined;
        this.forEach(item => {
            let value = Number(item);
            if (max < value) max = value;
        });
        return max;
    }
}

Array.prototype.min = function (func) {
    if (typeof func == 'function') {
        let min = this.length > 0 ? func.call(this, this[0]) : undefined;
        this.forEach(item => {
            let value = Number(func.call(this, item));
            if (min > value) min = value;
        });
        return min;
    }
    else {
        let min = this.length > 0 ? this[0] : undefined;
        this.forEach(item => {
            let value = Number(item);
            if (min > value) min = value;
        });
        return min;
    }
}

Array.prototype.chunk = function (groupsize) {
    var sets = [], chunks, i = 0;
    var clone = Array.from(this);
    chunks = this.length / groupsize;

    while (i < chunks) {
        sets[i] = clone.splice(0, groupsize);
        i++;
    }
    return sets;
};

/** 
 * enum
 */

window.getEnumLabel = (value, enumList) => {
    const found = (enumList || []).find(item => item.value == value);
    return found ? found.label : value;
}

window.getEnumName = (value, enumList) => {
    const found = (enumList || []).find(item => item.value == value);
    return found ? found.name : value;
}

window.getEnumValue = (name, enumList) => {
    name = name.toLowerCase();
    const found = (enumList || []).find(item => item.name.toLowerCase() == name);
    return found ? found.value : 0;
}


window.range = (start, end) => {
    return Array.from(
        { length: (end) }, (v, k) => k + start
    )
};

window.parseBool = (value) => {
    return value === true || value === 'true';
}

window._setOptions = (k, v) => {
    let options = (localStorage.getItem("ecrm:options") || "").parseJson();
    options[k] = v;
    localStorage.setItem("ecrm:options", JSON.stringify(options));
    return options;
}

window._getOptions = (k, defaultVal = null) => {
    let options = (localStorage.getItem("ecrm:options") || "").parseJson();
    return options[k] ? options[k] : defaultVal
}

window._removeOptions = (k) => {
    let options = (localStorage.getItem("ecrm:options") || "").parseJson();
    if (options[k]) {
        delete options[k];
    }
    localStorage.setItem("ecrm:options", JSON.stringify(options));
    return options;
}