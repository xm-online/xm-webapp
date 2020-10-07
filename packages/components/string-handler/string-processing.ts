import { Injectable } from '@angular/core';
import { reduce, startsWith } from 'lodash';
import { startCase, toLower, toUpper, trim } from 'lodash/fp';

export type StringHandler = (v: string) => string;

export interface StringProcessorsFactoryOptions {
    case?: 'UPPERCASE' | 'START_CASE' | 'LOWERCASE',
    trim?: true
}

@Injectable()
export class StringProcessing {
    public static unPrefix(prefix: string): StringHandler {
        return (value) => {
            if (startsWith(value, prefix)) {
                value = value.substring(prefix.length, value.length);
            }
            return value;
        };
    }

    public static prefix(prefix: string): StringHandler {
        return (value) => {
            if (!startsWith(value, prefix)) {
                value = prefix + value;
            }
            return value;
        };
    }

    public static trim(): StringHandler {
        return (value) => trim(value);
    }

    public static case(stringCase: 'UPPERCASE' | 'START_CASE' | 'LOWERCASE'): StringHandler {
        return (value) => {
            if (stringCase === 'UPPERCASE') {
                value = toUpper(value);
            } else if (stringCase === 'LOWERCASE') {
                value = toLower(value);
            } else if (stringCase === 'START_CASE') {
                value = startCase(value);
            }
            return value;
        };
    }

    public static handleAll(handlers: StringHandler[]): StringHandler {
        return (v) => reduce(handlers, (v, fn) => fn(v), v);
    }

    public static handlersFactory(options: StringProcessorsFactoryOptions): StringHandler[] {
        const handlers: StringHandler[] = [];
        if (options.case){
            handlers.push(StringProcessing.case(options.case));
        }
        if (options.trim){
            handlers.push(StringProcessing.trim());
        }
        return handlers;
    }
}
