import { inject, Injectable } from '@angular/core';
import { XmTranslateService } from '@xm-ngx/translation';
import { defaults, cloneDeep, merge } from 'lodash';
import { map, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { XmAlertComponent } from './xm-alert.component';
import { XmAlertOptions, XmAlertResult } from './xm-alert-compatibility.interface';
import { XmAlertConfig } from './xm-alert.interface';

@Injectable({
    providedIn: 'root',
})
export class XmAlertService {
    protected xmTranslateService = inject(XmTranslateService);
    protected dialog = inject(MatDialog);

    private withDefaults(settings: XmAlertOptions): XmAlertConfig {
        settings = defaults<object, Partial<XmAlertOptions>, Partial<XmAlertConfig>>(
            {}, 
            cloneDeep(settings),
            {
                iconColor: '#E41E26',
                dialogActionsAlign: 'end',
                showConfirmButton: true,
                showCancelButton: true,
                cancelButtonText: 'global.common.cancel',
                confirmButtonText: 'global.common.yes',
            },
        );

        return settings;
    }

    public open(settings: XmAlertOptions): Observable<XmAlertResult> {
        settings = this.withDefaults(settings);

        const dialogRef = this.dialog.open<XmAlertComponent, XmAlertConfig, XmAlertResult>(XmAlertComponent, {
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
        return this.open(merge({
            cancelButtonText: 'global.common.no',
        }, settings));
    }

    public yesCancel(settings: XmAlertOptions): Observable<XmAlertResult> {
        return this.open(settings);
    }

    public delete(settings?: XmAlertOptions): Observable<XmAlertResult> {
        return this.yesCancel(merge({
            icon: 'error_outline',
            center: true,
            title: 'global.common.delete',
            text: 'global.common.delete-message',
            confirmButtonText: 'global.common.delete',
        }, settings));
    }
}
