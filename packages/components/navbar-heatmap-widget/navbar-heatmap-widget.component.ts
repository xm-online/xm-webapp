import {Component, NgModule, NgZone, Type} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {NavigationEnd, Router} from '@angular/router';
import {takeUntilOnDestroy, takeUntilOnDestroyDestroy} from '@xm-ngx/operators';
import {HeatmapService} from './heatmap.service';
import {CommonModule} from '@angular/common';
import {Principal} from '@xm-ngx/core/user';

@Component({
    selector: 'xm-navbar-heatmap-widget',
    template: `
        <button mat-icon-button
                class="heatmap-icon"
                *ngIf="isSuperAdmin()"
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
        private principal: Principal,
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

    public isSuperAdmin(): boolean {
        return this.principal.isSuperAdmin();
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
    imports: [MatIconModule, MatButtonModule, CommonModule],
})
export class NavbarHeatmapWidgetModule {
    public entry: Type<NavbarHeatmapWidgetComponent> = NavbarHeatmapWidgetComponent;
}
