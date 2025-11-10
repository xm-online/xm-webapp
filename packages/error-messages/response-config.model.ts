import * as _ from 'lodash';

export class ResponseConfig {
    constructor(public responses: ResponseConfigItem[]) {
    }

    public getResponseConfigItem(rc: any): ResponseConfigItem {
        return this.responses.filter((r) => {
            return r.isMatch(rc);
        })[0];
    }
}

export type ResponseConfigType = 'swal' | 'ignore' | 'validation' | 'alert' | 'redirect';

export class ResponseConfigItem {
    constructor(public code?: string,
                public codePath?: string,
                public status?: string,
                public type?: ResponseConfigType,
                public validationField?: string,
                public validationFieldsExtractor?: string,
                public outputMessage?: {
                    type: string;
                    value: string;
                },
                public toastDuration?: number,
                public condition?: any,
                public requestPathPattern?: string,
                public redirectUrl?: string) {
    }

    public isMatch(rc: ResponseContext): boolean {
        const regExp = new RegExp(this.code);
        if ((this.status != null) && this.status !== rc.response.status) {
            return false;
        }
        if ((this.code != null) && !(regExp.test(_.get(rc.response.error, this.codePath)))) {
            return false;
        }
        try {
            if ((this.requestPathPattern != null) && !new RegExp(this.requestPathPattern).test(rc.request.url)) {
                return false;
            }
            if ((this.condition != null) && !new Function('rc', this.condition)(rc)) {
                return false;
            }
        } catch (e) {
            console.warn(e);
            return false;
        }

        return true;
    }
}

export interface ResponseContext {
    response?: { status: string; error: any };
    request?: any;
}
