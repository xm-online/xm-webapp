import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Translate, XmTranslateService } from '@xm-ngx/translation';
import * as _ from 'lodash';
import { JhiAlert } from 'ng-jhipster';
import { Observable } from 'rxjs';

export interface ToasterConfig extends Partial<JhiAlert> {
    text?: Translate;
    textOptions?: {
        value?: string | object;
        [value: string]: string | object;
    };
    /** @deprecated msg use text instead */
    msg?: string | undefined;
}

@Injectable({
    providedIn: 'root',
})
export class XmToasterService {

    constructor(protected translateService: XmTranslateService,
                protected alertService: MatSnackBar) {
    }

    public create(params: ToasterConfig): Observable<ToasterConfig[]> {

        if (params.text) {
            params.msg = params.text as string;
        }

        if (params.msg) {
            const opts = params.textOptions || {};
            _.defaults(opts, { value: '' });

            params.msg = this.translateService.translate(params.msg, opts);
        }

        const snackbar = this.alertService.open(params.msg, 'x', {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'right',
            panelClass: 'alert-' + params.type,
        });

        // TODO: hotfix: join ToasterConfig[] with MatSnackBarDismiss
        return snackbar.afterDismissed() as any;
    }

    /** @deprecated use create instead */
    public success(text: string, params?: any, position?: string): void {
        this.create({ type: 'success', text, params, position }).subscribe();
    }

    /** @deprecated use create instead */
    public danger(text: string, params?: any, position?: string): void {
        this.create({ type: 'danger', text, params, position }).subscribe();
    }

    /** @deprecated use danger instead */
    public error(text: string, params?: any, position?: string): void {
        this.danger(text, params, position);
    }

    /** @deprecated use create instead */
    public warning(text: string, params?: any, position?: string): void {
        this.create({ type: 'warning', text, params, position }).subscribe();
    }

    /** @deprecated use create instead */
    public info(text: string, params?: any, position?: string): void {
        this.create({ type: 'info', text, params, position }).subscribe();
    }

}
