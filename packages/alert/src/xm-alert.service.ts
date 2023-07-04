import { Injectable } from '@angular/core';
import { XmTranslateService } from '@xm-ngx/translation';
import * as _ from 'lodash';
import { map, Observable } from 'rxjs';
import { XmAlertConfigService } from './xm-alert-config.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';
import { XmAlertOptions, XmAlertResult } from './xm-alert-sweet.interface';

@Injectable({
    providedIn: 'root',
})
export class XmAlertService {

    constructor(protected config: XmAlertConfigService,
                protected xmTranslateService: XmTranslateService,
                protected dialog: MatDialog,
    ) {
    }

    public open(settings: XmAlertOptions): Observable<XmAlertResult> {
        this.config.getWithDefaults(settings);
        // const DEFAULT: XmAlertOptions = {
        //     width: this.config.width,
        //     buttonsStyling: this.config.buttonsStyling,
        //     reverseButtons: this.config.reverseButtons,
        //     showCloseButton: this.config.showCloseButton,
        //     centered: this.config.centered,
        //     customClass: {
        //         confirmButton: this.config.confirmButtonClass,
        //         cancelButton: this.config.cancelButtonClass,
        //     },
        //     confirmButtonText: this.config.yesLabel,
        //     cancelButtonText: this.config.cancelLabel,
        // };
        // settings = _.merge(DEFAULT, settings);

        // if (settings.title) {
        //     const opts = settings.titleOptions || {};
        //     // TODO: Check settings.title type
        //     settings.title = this.xmTranslateService.translate(settings.title as any, opts);
        // }

        // if (settings.text) {
        //     const opts = settings.textOptions || {};
        //     _.defaults(opts, {value: ''});

        //     settings.text = this.xmTranslateService.translate(settings.text, opts);
        // }

        // if (settings.confirmButtonText) {
        //     settings.confirmButtonText = this.xmTranslateService.translate(settings.confirmButtonText);
        // }
        // if (settings.cancelButtonText) {
        //     settings.cancelButtonText = this.xmTranslateService.translate(settings.cancelButtonText);
        // }
        const dialogRef = this.dialog.open(AlertDialogComponent, {
            // width: this.config.width + 'px' || '640px',
            panelClass: 'alert-dialog',
            data: settings,
        });
        return dialogRef.afterClosed().pipe(
            map(result => {
                return result;
            }),
        );
    }

    public yesNo(settings: XmAlertOptions): Observable<XmAlertResult> {
        return this.open(_.merge({
            // showCancelButton: true,
            // confirmButtonText: this.config.yesLabel,
            // cancelButtonText: this.config.noLabel,
        }, settings));
    }

    public yesCancel(settings: XmAlertOptions): Observable<XmAlertResult> {
        return this.open(_.merge({
            // showCancelButton: true,
            // confirmButtonText: this.config.yesLabel,
            // cancelButtonText: this.config.cancelLabel,
        }, settings));
    }

    public delete(options?: XmAlertOptions): Observable<XmAlertResult> {
        return this.yesCancel(_.merge({
            // title: this.config.deleteLabel,
            // text: this.config.deleteMessage,
            // confirmButtonText: this.config.deleteLabel,
        }, options));
    }
}
