import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { XmPublicIdpConfigService, XmPublicUiConfigService } from '@xm-ngx/core';
import { XmPrivateUiConfigService } from './xm-private-ui-config.service';

import { XmUIConfig } from './xm-ui-config-model';
import { IIdpConfig } from '../../src/xm-public-idp-config-model';

@Injectable({ providedIn: 'root' })
export class XmUiConfigService<T extends XmUIConfig = XmUIConfig> {

    constructor(private privateUiConfigService: XmPrivateUiConfigService,
                private publicUiConfigService: XmPublicUiConfigService,
                private publicIdpConfigService: XmPublicIdpConfigService) {
    }

    public config$(): Observable<T> {
        return combineLatest([
            this.publicUiConfigService.config$(),
            this.privateUiConfigService.config$().pipe(startWith(null), catchError(() => of(null))),
        ]).pipe(
            map((res) => _.merge.apply(null, res)),
            switchMap((config: XmUIConfig) => {
                if(config && config.idp && config.idp.enabled) {
                    return this.publicIdpConfigService
                        .config$()
                        .pipe(
                            startWith(null),
                            map((idpConfig: IIdpConfig) => _.merge(config, idpConfig)),
                            catchError(() => of(null))
                        );
                } else {
                    return of(config);
                }
            }),
        );
    }

}
