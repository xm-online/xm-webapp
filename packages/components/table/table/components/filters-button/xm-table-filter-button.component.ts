import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { Component, Input, OnDestroy } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { FormGroupLayoutItem } from '@xm-ngx/components/form-layout';
import { XmTableFilterDialogComponent } from './filter-dialog/xm-table-filter-dialog.component';
import { XmOverlayService } from '../../../../overlay/xm-overlay.service';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { filter, map } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import {
    XmTableFilterController
} from '../../controllers/filters/xm-table-filter-controller.service';

@Component({
    selector: 'xm-table-filter-button',
    standalone: true,
    templateUrl: './xm-table-filter-button.component.html',
    styleUrls: ['xm-table-filter-button.component.scss'],
    imports: [
        MatButtonModule,
        MatIconModule,
    ],
})
export class XmTableFilterButtonComponent implements OnDestroy {
    @Input() public config: FormGroupLayoutItem[];

    constructor(private overlay: Overlay,
                private overlayService: XmOverlayService,
                private requestBuilder: XmTableFilterController) {

    }

    public openFilter(origin: MatButton): void {
        const overlayConfig = this.createOverlayConfig(origin);
        this.overlayService.setOverlayConfig(overlayConfig);
        const overlayRef = this.overlayService.open(
            XmTableFilterDialogComponent,
            {
                config: this.config,
                value: this.requestBuilder.getCurrentRequest(),
            });

        overlayRef.afterClosed$.pipe(
            filter(Boolean),
            map(value => value.data),
            takeUntilOnDestroy(this),
        ).subscribe(
            value => {
                this.requestBuilder.update(value);
            },
        );
    }

    private createOverlayConfig(attachTo: MatButton): OverlayConfig {

        const strategy = this.overlay.position()
            .flexibleConnectedTo(attachTo._getHostElement())
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

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }
}
