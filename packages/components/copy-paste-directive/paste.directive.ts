import {
    Directive,
    EventEmitter, HostListener, inject,
    Input,
    Output,
} from '@angular/core';
import * as _ from 'lodash';
import { Dashboard, DashboardWidget } from '@xm-ngx/core/dashboard';
import { CONFIG_TYPE, CopiedObject } from '@xm-ngx/administration/dashboards-config';
import {
    ClipboardOperations,
    DashboardCopyClipboardDialog
} from './dashboard-copy-clipboard-dialog/dashboard-copy-clipboard-dialog.model';
import { take } from 'rxjs/operators';
import { readFromClipboard } from '@xm-ngx/operators';
import { CopyPasteService } from '@xm-ngx/components/copy-paste-directive/copy-paste.service';

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
export class PasteDirective {
    @Input('xmPaste') public options: CopyPasteBtnOptions;
    @Output() public eventValue: EventEmitter<Dashboard | DashboardWidget> = new EventEmitter();
    @Output() public eventDashboardWidgets: EventEmitter<DashboardWidget[]> = new EventEmitter();

    private copyPasteService: CopyPasteService = inject(CopyPasteService);

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
            .subscribe((res: DashboardCopyClipboardDialog) => {
                const value = _.merge(this.options.data, this.getCopiedObjectConfig(res.value));
                this.eventValue.emit(value);
                if (this.options.configType === CONFIG_TYPE.DASHBOARD) {
                    this.eventDashboardWidgets.emit(value.widgets);
                }
            });
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
            copiedObject.config.widgets = PasteDirective.getUnbindedWidgets(copiedObject.config.widgets);
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
