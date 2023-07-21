import { Component } from '@angular/core';
import { FormLayoutModule } from '@xm-ngx/components/form-layout';
import { CustomOverlayRef } from '@xm-ngx/components/overlay';

import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {
    XmTableFiltersControlRequestConfig,
    XmTableFiltersControlRequestComponent,
} from '../components/xm-table-filters-control-request.component';
import { ModalCloseModule } from '@xm-ngx/components/modal-close';
import { XmTranslationModule } from '@xm-ngx/translation';
import { MatIconModule } from '@angular/material/icon';
import { FiltersControlValue } from '../components/xm-table-filters-control.component';

export interface XmOverlayResponse {
    state: 'cancel' | 'submit' | 'reset';
    result: FiltersControlValue;
}


export interface XmFilterButtonDialog {
    config: XmTableFiltersControlRequestConfig,
    value: FiltersControlValue
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
                                            #formContainer
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
                        [disabled]="formContainer.disabled"
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

        ::ng-deep .xm-table-filter-overlay {
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
export class XmTableFilterButtonDialogComponent {
    public config: XmTableFiltersControlRequestConfig;
    public group: FiltersControlValue;

    constructor(
        private customOverlay: CustomOverlayRef<XmOverlayResponse, XmFilterButtonDialog>,
    ) {
        this.config = this.customOverlay.context.config;
        this.group = this.customOverlay.context.value;
    }

    public submit(): void {
        this.customOverlay.close({result: this.group, state: 'submit'});
    }

    public reset(): void {
        this.customOverlay.close({result: {}, state: 'reset'});
    }

    public close(): void {
        this.customOverlay.close({result: this.group, state: 'cancel'});
    }
}
