import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { FormGroupLayoutFactoryService, FormGroupLayoutItem } from '@xm-ngx/components/form-layout';
import { CustomOverlayRef } from '@xm-ngx/components/table/xm-table/components/table-header/table-filter/overlay/custom-overlay-ref';
import { XmRequestBuilderService } from '@xm-ngx/components/table/xm-table/service/xm-request-builder-service/xm-request-builder.service';
import { get } from 'lodash';

@Component({
    selector: 'xm-filter-dialog',
    templateUrl: './filter-dialog.component.html',
    styleUrls: ['./filter-dialog.component.scss'],
})
export class FilterDialogComponent implements OnInit {
    public config: FormGroupLayoutItem[];
    public group: UntypedFormGroup;

    constructor(private layoutFactoryService: FormGroupLayoutFactoryService,
                private requestBuilder: XmRequestBuilderService,
                private customOverlay: CustomOverlayRef<unknown, {config: FormGroupLayoutItem[]}>,
    ) {
        this.requestBuilder.change$().subscribe(value => this.updateValue(value));

    }

    public ngOnInit(): void {
        this.config = get(this.customOverlay, 'context.config');
        this.initForm();
    }

    public submit(): void {
        this.requestBuilder.update(this.group.getRawValue());
        this.customOverlay.close(this.group.getRawValue());
    }

    public close(): void {
        this.group.reset({ emitEvent: false });
        this.requestBuilder.update(this.group.getRawValue());
        this.customOverlay.close(this.group.getRawValue());
    }

    private initForm(): void {
        if (this.config) {
            this.group = this.layoutFactoryService.createForm(this.config);
        }

    }

    private updateValue(value) {
        if (this.group) {
            this.group.patchValue(value || {}, { emitEvent: false });
        }
    }
}
