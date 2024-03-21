import { Component, inject, Injector, OnInit } from '@angular/core';
import { MaintenanceService } from './maintenance.service';
import { Observable } from 'rxjs';
import { XmDynamicComponentRegistry } from '@xm-ngx/dynamic';
import { NotFoundException } from '@xm-ngx/exceptions';

@Component({
    selector: 'xm-maintenance-view',
    templateUrl: './maintenance.component.html',
    styleUrls: ['./maintenance.component.scss'],
})
export class MaintenanceComponent implements OnInit {
    public isMaintenanceProgress$: Observable<boolean>;
    public componentInjector = inject(Injector);
    private registry = inject(XmDynamicComponentRegistry);

    public componentInRegistry: boolean = false;

    constructor(
        private maintenanceService: MaintenanceService,
    ) {
        this.isMaintenanceProgress$ = this.maintenanceService.maintenance$();
    }

    public async ngOnInit(): Promise<void> {
        try {
            const component = await this.registry.find('xm-general/maintenance', this.componentInjector);
            this.componentInRegistry = !!component;
        } catch (e) {
            if (e instanceof NotFoundException) {
                this.componentInRegistry = false;
            } else {
                console.error(e);
            }
        }
    }
}
