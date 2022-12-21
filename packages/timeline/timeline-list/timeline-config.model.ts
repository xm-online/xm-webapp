/* tslint:disable:max-classes-per-file */
export class TimeLineConfig {
    constructor(public responses: TimeLineConfigItem[]) {
    }
    public getResponseConfigItem(tlc: any): TimeLineConfigItem {
        return this.responses.filter((r) => {
            return r.isMatch(tlc);
        })[0];
    }
}

export class TimeLineConfigItem {
    constructor(public code?: string,
                public codePath?: string,
                public template?: string,
                public condition?: any) {
    }

    public isMatch(tlc: TimeLineContext): boolean {
        const regExp = new RegExp(this.code);
        if ((this.code != null) && !(regExp.test(this.getByPath(tlc.response, this.codePath)))) {
            return false;
        }
        try {
            if ((this.condition != null) && !new Function('tlc', this.condition)(tlc)) {
                return false;
            }
        } catch (e) {
            console.warn(e);
            return false;
        }
        return true;
    }

    private getByPath(obj: any, path: any): any | undefined {
        const paths = path.split('.');
        let current = obj;
        let i;
        for (i = 0; i < paths.length; ++i) {
            if (!current[paths[i]]) {
                return undefined;
            }
            current = current[paths[i]];

        }
        return current;
    }
}

export class TimeLineContext {
    constructor(public response?: any) {
    }
}
