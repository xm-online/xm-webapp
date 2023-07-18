import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarDismiss } from '@angular/material/snack-bar';
import { Translate, XmTranslateService } from '@xm-ngx/translation';
import * as _ from 'lodash';
import { JhiAlert, JhiAlertService } from 'ng-jhipster';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { XmPublicUiConfigService } from '@xm-ngx/core';

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
    protected useMatSnackbars: boolean = false;

    constructor(protected translateService: XmTranslateService,
                private userService: XmPublicUiConfigService<{ toaster: { handle: 'mat-snackbar' | 'jhi-alerts' } }>,
                protected matSnackBar: MatSnackBar,
                protected jhiAlertService: JhiAlertService) {
        this.userService.config$()
            .pipe(filter(u => u?.toaster?.handle === 'mat-snackbar'))
            .subscribe(() => this.useMatSnackbars = true);
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

        if (this.useMatSnackbars) {
            // TODO: hotfix: join ToasterConfig[] with MatSnackBarDismiss
            return this.matAlert(params) as any;
        }
        return this.jhiAlert(params);

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

    protected jhiAlert(params: ToasterConfig): Observable<JhiAlert[]> {
        return new Observable((observer) => {

            if (params.close) {
                params.close = (args) => {
                    params.close(args);
                    observer.next(args);
                    observer.complete();
                };
            } else {
                params.close = close;
            }

            this.jhiAlertService.addAlert(params as JhiAlert, []);
        });
    }

    protected matAlert(params: ToasterConfig): Observable<MatSnackBarDismiss> {
        const snackbar = this.matSnackBar.open(params.msg, 'x', {
            duration: params.timeout || 5000,
            verticalPosition: 'top',
            horizontalPosition: 'right',
            panelClass: 'alert-' + params.type,
        });

        return snackbar.afterDismissed();
    }
}
