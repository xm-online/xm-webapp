import { Component, Input } from '@angular/core';
import { Defaults } from '@xm-ngx/operators';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';

export enum OPERATIONS {
    COPY = 'COPY',
    REPLACE = 'REPLACE'
}

export interface DialogCopyConfig {
    title?: Translate;
    modalText?: Translate;
    copyButtonText?: Translate;
    replaceButtonText?: Translate;
    closeText?: Translate;
}

const DEFAULT_CONFIG = {
    title: {
        uk: 'Вже існує панель з такими параметрами (name, slug або typeKey)',
        en: 'Dashboard with parameters exists already (name, slug or typeKey)',
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
        uk: 'Замінити існуючу',
        en: 'Replace',
    },
    closeText: {
        uk: 'Відміна',
        en: 'Cancel',
    },
};

@Component({
    selector: 'xm-dashboards-list-copy-dialog',
    templateUrl: './dashboards-list-copy-dialog.component.html',
    styleUrls: ['./dashboards-list-copy-dialog.component.scss'],
    standalone: true,
    imports: [
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        XmTranslationModule,
        XmTranslationModule,
    ],
})
export class DashboardsListCopyDialogComponent {
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
