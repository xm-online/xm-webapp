import { Component } from '@angular/core';
import { MaintenanceService } from '@xm-ngx/components/maintenance/maintenance.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'xm-maintenance-view',
    templateUrl: './maintenance.component.html',
    styleUrls: ['./maintenance.component.scss'],
})
export class MaintenanceComponent {
    public isMaintenanceProgress$: Observable<boolean>;

    constructor(
        private maintenanceService: MaintenanceService,
    ) {
        this.isMaintenanceProgress$ = this.maintenanceService.maintenance$();
    }
}
