import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy, } from '@xm-ngx/operators';

import { AbstractControl, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import {
    ColumnsSettingStorageItem,
    XmTableColumnsSettingStorageService,
} from '../../controllers/config/xm-table-columns-setting-storage.service';
import { CommonModule } from '@angular/common';
import { XmTranslationModule } from '@xm-ngx/translation';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';

@Component({
    selector: 'xm-show-hide-columns-settings',
    templateUrl: './show-hide-columns-settings.component.html',
    styleUrls: [],
    imports: [
        CommonModule,
        XmTranslationModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatListModule,
    ],
    standalone: true,
})
export class ShowHideColumnsSettingsComponent implements OnInit, OnDestroy {
    public form: UntypedFormGroup;
    public allColumns: ColumnsSettingStorageItem[] = [];
    public optionalColumns: ColumnsSettingStorageItem[] = [];
    public isSelectedAll: boolean;
    public TRS = {
        selectAll: {
            en: 'Select all checkboxes',
            ru: 'Выбрать все чекбоксы',
            uk: 'Обрати всі чекбокси',
        },
    };

    constructor(
        private columnsSettingStorageService: XmTableColumnsSettingStorageService,
        private fb: UntypedFormBuilder,
    ) {
    }

    public get columnsControl(): AbstractControl {
        return this.form?.get('optionalColumns');
    }

    public ngOnInit(): void {
        this.getColumnsFromStorage();
    }

    public submit(): void {
        this.setUnCheckedColumns();
        this.columnsSettingStorageService.updateStore(this.allColumns);
    }

    public onClosedMenu(): void {
        this.submit();
    }

    public toggleSelectAll(): void {
        this.isSelectedAll = !this.isSelectedAll;

        this.setSelectedAllToOptions(this.isSelectedAll);
    }

    public setSelectedAll(): void {
        this.isSelectedAll = this.columnsControl?.value.filter(control => !!control).length === this.optionalColumns.length;

        if (this.isSelectedAll) {
            this.setSelectedAllToOptions(this.isSelectedAll);
        }
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    private getColumnsFromStorage(): void {
        this.form = this.fb.group({
            optionalColumns: [],
        });

        this.columnsSettingStorageService.getStore()
            .pipe(
                takeUntilOnDestroy(this),
            )
            .subscribe(res => {
                this.allColumns = res;
                this.optionalColumns = res.filter((column) => column?.optional);
                this.isSelectedAll = this.optionalColumns.every(item => !item.hidden);
            });
    }

    private setUnCheckedColumns(): void {
        this.optionalColumns.forEach(item => {
            item.hidden = !this.columnsControl?.value.some(control => control?.name === item?.name);
        });

        this.allColumns.map((column) => {
            this.optionalColumns.forEach((optionalColumn) => {
                if (column.name === optionalColumn.name) {
                    column.hidden = optionalColumn.hidden;
                }
            });
        });
    }

    private setSelectedAllToOptions(isSelectedAll: boolean): void {
        this.optionalColumns.forEach(item => {
            if(!item.isHideLock) {
                item.hidden = !isSelectedAll;
            }
        });

        this.columnsControl.patchValue(this.optionalColumns, { emitEvent: false });
    }
}
