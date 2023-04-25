import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { Component, ElementRef, Input, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { XmOverlayResponse, XmTableFilterButtonDialogComponent } from './xm-table-filter-button-dialog.component';
import { XmOverlayService } from '../../overlay/xm-overlay.service';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { filter, map } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { XmTableFilterController } from '../controllers/filters/xm-table-filter-controller.service';
import { ButtonSpinnerModule } from '@xm-ngx/components/button-spinner';
import {
    FiltersControlRequestOptions,
} from '@xm-ngx/components/table/components/xm-table-filters-control-request.component';

@Component({
    selector: 'xm-table-filter-button',
    standalone: true,
    template: `
        <button mat-icon-button
                [loading]="loading"
                [disabled]="loading"
                (click)="openFilter()">
            <mat-icon>filter_list</mat-icon>
        </button>
    `,
    imports: [
        MatIconModule,
        MatButtonModule,
        ButtonSpinnerModule,
    ],
})
export class XmTableFilterButtonComponent implements OnDestroy {
    @Input() public config: FiltersControlRequestOptions;
    @Input() public loading: boolean;

    constructor(private overlay: Overlay,
                private elementRef: ElementRef,
                private overlayService: XmOverlayService,
                private tableFilterController: XmTableFilterController) {
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
        const overlayRef = this.overlayService.open<XmOverlayResponse>(
            XmTableFilterButtonDialogComponent,
            {
                config: this.config,
                value: this.tableFilterController.get(),
            });

        overlayRef.afterClosed$.pipe(
            filter(i => i.data.state != 'cancel'),
            map(res => res.data),
            takeUntilOnDestroy(this),
        ).subscribe(res => this.tableFilterController.update(res.result));
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }
}
