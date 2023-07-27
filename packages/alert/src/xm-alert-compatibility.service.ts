import { Inject, Injectable, InjectionToken, Provider } from '@angular/core';
import { XmAlertService } from './xm-alert.service';
import { Observable, from } from 'rxjs';
import { defaults } from 'lodash';
import { XmAlertOptions, XmAlertResult } from './xm-alert-compatibility.interface';

export interface XmSweetAlertClass {
    fire<R>(options: XmAlertOptions): Promise<XmAlertResult<R>>;
}

export const XM_SWEET_ALERT = new InjectionToken<XmSweetAlertClass>('XM_SWEET_ALERT');

/**
 * @deprecated
 * Will be removed in the next release
 */
@Injectable({
    providedIn: 'root',
})
export class XmSweetAlertService<O extends XmAlertOptions> extends XmAlertService {
    constructor(
        @Inject(XM_SWEET_ALERT) public sweetAlert: XmSweetAlertClass,
    ) {
        super();
    }

    public open(settings: O): Observable<XmAlertResult<any>> {
        if (settings.title) {
            settings.title = this.xmTranslateService.translate(settings.title, settings.titleOptions || {});
        }

        if (settings.text) {
            settings.text = this.xmTranslateService.translate(
                settings.text, 
                defaults({}, settings?.textOptions ?? {}, { value: '' }),
            );
        }

        settings.cancelButtonText = this.xmTranslateService.translate(settings.cancelButtonText);
        settings.confirmButtonText = this.xmTranslateService.translate(settings.confirmButtonText);

        return from(this.sweetAlert.fire(settings));
    }
}

/**
 * @deprecated
 * Will be removed in the next release
 */
export function xmSweetAlertFactory<O>(sweetAlert: XmSweetAlertClass): XmSweetAlertService<O> {
    return new XmSweetAlertService<O>(sweetAlert);
}

/**
 * @deprecated
 * Will be removed in the next release
 */
export function xmCompatibilityAlertDialog<O = XmAlertOptions>(sweetAlert: unknown): Provider[] {
    return [
        {
            provide: XM_SWEET_ALERT,
            useValue: sweetAlert,
        },
        {
            provide: XmAlertService,
            useFactory: xmSweetAlertFactory<O>,
            deps: [XM_SWEET_ALERT],
        },
    ];
}