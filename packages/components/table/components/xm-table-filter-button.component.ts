import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { Component, ElementRef, Input, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
    XmFilterButtonDialog,
    XmOverlayResponse,
    XmTableFilterButtonDialogComponent,
} from './xm-table-filter-button-dialog.component';
import { XmOverlayService } from '@xm-ngx/components/overlay';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { filter, map } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { XmTableFilterController } from '../controllers/filters/xm-table-filter-controller.service';
import { ButtonSpinnerModule } from '@xm-ngx/components/button-spinner';
import {
    XmTableFiltersControlRequestConfig,
} from './xm-table-filter-button-dialog-controls.component';
import { FiltersControlValue } from './xm-table-filter-button-dialog-control.component';
import { XmEmptyPipe } from '@xm-ngx/pipes';
import { NgIf } from '@angular/common';

@Component({
    selector: 'xm-table-filter-button',
    standalone: true,
    template: `
        <button *ngIf="!(config?.filters | xmEmpty)" mat-icon-button
                [loading]="loading"
                [disabled]="loading"
                (click)="openFilter()">
            <mat-icon>filter_list</mat-icon>
        </button>
    `,
    imports: [
        NgIf,
        XmEmptyPipe,
        MatIconModule,
        MatButtonModule,
        ButtonSpinnerModule,
    ],
})
export class XmTableFilterButtonComponent implements OnDestroy {
    @Input() public config: XmTableFiltersControlRequestConfig;
    @Input() public loading: boolean;

    constructor(private overlay: Overlay,
                private elementRef: ElementRef,
                private overlayService: XmOverlayService,
                private tableFilterController: XmTableFilterController<FiltersControlValue>) {
    }

    public openFilter(): void {
        const strategy = this.overlay
            .position()
            .flexibleConnectedTo(this.elementRef)
            .withFlexibleDimensions(true)
            .withGrowAfterOpen(true)
            .withPositions([
                {
                    offsetY: 0,
                    originX: 'start',
                    originY: 'top',
                    overlayX: 'start',
                    overlayY: 'top',
                },
            ])
            .withLockedPosition(true)
        ;

        const overlayConfig = new OverlayConfig({
            scrollStrategy: this.overlay.scrollStrategies.reposition(),
            disposeOnNavigation: true,
            hasBackdrop: true,
            positionStrategy: strategy,
            width: '50%',
            minWidth: 480,
            panelClass: 'xm-table-filter-overlay',
        });

        this.overlayService.setOverlayConfig(overlayConfig);
        const overlayRef = this.overlayService.open<XmOverlayResponse, XmFilterButtonDialog>(
            XmTableFilterButtonDialogComponent,
            {
                config: this.config,
                value: this.tableFilterController.get(),
            });

        overlayRef.afterClosed$.pipe(
            filter(i => i.data.state != 'cancel'),
            map(res => res.data),
            takeUntilOnDestroy(this),
        ).subscribe(res => {
            if (res.state === 'reset') {
                this.tableFilterController.clearExceptFixedFilters(this.config.filters);
            } else {
                this.tableFilterController.set(res.result);
            }
        });
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }
}
