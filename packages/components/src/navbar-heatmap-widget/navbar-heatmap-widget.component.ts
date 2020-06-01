import { Component, NgModule, NgZone, Type } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NavigationEnd, Router } from '@angular/router';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { HeatmapService } from './heatmap.service';

@Component({
    selector: 'xm-navbar-dashboard-edit-widget',
    template: `
        <button mat-icon-button
                class="heatmap-icon"
                [color]="active ? 'primary' : null"
                (click)="toggleHeatmap()">
            <mat-icon>whatshot</mat-icon>
        </button>
    `,
    providers: [HeatmapService],
})
export class NavbarHeatmapWidgetComponent {

    public active: boolean;
    constructor(
        private zone: NgZone,
        private heatmapService: HeatmapService,
        private router: Router,
    ) {
    }

    public ngOnInit(): void {
        const heatmapContainerElement = document.querySelector('#heatmapContainer');
        this.zone.runOutsideAngular(() => {
            heatmapContainerElement.addEventListener('mousemove', (e) => this.heatmapMouseMove(e));
        });

        this.heatmapService.$visibility().subscribe((state) => {
            this.active = state;
            if (state) {
                heatmapContainerElement.classList.remove('hidden-heatmap');
            } else {
                heatmapContainerElement.classList.add('hidden-heatmap');
            }
        });
        this.router.events.pipe(takeUntilOnDestroy(this)).subscribe(val => {
            if (val instanceof NavigationEnd) {
                this.heatmapService.initialize(heatmapContainerElement, val.url);
            }
        });
    }

    public heatmapMouseMove(event: any): void {
        this.heatmapService.add({
            x: event.x,
            y: event.y,
            value: 1,
        });
    }

    public toggleHeatmap(): void {
        this.heatmapService.toggleVisibility();
    }

    public ngOnDestroy(): void {
        this.heatmapService.ngOnDestroy();
        takeUntilOnDestroyDestroy(this);
    }

}

@NgModule({
    exports: [NavbarHeatmapWidgetComponent],
    declarations: [NavbarHeatmapWidgetComponent],
    providers: [],
    imports: [MatIconModule, MatButtonModule],
})
export class NavbarHeatmapWidgetModule {
    public entry: Type<NavbarHeatmapWidgetComponent> = NavbarHeatmapWidgetComponent;
}
