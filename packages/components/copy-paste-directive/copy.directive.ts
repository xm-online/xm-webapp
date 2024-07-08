import {
    Directive,
    HostListener, inject,
    Input,
} from '@angular/core';
import * as _ from 'lodash';
import { Dashboard, DashboardWidget } from '@xm-ngx/core/dashboard';
import {
    CONFIG_TYPE,
    CopiedObject,
    XM_WEBAPP_OPERATIONS
} from '@xm-ngx/administration/dashboards-config';
import {
    ClipboardOperations,
    CopyPasteDialogDialog
} from './copy-paste-dialog/copy-paste-dialog.model';
import { take } from 'rxjs/operators';
import { copyToClipboard } from '@xm-ngx/operators';
import { CopyPasteDialogService } from './copy-paste-dialog/copy-paste-dialog.service';

export interface CopyPasteBtnOptions {
    configType: CONFIG_TYPE;
    data: Dashboard | DashboardWidget;
    widgets: DashboardWidget[];
}

@Directive({
    standalone: true,
    selector: '[xmCopy]',
})
export class CopyDirective<T> {
    @Input('xmCopy') public options: CopyPasteBtnOptions;

    private copyPasteService: CopyPasteDialogService = inject(CopyPasteDialogService);

    @HostListener('click', ['$event.target'])
    public onClick(): void {
        this.onCopyToClipboard();
    }

    public onCopyToClipboard(): void {
        const data = _.cloneDeep(this.options.data || {});

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
            .subscribe(async (res: CopyPasteDialogDialog) => {
                await copyToClipboard(res?.value, {insecurePrompt: false});
            });
    }
}
