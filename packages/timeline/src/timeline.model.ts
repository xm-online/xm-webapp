export class Timeline {

    constructor(public rid?: string,
                public login?: string,
                public tenant?: string,
                public msName?: string,
                public operationName?: string,
                public entityId?: number,
                public entityKey?: string,
                public entityTypeKey?: string,
                public operationUrl?: string,
                public httpMethod?: string,
                public httpStatusCode?: number,
                public startDate?: Date | string,
                public requestBody?: string,
                public requestLength?: number,
                public responseBody?: string,
                public responseLength?: number,
                public channelType?: string,
                public requestHeaders?: unknown,
                public responseHeaders?: unknown,
                public execTime?: number,
                public browser?: string,
                public opSystem?: string,
                public id?: string,
    ) {
    }

}
