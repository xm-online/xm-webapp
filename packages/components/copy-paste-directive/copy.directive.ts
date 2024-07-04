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
import { copyToClipboard } from '@xm-ngx/operators';
import { CopyPasteService } from '@xm-ngx/components/copy-paste-directive/copy-paste.service';

export interface CopyPasteBtnOptions {
    configType: CONFIG_TYPE;
    data: Dashboard | DashboardWidget;
    widgets: DashboardWidget[];
}

@Directive({
    standalone: true,
    selector: '[xmCopy]',
})
export class CopyDirective {
    @Input('xmCopy') public options: CopyPasteBtnOptions;
    @Output() public eventValue: EventEmitter<Dashboard | DashboardWidget> = new EventEmitter();
    @Output() public eventDashboardWidgets: EventEmitter<DashboardWidget[]> = new EventEmitter();

    private copyPasteService: CopyPasteService = inject(CopyPasteService);

    @HostListener('click', ['$event.target'])
    public onClick(): void {
        this.onCopyToClipboard();
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

        this.copyPasteService.getClipboardDialog({
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
}
