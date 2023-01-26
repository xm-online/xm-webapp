import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { Component, Input, OnDestroy } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { FormGroupLayoutItem } from '@xm-ngx/components/form-layout';
import { FilterDialogComponent } from './filter-dialog/filter-dialog.component';
import { XmOverlayService } from './overlay/xm-overlay.service';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { filter, map } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import {
    XmTableFilterController
} from '../../controllers/filters/xm-table-filter-controller.service';

@Component({
    selector: 'xm-table-filter',
    standalone: true,
    templateUrl: './table-filter.component.html',
    styleUrls: ['table-filter.component.scss'],
    imports: [
        MatButtonModule,
        MatIconModule,
    ],
})
export class XmTableFilterComponent implements OnDestroy {
    @Input() public config: FormGroupLayoutItem[];

    constructor(private overlay: Overlay,
                private overlayService: XmOverlayService,
                private requestBuilder: XmTableFilterController) {

    }

    public openFilter(origin: MatButton): void {
        const overlayConfig = this.createOverlayConfig(origin);
        this.overlayService.setOverlayConfig(overlayConfig);
        const overlayRef = this.overlayService.open(
            FilterDialogComponent,
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
        const positionStrategy = this.overlay
            .position()
            .flexibleConnectedTo(attachTo._getHostElement())
            .withPositions([
                {
                    originX: 'end',
                    originY: 'bottom',
                    overlayX: 'start',
                    overlayY: 'top',
                },
            ]);

        return new OverlayConfig({
            positionStrategy,
            scrollStrategy: this.overlay.scrollStrategies.noop(),
            hasBackdrop: true,
            disposeOnNavigation: true,
            panelClass: ['menu-panel'],
            backdropClass: 'cdk-overlay-transparent-backdrop',
        });
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }
}
