import { ErrorHandler, Injectable } from '@angular/core';
import { XmLog, XmLoggerService } from '@xm-ngx/logger';
import { jsonSafeStringify } from '@xm-ngx/shared/operators';

@Injectable()
export class GlobalErrorHandler extends ErrorHandler {

    constructor(
        private loggerService: XmLoggerService,
    ) {
        super();
    }

    public handleError(error: any): void {
        const chunkFailedMessage = /Loading chunk [\d]+ failed/;

        if (chunkFailedMessage.test(error?.message)) {
            window.location.reload();
        } else {
            this.dispatchLog(error);
            super.handleError(error);
        }
    }

    private dispatchLog(error: unknown): void {
        const log: XmLog = {
            level: 'error',
            name: 'GlobalErrorHandler',
            timeStamp: new Date().toISOString(),
            message: jsonSafeStringify(error),
        };
        this.loggerService.dispatch(log);
    }
}
