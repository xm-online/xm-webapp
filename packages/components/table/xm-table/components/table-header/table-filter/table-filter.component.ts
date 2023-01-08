import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { Component, Input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { FormGroupLayoutItem } from '@xm-ngx/components/form-layout';
import { FilterDialogComponent } from '@xm-ngx/components/table/xm-table/components/table-header/table-filter/filter-dialog/filter-dialog.component';
import { OverlayService } from '@xm-ngx/components/table/xm-table/components/table-header/table-filter/overlay/overlay.service';

@Component({
    selector: 'xm-table-filter',
    templateUrl: './table-filter.component.html',
    styleUrls: ['table-filter.component.scss'],
})
export class TableFilterComponent {
    @Input() public config: FormGroupLayoutItem[];

    constructor(private overlay: Overlay,
                private overlayService: OverlayService) {

    }

    public openFilter(origin: MatButton): void {
        const overlayConfig = this.createOverlayConfig(origin);
        this.overlayService.setOverlayConfig(overlayConfig);
        this.overlayService.open(FilterDialogComponent, { config: this.config });
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
}
