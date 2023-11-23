declare let Babili: any;

export const isJsonString = (str: any): any => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
};

export const parseTemplateLiterals = (str: string, obj: any = {}): any => {
    let tmpStr = str.slice().replace(/\n/g, ' ');
    while (/\$\{.+\}/.test(tmpStr)) {
        // Find and get Template Literal "${...}" from string
        let literalVar = tmpStr.replace(/^(?:.*)(\$\{.+\})(?:.*)/, '$1');
        literalVar = literalVar.slice(0, literalVar.indexOf('}') + 1);
        const varArr = literalVar.slice(2, -1).split('.');
        varArr.shift();
        const value = varArr.reduce((res, el) => {
            try {
                res = res[el];
            } catch (e) {
                // empty block
            }
            return res;
        }, obj);
        tmpStr = tmpStr.replace(literalVar, value || '');
    }
    return tmpStr;
};

// TODO:RESEARCH: We dont use IE any more
export const transpilingForIE = (code: any, obj: any): any => {
    const tmpCode = parseTemplateLiterals(code, obj);
    if (isJsonString(tmpCode)) {
        return tmpCode;
    }
    let result;
    try {
        result = Babili.transform(tmpCode, {presets: ['es2015']}).code.replace(/"use strict";/, '');
    } catch (e) {
        result = tmpCode;
    }
    return result;

};
