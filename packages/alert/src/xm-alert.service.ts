import { Injectable } from '@angular/core';
import { Translate, XmTranslateService } from '@xm-ngx/translation';
import * as _ from 'lodash';
import { map, Observable } from 'rxjs';
import { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';
import { XmAlertConfigService } from './xm-alert-config.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../../alert-dialog/alert-dialog.component';

export interface XmAlertOptions extends Partial<SweetAlertOptions> {
    icon?: string | any;
    text?: Translate | any;
    textOptions?: {
        value?: string;
        [value: string]: string | object;
    };
    centered?: boolean,
    html?: string,
    titleOptions?: object;
    image?: {
        imageUrl: string
        imageWidth?: string
        imageHeight?: string
        imageAlt?: string
    }
}

export type XmAlertResult = SweetAlertResult;

@Injectable({
    providedIn: 'root',
})
export class XmAlertService {

    constructor(protected config: XmAlertConfigService,
                protected xmTranslateService: XmTranslateService,
                protected dialog: MatDialog,
    ) {
    }

    public open(settings: XmAlertOptions): Observable<SweetAlertResult> {

        const DEFAULT: XmAlertOptions = {
            width: this.config.width,
            buttonsStyling: this.config.buttonsStyling,
            reverseButtons: this.config.reverseButtons,
            showCloseButton: this.config.showCloseButton,
            centered: this.config.centered,
            customClass: {
                confirmButton: this.config.confirmButtonClass,
                cancelButton: this.config.cancelButtonClass,
            },
            confirmButtonText: this.config.yesLabel,
            cancelButtonText: this.config.cancelLabel,
        };
        settings = _.merge(DEFAULT, settings);

        if (settings.title) {
            const opts = settings.titleOptions || {};
            // TODO: Check settings.title type
            settings.title = this.xmTranslateService.translate(settings.title as any, opts);
        }

        if (settings.text) {
            const opts = settings.textOptions || {};
            _.defaults(opts, {value: ''});

            settings.text = this.xmTranslateService.translate(settings.text, opts);
        }

        if (settings.confirmButtonText) {
            settings.confirmButtonText = this.xmTranslateService.translate(settings.confirmButtonText);
        }
        if (settings.cancelButtonText) {
            settings.cancelButtonText = this.xmTranslateService.translate(settings.cancelButtonText);
        }
        const dialogRef = this.dialog.open(AlertDialogComponent, {
            width: this.config.width + 'px' || '640px',
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
            showCancelButton: true,
            confirmButtonText: this.config.yesLabel,
            cancelButtonText: this.config.noLabel,
            centered: this.config.centered,
        }, settings));
    }

    public yesCancel(settings: XmAlertOptions): Observable<XmAlertResult> {
        return this.open(_.merge({
            showCancelButton: true,
            confirmButtonText: this.config.yesLabel,
            cancelButtonText: this.config.cancelLabel,
            centered: this.config.centered,
        }, settings));
    }

    public delete(options?: XmAlertOptions): Observable<XmAlertResult> {
        return this.yesCancel(_.merge({
            title: this.config.deleteLabel,
            text: this.config.deleteMessage,
            confirmButtonText: this.config.deleteLabel,
            centered: this.config.centered,
        }, options));
    }
}
