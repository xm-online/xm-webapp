import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { XmPublicUiConfigService } from '@xm-ngx/core';
import { XmPrivateUiConfigService } from './xm-private-ui-config.service';

import { XmUIConfig } from './xm-ui-config-model';

@Injectable({ providedIn: 'root' })
export class XmUiConfigService<T extends XmUIConfig = XmUIConfig> {

    constructor(private privateUiConfigService: XmPrivateUiConfigService,
                private publicUiConfigService: XmPublicUiConfigService) {
    }

    public config$(): Observable<T> {
        return combineLatest([
            this.publicUiConfigService.config$(),
            this.privateUiConfigService.config$().pipe(startWith(null), catchError(() => of(null))),
        ]).pipe(
            map((res) => _.merge.apply(null, res)),
        );
    }

}
