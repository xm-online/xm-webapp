import { Component, OnInit } from '@angular/core';
import { FormGroupLayoutItem, FormLayoutModule } from '@xm-ngx/components/form-layout';
import { CustomOverlayRef } from '@xm-ngx/components/overlay/custom-overlay-ref';

import { get } from 'lodash';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {
    XmTableFiltersControlRequestComponent,
} from '@xm-ngx/components/table/table/components/xm-table-filters-control-request.component';
import { ModalCloseModule } from '@xm-ngx/components/modal-close';
import { XmTranslationModule } from '@xm-ngx/translation';
import { MatIconModule } from '@angular/material/icon';


export interface XmOverlayResponse {
    state: 'cancel' | 'submit' | 'reset';
    result: object;
}

@Component({
    selector: 'xm-filter-dialog',
    standalone: true,
    template: `
        <div class="shadow p-3 bg-surface rounded">
            <div class="d-flex justify-content-end">
                <button (click)="close()"
                        class="mat-dialog-close"
                        type="button"
                        tabindex="-1"
                        mat-icon-button>
                    <mat-icon>close</mat-icon>
                </button>
            </div>

            <mat-dialog-content>
                <xm-filters-control-request [options]="config"
                                            [request]="group"
                                            (requestChange)="group = $event"
                                            class="xm-filters-control">
                </xm-filters-control-request>
            </mat-dialog-content>

            <mat-dialog-actions align="end" class="d-flex justify-content-end pb-3">
                <button mat-button
                        (click)="close()">
                    {{'global.reset' | translate}}
                </button>

                <button mat-button
                        cdkFocusInitial
                        color="primary"
                        [disabled]="group?.invalid"
                        (click)="submit()">
                    {{'navbar.search' | translate}}
                </button>
            </mat-dialog-actions>
        </div>
    `,
    styles: [`
        ::ng-deep .xm-form-layout {
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 1rem;
        }
    `],
    imports: [
        MatDialogModule,
        FormLayoutModule,
        MatButtonModule,
        XmTableFiltersControlRequestComponent,
        ModalCloseModule,
        XmTranslationModule,
        MatIconModule,
    ],
})
export class XmTableFilterButtonDialogComponent implements OnInit {
    public config: any;
    public group: any;

    constructor(
        private customOverlay: CustomOverlayRef<XmOverlayResponse, { config: FormGroupLayoutItem[], value: unknown }>,
    ) {
    }

    public ngOnInit(): void {
        this.config = get(this.customOverlay, 'context.config');
        this.group = this.customOverlay.context.value;
    }

    public submit(): void {
        this.customOverlay.close({ result: this.group, state: 'submit' });
    }

    public reset(): void {
        this.customOverlay.close({ result: this.group, state: 'reset' });
    }

    public close(): void {
        this.customOverlay.close({ result: this.group, state: 'cancel' });
    }
}
