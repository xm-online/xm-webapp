import { Component, OnInit } from '@angular/core';
import { FormGroupLayoutItem, FormLayoutModule } from '@xm-ngx/components/form-layout';
import { CustomOverlayRef } from '@xm-ngx/components/overlay/custom-overlay-ref';

import { get } from 'lodash';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {
    XmTableFiltersControlRequestComponent
} from '@xm-ngx/components/table/table/components/xm-table-filters-control-request.component';
import { ModalCloseModule } from '@xm-ngx/components/modal-close';
@Component({
    selector: 'xm-filter-dialog',
    standalone: true,
    template: `
        <div class="shadow p-3 bg-surface rounded">
            <mat-dialog-content>
                <xm-filters-control-request [options]="config"
                                            [request]="group"
                                            (requestChange)="group = $event"
                                            class="xm-filters-control">
                </xm-filters-control-request>
            </mat-dialog-content>
            <mat-dialog-actions [align]="'end'">
                <button mat-button
                        (click)="close()">
                    RESET
                </button>
                <button mat-button
                        cdkFocusInitial
                        color="primary"
                        [disabled]="group?.invalid"
                        (click)="submit()">
                    SEARCH
                </button>
            </mat-dialog-actions>
        </div>
    `,
    imports: [
        MatDialogModule,
        FormLayoutModule,
        MatButtonModule,
        XmTableFiltersControlRequestComponent,
        ModalCloseModule,
    ],
})
export class XmTableFilterButtonDialogComponent implements OnInit {
    public config: any;
    public group: any;

    constructor(
        private customOverlay: CustomOverlayRef<unknown, {config: FormGroupLayoutItem[], value: unknown}>,
    ) {
    }

    public ngOnInit(): void {
        this.config = get(this.customOverlay, 'context.config');
        this.group = this.customOverlay.context.value;
        // this.initForm();
    }

    public submit(): void {
        this.customOverlay.close(this.group);
    }

    public close(): void {
        // this.group.reset({ emitEvent: false });
        this.customOverlay.close(this.group);
    }


}
