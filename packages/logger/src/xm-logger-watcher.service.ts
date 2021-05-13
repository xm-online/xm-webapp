import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {XmPublicUiConfigService} from '@xm-ngx/core';
import { Log, XmLoggerService } from './xm-logger.service';

import * as _ from 'lodash';
import {of} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';

interface XmLoggerWatcherConfig {
    levels: ('debug' | 'error' | 'info' | 'warn')[]
}

@Injectable()
export class XmLoggerWatcherService {
    constructor(
        private logger: XmLoggerService,
        private httpClient: HttpClient,
        private configService: XmPublicUiConfigService<{ logger: XmLoggerWatcherConfig }>,
    ) {
    }

    public init(): void {
        this.configService.config$().pipe(
            switchMap((config) => {
                if (config.logger) {
                    return this.logger.log$.pipe(
                        map((log) => {
                            if (_.includes(config.logger.levels, log.level)) {
                                return log;
                            }
                            return null;
                        }));
                } else {
                    return of(null);
                }
            }),
        ).subscribe((log: Log) => {
            if (!log) {
                return;
            }
            this.httpClient.post('/logger/api/log', {
                level: _.upperCase(log.level),
                message: log.message,
                fileName: log.name,
            }).subscribe();
        });
    }

}
