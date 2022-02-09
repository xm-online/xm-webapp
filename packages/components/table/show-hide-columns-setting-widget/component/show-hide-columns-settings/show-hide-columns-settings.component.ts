import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    takeUntilOnDestroy,
    takeUntilOnDestroyDestroy,
} from '@xm-ngx/shared/operators';

import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
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
    public form: FormGroup;
    public columns: ColumnsSettingStorageItem[] = [];

    public get columnsControl(): AbstractControl {
        return this.form?.get('columns');
    }

    constructor(
        private columnsSettingStorageService: ColumnsSettingStorageService,
        private fb: FormBuilder,
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
                const checked = this.columns.filter(item => item.hidden);
                this.columnsControl.patchValue(checked, {emitEvent: false});
            });
    }

    public submit(): void {
        this.setCheckedColumns();
        this.columnsSettingStorageService.updateStore(this.columns);
    }

    public onClosedMenu(): void {
        this.submit();
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    private setCheckedColumns(): void {
        this.columns.forEach(item => {
            item.hidden = this.columnsControl?.value.some(control => control.name === item.name);
        });
    }
}
