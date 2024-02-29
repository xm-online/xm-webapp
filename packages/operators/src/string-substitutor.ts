import * as _ from 'lodash';

export function stringSubstitute(template: string, values: object): string {
    return template.replace(/\$\{(.+?)(:-.+?)?\}/g, (match, key, defaultValue) => {
        key = key.trim();
        defaultValue = defaultValue ? defaultValue.slice(2).trim() : '';
        const value = _.get(values, key);
        return _.isNil(value) ? defaultValue : value;
    });
}
