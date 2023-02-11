import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { FormGroupLayoutItem, FormLayoutModule } from '@xm-ngx/components/form-layout';
import { CustomOverlayRef } from '@xm-ngx/components/overlay/custom-overlay-ref';

import { get } from 'lodash';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {
    XmTableFiltersControlRequestComponent
} from '@xm-ngx/components/table/table/components/xm-table-filters-control-request.component';
@Component({
    selector: 'xm-filter-dialog',
    standalone: true,
    template: `
        <div class="shadow p-1 bg-surface rounded">
            <mat-dialog-content>
                <xm-filters-control-request [options]="config"
                                            class="xm-filters-control">
                </xm-filters-control-request>
            </mat-dialog-content>
            <mat-dialog-actions class="actionButtons">
                <div>
                    <button mat-button
                            (click)="close()">
                        RESET
                    </button>
                    <button mat-button
                            cdkFocusInitial
                            [disabled]="group?.invalid"
                            (click)="submit()">
                        SEARCH
                    </button>
                </div>
            </mat-dialog-actions>
        </div>

    `,
    styles: [`
        .actionButtons {
            justify-content: space-between;
        }
    `],
    imports: [
        MatDialogModule,
        FormLayoutModule,
        MatButtonModule,
        XmTableFiltersControlRequestComponent,
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
