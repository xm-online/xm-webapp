import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { SKIP_ERROR_HANDLER_INTERCEPTOR_HEADERS, XmPublicUiConfigService } from '@xm-ngx/core';
import { XmLoggerService } from './services/xm-logger.service';
import { XmLog, XmLogLevel } from './interfaces/xm-log.interface';
import * as _ from 'lodash';
import { of, Subscription } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';

interface XmLoggerWatcherConfig {
    levels: XmLogLevel[]
}

@Injectable()
export class XmLoggerWatcherService implements OnDestroy {

    private subscription: Subscription;

    constructor(
        private logger: XmLoggerService,
        private httpClient: HttpClient,
        private configService: XmPublicUiConfigService<{ logger: XmLoggerWatcherConfig }>,
    ) {
    }

    public init(): void {
        this.subscription = this.configService.config$().pipe(
            switchMap((config) => {
                if (config.logger) {
                    return this.logger.log$().pipe(
                        map((log) => {
                            if (_.includes(config.logger.levels, log.level)) {
                                return log;
                            }
                            return null;
                        }));
                }
                return of(null);
            }),
            filter(log => Boolean(log)),
            switchMap((log: XmLog) => this.httpClient.post(
                '/logger/api/log',
                {
                    level: _.upperCase(log.level),
                    message: log.message,
                    fileName: log.name,
                },
                {
                    headers: SKIP_ERROR_HANDLER_INTERCEPTOR_HEADERS,
                },
            )),
            catchError(() => of(null)),
        ).subscribe();
    }

    public ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }

}
