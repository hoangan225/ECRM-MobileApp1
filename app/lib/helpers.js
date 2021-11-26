import khongdau from 'tieng-viet-khong-dau';

export const formatSmsContent = content => {
    if (!content) return "";
    content = khongdau.c(content);
    content = content.replace(/[^\w\d\n \!\@\$\%\&\(\)_\-\=\;\:\,\.\/\?]/img, '');
    return content;
}

export const search = (s, str) => {
    if (!str) return false;
    if (!s || s == "") return true;
    str = khongdau.c(str);
    s = khongdau.c(s);
    return str.contains(s);
}

export const countSmsChar = (content, max = 160) => {
    if (!content) return 0;
    let length = content.length;
    return (length % max) + '/' + Math.ceil(length / max);
}

export function isEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
}

export const format = "DD-MM-YYYY";


export function format_money(a) {
    if (a) {
        return a.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    } return a;
}

export function generatorInvoiceCocde(code, prefix = "0", length = 6) {
    return code.toString().padStart(length, prefix);
}
export function generatorId(length = 5) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

export function buildStyle(str) {
    return str.replace(/([A-Z])/g, "-$1").toLowerCase()
}