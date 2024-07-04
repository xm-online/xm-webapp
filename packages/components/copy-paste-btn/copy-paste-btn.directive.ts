import {
    Directive,
    EventEmitter, HostListener, inject,
    Input,
    Output,
} from '@angular/core';
import * as _ from 'lodash';
import { cloneDeep, omit } from 'lodash';
import { Dashboard, DashboardWidget } from '@xm-ngx/core/dashboard';
import { CONFIG_TYPE, CopiedObject, XM_WEBAPP_OPERATIONS } from '@xm-ngx/administration/dashboards-config';
import {
    ClipboardOperations,
    DashboardCopyClipboardDialog
} from './dashboard-copy-clipboard-dialog/dashboard-copy-clipboard-dialog.model';
import { take } from 'rxjs/operators';
import { copyToClipboard, readFromClipboard } from '@xm-ngx/operators';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DashboardCopyClipboardDialogComponent } from './dashboard-copy-clipboard-dialog/dashboard-copy-clipboard-dialog.component';

export interface CopyPasteBtnOptions {
    configType: CONFIG_TYPE;
    eventType: ClipboardOperations;
    data: Dashboard | DashboardWidget;
    widgets: DashboardWidget[];
}

@Directive({
    standalone: true,
    selector: '[xmCopyPasteBtn]',
})
export class CopyPasteBtnDirective {
    @Input('xmCopyPasteBtnOptions') public options: CopyPasteBtnOptions;
    @Output() public eventValue: EventEmitter<Dashboard | DashboardWidget> = new EventEmitter();
    @Output() public eventDashboardWidgets: EventEmitter<DashboardWidget[]> = new EventEmitter();

    private matDialog: MatDialog = inject(MatDialog);

    @HostListener('click', ['$event.target'])
    public async onClick(): Promise<void> {
        if (this.options.eventType === ClipboardOperations.COPY) {
            this.onCopyToClipboard();
        } else if (this.options.eventType === ClipboardOperations.PASTE) {
            await this.onPasteFromClipboard();
        }
    }

    public onCopyToClipboard(): void {
        const data = _.cloneDeep(this.options.data || {});

        if (this.options.configType === CONFIG_TYPE.DASHBOARD) {
            _.set(data , 'widgets', this.options.widgets);
            delete data.id;
            data.widgets = data.widgets.map(widget => omit(cloneDeep(widget), ['id', 'dashboard']) as DashboardWidget);
        } else if(this.options.configType === CONFIG_TYPE.WIDGET) {
            delete data.id;
            delete (data as DashboardWidget).dashboard;
        }

        const enrichedData: CopiedObject = {
            type: XM_WEBAPP_OPERATIONS.COPY,
            configType: this.options.configType,
            config: data,
        };

        const text = JSON.stringify(enrichedData);

        this.getClipboardDialog({
            value: text,
            operation: ClipboardOperations.COPY
        })
            .pipe(
                take(1),
            )
            .subscribe(async (res: DashboardCopyClipboardDialog) => {
                await copyToClipboard(res?.value, {insecurePrompt: false});
            });
    }

    public async onPasteFromClipboard(): Promise<void> {
        const text = await readFromClipboard();

        this.getClipboardDialog({
            value: text as string,
            operation: ClipboardOperations.PASTE
        })
            .pipe(
                take(1),
            )
            .subscribe((res: DashboardCopyClipboardDialog) => {
                const value = _.merge(this.options.data, this.getCopiedObjectConfig(res.value));
                this.eventValue.emit(value);
            });
    }

    private getClipboardDialog(dialogData: DashboardCopyClipboardDialog): Observable<DashboardCopyClipboardDialog> {
        const dialogForm = this.matDialog.open<DashboardCopyClipboardDialogComponent>(
            DashboardCopyClipboardDialogComponent,
            {
                width: '1000px',
                data: {
                    value: dialogData.value,
                    operation: dialogData.operation
                }
            },
        );
        return dialogForm.afterClosed();
    }

    private getCopiedObjectConfig(text: string): Dashboard {
        let copiedObject: CopiedObject;

        if (_.isString(text)) {
            try {
                copiedObject = JSON.parse(text) as CopiedObject;
            } catch (e) {
                console.warn(e);
                return null;
            }
        } else if (_.isObject(text)) {
            copiedObject = text as CopiedObject;
        }

        if (this.options.configType === CONFIG_TYPE.DASHBOARD) {
            copiedObject.config.widgets = CopyPasteBtnDirective.getUnbindedWidgets(copiedObject.config.widgets);
            this.eventDashboardWidgets.emit(copiedObject.config.widgets);
        }

        return copiedObject.config;
    }

    public static getUnbindedWidgets(widgets: DashboardWidget[]): DashboardWidget[] {
        return widgets.map(w => {
            delete w.id;
            delete w.dashboard;
            return w;
        });
    }
}
