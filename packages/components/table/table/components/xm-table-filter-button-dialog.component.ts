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
        <div class="shadow p-3 bg-surface rounded filter-dialog">
            <div class="d-flex justify-content-end">
                <button (click)="close()"
                        class="mat-dialog-close"
                        type="button"
                        tabindex="-1"
                        mat-icon-button>
                    <mat-icon>close</mat-icon>
                </button>
            </div>

            <mat-dialog-content class="mt-2 mb-2 d-block">
                <xm-filters-control-request [options]="config"
                                            [request]="group"
                                            (requestChange)="group = $event"
                                            class="xm-filters-control">
                </xm-filters-control-request>
            </mat-dialog-content>

            <mat-dialog-actions align="end" class="d-flex justify-content-end">
                <button mat-button
                        class="me-3"
                        (click)="reset()">
                    {{'table.filter.button.reset' | translate}}
                </button>

                <button mat-button
                        mat-raised-button
                        cdkFocusInitial
                        color="primary"
                        [disabled]="group?.invalid"
                        (click)="submit()">
                    {{'table.filter.button.search' | translate}}
                </button>
            </mat-dialog-actions>
        </div>
    `,
    styles: [`
        .filter-dialog button {
            text-transform: uppercase;
        }

        ::ng-deep .cdk-overlay-pane {
            display: block;
        }

        .filter-dialog {
            border-radius: 20px !important;
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
        this.customOverlay.close({result: this.group, state: 'submit'});
    }

    public reset(): void {
        Object.keys(this.group).forEach(key => {
            this.group[key] = null;
        });
        this.customOverlay.close({result: this.group, state: 'reset'});
    }

    public close(): void {
        this.customOverlay.close({result: this.group, state: 'cancel'});
    }
}
