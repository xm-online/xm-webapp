import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { FormGroupLayoutItem, FormLayoutModule } from '@xm-ngx/components/form-layout';
import { CustomOverlayRef } from '../overlay/custom-overlay-ref';
import { XmTableFilterService } from '../../../controllers/filters/xm-table-filter.service';
import { get } from 'lodash';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { EntitiesFilterWidgetModule } from '@xm-ngx/ext/entity-webapp-ext/module/entities-filter-widget';

@Component({
    selector: 'xm-filter-dialog',
    standalone: true,
    templateUrl: './filter-dialog.component.html',
    styleUrls: ['./filter-dialog.component.scss'],
    imports: [
        MatDialogModule,
        FormLayoutModule,
        MatButtonModule,
        EntitiesFilterWidgetModule,
    ],
})
export class FilterDialogComponent implements OnInit {
    public config: any;
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
