import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { FormGroupLayoutItem } from '@xm-ngx/components/form-layout';
import { CustomOverlayRef } from '@xm-ngx/components/table/xm-table/components/table-header/table-filter/overlay/custom-overlay-ref';
import { XmTableFilterService } from '@xm-ngx/components/table/xm-table/service/xm-table-filter.service';
import { get } from 'lodash';

@Component({
    selector: 'xm-filter-dialog',
    templateUrl: './filter-dialog.component.html',
    styleUrls: ['./filter-dialog.component.scss'],
})
export class FilterDialogComponent implements OnInit {
    public config: FormGroupLayoutItem[];
    public group: UntypedFormGroup;

    constructor(private customOverlay: CustomOverlayRef<unknown, {config: FormGroupLayoutItem[], value: unknown}>,
                private filterFormGroupService: XmTableFilterService<unknown>,
    ) {

    }

    public ngOnInit(): void {
        this.config = get(this.customOverlay, 'context.config');
        this.initForm();
    }

    public submit(): void {
        this.customOverlay.close(this.group.getRawValue());
    }

    public close(): void {
        this.group.reset({ emitEvent: false });
        this.customOverlay.close(this.group.getRawValue());
    }

    private initForm(): void {
        if (this.config) {
            const value = get(this.customOverlay, 'context.value');
            const modifiedConfig = this.addValueToFormGroupConfig(this.config, value);
            this.group = this.filterFormGroupService.createFormGroup(modifiedConfig);
        }
    }

    private addValueToFormGroupConfig(config: FormGroupLayoutItem[], value: {[key: string]: unknown}): FormGroupLayoutItem[] {
        return this.config.map(control => {
            control.value = value[control.name] || null;
            return control;
        });
    }
}
