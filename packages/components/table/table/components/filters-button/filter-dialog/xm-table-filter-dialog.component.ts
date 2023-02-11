import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { FormGroupLayoutItem, FormLayoutModule } from '@xm-ngx/components/form-layout';
import { CustomOverlayRef } from '@xm-ngx/components/overlay/custom-overlay-ref';

import { get } from 'lodash';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {
    FiltersControlRequestComponent
} from '@xm-ngx/components/table/table/components/filters-control-request/filters-control-request.component';
@Component({
    selector: 'xm-filter-dialog',
    standalone: true,
    templateUrl: './xm-table-filter-dialog.component.html',
    styleUrls: ['./xm-table-filter-dialog.component.scss'],
    imports: [
        MatDialogModule,
        FormLayoutModule,
        MatButtonModule,
        FiltersControlRequestComponent,
    ],
})
export class XmTableFilterDialogComponent implements OnInit {
    public config: any;
    public group: UntypedFormGroup;

    constructor(private customOverlay: CustomOverlayRef<unknown, {config: FormGroupLayoutItem[], value: unknown}>,
    ) {
    }

    public ngOnInit(): void {
        this.config = get(this.customOverlay, 'context.config');
        // this.initForm();
    }

    public submit(): void {
        this.customOverlay.close(this.group.getRawValue());
    }

    public close(): void {
        // this.group.reset({ emitEvent: false });
        this.customOverlay.close(this.group.getRawValue());
    }


}
