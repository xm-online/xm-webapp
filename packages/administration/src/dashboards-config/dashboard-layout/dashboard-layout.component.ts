import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageService } from "@xm-ngx/dashboard";
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from "@xm-ngx/shared/operators";
import { CommonModule } from "@angular/common";
import {
    DashboardDndComponent
} from "@xm-ngx/administration/dashboards-config/dashboard-layout/dashboard-dnd/dashboard-dnd.component";

@Component({
    selector: 'xm-dashboard-layout',
    template: `
        <div *ngIf="page">
            <xm-dashboard-dnd [layout]="page.layout.layout"></xm-dashboard-dnd>
        </div>
    `,
    standalone: true,
    imports: [CommonModule, DashboardDndComponent]
})
export class DashboardLayoutComponent implements OnInit, OnDestroy {
    public page: any;

    constructor(
        private pageService: PageService,
    ) {
    }

    public ngOnInit() {

        this.pageService.active$()
            .pipe(takeUntilOnDestroy(this))
            .subscribe((page) => {
                console.log(page);
                this.page = page;
            });


    }

    public ngOnDestroy() {
        takeUntilOnDestroyDestroy(this)
    }
}
