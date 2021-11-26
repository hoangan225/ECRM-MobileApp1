class Request {
    host = 'https://dev.ecrm.vn';

    // url = path => {
    //     if (path && !path.match(/^\s*\//)) {
    //         path = '/' + path;
    //     }
    //     return this.host + (path || "");
    // }

    url = (path, url = "") => {
        if (path && path.match(/^\s*http/i)) {
            return path;
        }
        if (path && !path.match(/^\s*\//)) {
            path = '/' + path;
        }
        return url ? (url + (path || "")) : this.host + (path || "");
    }

    decode = path => {
        return decodeURIComponent(path);
    }

    encode = path => {
        return encodeURIComponent(path);
    }
}

export default new Request();