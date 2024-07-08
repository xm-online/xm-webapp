import {
    Directive,
    EventEmitter, HostListener, inject,
    Input,
    Output,
} from '@angular/core';
import * as _ from 'lodash';
import { Dashboard, DashboardWidget } from '@xm-ngx/core/dashboard';
import { CONFIG_TYPE, CopiedObject } from '@xm-ngx/administration/dashboards-config';
import { take } from 'rxjs/operators';
import { readFromClipboard } from '@xm-ngx/operators';
import { CopyPasteDialogService } from './copy-paste-dialog/copy-paste-dialog.service';
import {
    ClipboardOperations,
    CopyPasteDialogDialog
} from './copy-paste-dialog/copy-paste-dialog.model';

export interface CopyPasteBtnOptions {
    configType: CONFIG_TYPE;
    eventType: ClipboardOperations;
    data: Dashboard | DashboardWidget;
    widgets: DashboardWidget[];
}

@Directive({
    standalone: true,
    selector: '[xmPaste]',
})
export class PasteDirective<T> {
    @Input('xmPaste') public options: CopyPasteBtnOptions;
    @Output() public eventValue: EventEmitter<T> = new EventEmitter();

    private copyPasteService: CopyPasteDialogService = inject(CopyPasteDialogService);

    @HostListener('click', ['$event.target'])
    public async onClick(): Promise<void> {
        await this.onPasteFromClipboard();
    }

    public async onPasteFromClipboard(): Promise<void> {
        const text = await readFromClipboard();

        this.copyPasteService.getClipboardDialog({
            value: text as string,
            operation: ClipboardOperations.PASTE
        })
            .pipe(
                take(1),
            )
            .subscribe((res: CopyPasteDialogDialog) => {
                const value = _.merge(this.options.data, this.getCopiedObjectConfig(res.value));
                this.eventValue.emit(value);
            });
    }

    private getCopiedObjectConfig(text: string): T {
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

        // if (this.options.configType === CONFIG_TYPE.DASHBOARD) {
        //     copiedObject.config.widgets = PasteDirective.getUnbindedWidgets(copiedObject.config.widgets);
        // }

        return copiedObject.config as T;
    }
}
