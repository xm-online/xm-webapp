import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { Component, Input, OnDestroy } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { FormGroupLayoutItem } from '@xm-ngx/components/form-layout';
import { XmOverlayResponse, XmTableFilterButtonDialogComponent } from './xm-table-filter-button-dialog.component';
import { XmOverlayService } from '../../../overlay/xm-overlay.service';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { filter, map } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { XmTableFilterController } from '../controllers/filters/xm-table-filter-controller.service';
import { ButtonSpinnerModule } from '@xm-ngx/components/button-spinner';

@Component({
    selector: 'xm-table-filter-button',
    standalone: true,
    template: `
        <button mat-icon-button
                #origin
                [loading]="loading"
                [disabled]="loading"
                (click)="openFilter(origin)">
            <mat-icon>filter_list</mat-icon>
        </button>
    `,
    imports: [
        MatButtonModule,
        MatIconModule,
        ButtonSpinnerModule,
    ],
})
export class XmTableFilterButtonComponent implements OnDestroy {
    @Input() public config: FormGroupLayoutItem[];
    @Input() public loading: boolean;

    constructor(private overlay: Overlay,
                private overlayService: XmOverlayService,
                private requestBuilder: XmTableFilterController) {

    }

    public openFilter(origin: MatButton): void {
        const overlayConfig = this.createOverlayConfig(origin);
        this.overlayService.setOverlayConfig(overlayConfig);
        const overlayRef = this.overlayService.open<XmOverlayResponse>(
            XmTableFilterButtonDialogComponent,
            {
                config: this.config,
                value: this.requestBuilder.getCurrentRequest(),
            });

        overlayRef.afterClosed$.pipe(
            filter(i => i.data.state != 'cancel'),
            map(res => res.data),
            takeUntilOnDestroy(this),
        ).subscribe(res => this.requestBuilder.update(res.result));
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    private createOverlayConfig(attachTo: MatButton): OverlayConfig {

        const strategy = this.overlay.position()
            .flexibleConnectedTo(attachTo._elementRef)
            .withFlexibleDimensions(true)
            .withGrowAfterOpen(true)
            .withPositions([
                {
                    originX: 'end',
                    originY: 'bottom',
                    overlayX: 'start',
                    overlayY: 'top',
                },

            ])
            .withLockedPosition(true);

        return new OverlayConfig({
            scrollStrategy: this.overlay.scrollStrategies.reposition(),
            disposeOnNavigation: true,
            hasBackdrop: true,
            positionStrategy: strategy,
        });
    }
}
