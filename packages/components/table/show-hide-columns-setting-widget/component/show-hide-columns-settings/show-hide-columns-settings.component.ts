import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    takeUntilOnDestroy,
    takeUntilOnDestroyDestroy,
} from '@xm-ngx/shared/operators';

import { AbstractControl, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import {
    ColumnsSettingStorageItem,
    ColumnsSettingStorageService,
} from '../../../service/columns-settings-storage.service';

@Component({
    selector: 'xm-show-hide-columns-settings',
    templateUrl: './show-hide-columns-settings.component.html',
    styleUrls: [],
})
export class ShowHideColumnsSettingsComponent implements OnInit, OnDestroy {
    public form: UntypedFormGroup;
    public columns: ColumnsSettingStorageItem[] = [];
    public isSelectedAll: boolean;
    public TRS = {
        selectAll: {
            en: 'Select all checkboxes',
            ru: 'Выбрать все чекбоксы',
            uk: 'Обрати всі чекбокси',
        },
    };

    public get columnsControl(): AbstractControl {
        return this.form?.get('columns');
    }

    constructor(
        private columnsSettingStorageService: ColumnsSettingStorageService,
        private fb: UntypedFormBuilder,
    ) { }

    public ngOnInit(): void {
        this.form = this.fb.group({
            columns: [],
        });

        this.columnsSettingStorageService.getStore()
            .pipe(
                takeUntilOnDestroy(this),
            )
            .subscribe(res => {
                this.columns = res || [];
                this.isSelectedAll = this.columns.every(item => !item.hidden);
            });
    }

    public submit(): void {
        this.setUnCheckedColumns();
        this.columnsSettingStorageService.updateStore(this.columns);
    }

    public onClosedMenu(): void {
        this.submit();
    }

    public toggleSelectAll(): void {
        this.isSelectedAll = !this.isSelectedAll;

        this.setSelectedAllToOptions(this.isSelectedAll);
    }

    public setSelectedAll(): void {
        this.isSelectedAll = this.columnsControl?.value.filter(control => !!control).length === this.columns.length;

        if(this.isSelectedAll) {
            this.setSelectedAllToOptions(this.isSelectedAll);
        }
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    private setUnCheckedColumns(): void {
        this.columns.forEach(item => {
            item.hidden = !this.columnsControl?.value.some(control => control?.name === item?.name);
        });
    }

    private setSelectedAllToOptions(isSelectedAll: boolean): void {
        this.columns.forEach(item => {
            item.hidden = !isSelectedAll;
        });

        this.columnsControl.patchValue(this.columns, {emitEvent: false});
    }
}
