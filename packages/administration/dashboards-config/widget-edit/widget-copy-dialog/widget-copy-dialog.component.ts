import { Component, Input } from '@angular/core';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import { Defaults } from '@xm-ngx/operators';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {
    OPERATIONS,
} from '../../dashboards-list/dashboards-list-copy-dialog/dashboards-list-copy-dialog.component';
import { MatButtonModule } from '@angular/material/button';

export interface DialogCopyConfig {
    title?: Translate;
    modalText?: Translate;
    copyButtonText?: Translate;
    replaceButtonText?: Translate;
    closeText?: Translate;
}

const DEFAULT_CONFIG = {
    title: {
        uk: 'Вже існує віджет з такою назвою',
        en: 'Widget with such name exists already',
    },
    modalText: {
        uk: 'Оберіть дію',
        en: 'Choose action',
    },
    copyButtonText: {
        uk: 'Зробити копію',
        en: 'Make a copy',
    },
    replaceButtonText: {
        uk: 'Замінити існуючий',
        en: 'Replace',
    },
    closeText: {
        uk: 'Відміна',
        en: 'Cancel',
    },
};
@Component({
    selector: 'xm-widget-copy-dialog',
    templateUrl: './widget-copy-dialog.component.html',
    styleUrls: ['./widget-copy-dialog.component.scss'],
    standalone: true,
    imports: [
        MatDialogModule,
        MatButtonModule,
        XmTranslationModule,
        XmTranslationModule,
        XmTranslationModule,
    ],
})
export class WidgetCopyDialogComponent {
    @Input() @Defaults(DEFAULT_CONFIG) public config: DialogCopyConfig = DEFAULT_CONFIG;
    constructor(private matDialogRef: MatDialogRef<DialogCopyConfig>) {
    }

    public onClose(): void {
        this.matDialogRef.close(null);
    }

    public onCopy(): void {
        this.matDialogRef.close(OPERATIONS.COPY);
    }

    public onReplace(): void {
        this.matDialogRef.close(OPERATIONS.REPLACE);
    }

}
