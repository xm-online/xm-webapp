import { Injectable } from '@angular/core';
import { XmTranslateService } from '@xm-ngx/translation';
import * as _ from 'lodash';
import { map, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from './xm-alert.component';
import { XmAlertOptions, XmAlertResult } from './xm-alert-compatibility.interface';
import { XmAlertConfig } from './xm-alert.interface';

@Injectable({
    providedIn: 'root',
})
export class XmAlertService {
    constructor(
        protected xmTranslateService: XmTranslateService,
        protected dialog: MatDialog,
    ) {
    }

    private withDefaults(options: XmAlertOptions): XmAlertConfig {
        const settings: XmAlertOptions = _.defaults<object, Partial<XmAlertOptions>, Partial<XmAlertConfig>>(
            {}, 
            _.cloneDeep(options),
            {
                iconColor: '#E41E26',
                dialogActionsAlign: 'end',
                showConfirmButton: true,
                showCancelButton: true,
                cancelButtonText: 'global.common.cancel',
                confirmButtonText: 'global.common.yes',
            },
        );

        /**
         * @deprecated
         * Will be removed in the next release
         */
        if (settings.title) {
            settings.title = this.xmTranslateService.translate(settings.title, settings.titleOptions || {});
        }

        /**
         * @deprecated
         * Will be removed in the next release
         */
        if (settings.text) {
            settings.text = this.xmTranslateService.translate(
                settings.text, 
                _.defaults({}, settings?.textOptions ?? {}, { value: '' }),
            );
        }

        return settings;
    }

    public open(options: XmAlertOptions): Observable<XmAlertResult> {
        const settings = this.withDefaults(options);

        const dialogRef = this.dialog.open<AlertDialogComponent, XmAlertConfig, XmAlertResult>(AlertDialogComponent, {
            width: settings.width ?? '640px',
            panelClass: 'xm-alert',
            disableClose: false,
            autoFocus: 'dialog',
            data: settings,
        });

        return dialogRef.afterClosed().pipe(
            map(result => {
                /**
                 * When use clicks on backdrop
                 * Also dismiss key using in PendingChangesGuard
                 */
                if (!result) {
                    return { 
                        dismiss: 'close',
                        isConfirmed: false,
                        isDenied: false,
                        isDismissed: true,
                    };
                }

                return result;
            }),
        );
    }

    public yesNo(settings: XmAlertOptions): Observable<XmAlertResult> {
        return this.open(_.merge({
            cancelButtonText: 'global.common.no',
        }, settings));
    }

    public yesCancel(settings: XmAlertOptions): Observable<XmAlertResult> {
        return this.open(settings);
    }

    public delete(options?: XmAlertOptions): Observable<XmAlertResult> {
        return this.yesCancel(_.merge({
            icon: 'error_outline',
            center: true,
            title: 'global.common.delete',
            text: 'global.common.delete-message',
            confirmButtonText: 'global.common.delete',
        }, options));
    }
}
