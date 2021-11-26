import { AsyncStorage } from 'react-native';
import langs from '../languages';

class Translator {
    locale = null;
    defaultLocale = "vi";

    constructor() {
        let opt = AsyncStorage.getItem("locale");
        if (opt) {
            this.locale = opt;
        }
    }

    setLocale = code => {
        this.locale = code || this.defaultLocale;
        AsyncStorage.setItem('locale', code || this.defaultLocale);
    }

    setDefaultLocale = code => {
        this.defaultLocale = code;
    }

    getCatalog = () => {
        const code = this.locale || this.defaultLocale;
        const source = langs[code] || langs['vi'];
        return source.catalog;
    }

    translate = (text, ...params) => {
        if (!text) {
            return "";
        }

        const catalog = this.getCatalog();

        if (catalog.hasOwnProperty(text)) {
            if (catalog[text] !== null) {
                text = catalog[text];
            }
        }

        if (params && params.length > 0) {
            text = text.replace(/\{(\d+)\}/gm, (w, d) => params[d]);
        }

        text = text.replace(/\{\d+\}/mg, "");

        return text;
    }
}

const translator = new Translator();

// global translate functions

window.__ = translator.translate;

window.__S = function (...params) {
    params[0] = 's>' + params[0];
    return translator.translate.apply(translator, params);
}

window.__F = function (...params) {
    let text = translator.translate.apply(translator, params);
    return text.capitalize();
}

window.__L = function (...params) {
    let text = translator.translate.apply(translator, params);
    return text.toLowerCase();
}

window.__U = function (...params) {
    let text = translator.translate.apply(translator, params);
    return text.toUpperCase();
}

// export
export default translator;
