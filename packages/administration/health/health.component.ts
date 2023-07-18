import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { JhiHealthModalComponent } from './health-modal.component';

import { JhiHealth, JhiHealthService } from './health.service';

@Component({
    selector: 'xm-health',
    templateUrl: './health.component.html',
    styleUrls: ['./health.component.scss'],
})
export class JhiHealthCheckComponent implements OnInit {

    public healthData: any;
    public displayedColumns: string[] = ['service', 'status', 'details'];
    public showLoader: boolean;
    public allHealthChecks: any[];
    public services: any[];
    public instances: any[];
    public selectedService: string = '';
    public selectedInstance: string = '';
    public selectedInstanceStatus: string;

    constructor(
        private modalService: MatDialog,
        private healthService: JhiHealthService,
    ) {
    }

    public ngOnInit(): void {
        this.initHealthCheck();
    }

    public initHealthCheck(): void {
        this.healthService
            .getMonitoringServicesCollection()
            .subscribe((result) => {
                this.services = result || [];
                if (this.services.length > 0) {
                    this.selectedService = this.services[0].name;
                    this.onServiceSelect();
                }
            }, (error) => console.info(error));
    }

    public onServiceSelect(): void {
        this.instances = null;
        this.services
            .filter((s) => s.name === this.selectedService)
            .forEach((i) => this.instances = i.instances || null);
        this.getHealthCheck(this.selectedService);
    }

    public getHealthCheck(selectedService: string): void {
        this.showLoader = true;
        this.healthData = [];
        this.selectedInstanceStatus = null;
        this.healthService
            .getHealsCheckByMsName(selectedService, 'health')
            .subscribe((result) => {
                this.allHealthChecks = result || [];
                this.mapHealthCheck(this.allHealthChecks[0].instanceId);
                this.showLoader = false;
            }, (error) => {
                console.info(error);
                if (error.status === 503) {
                    this.healthData = this.healthService.transformHealthData(error.json());
                }
                this.showLoader = false;
            });
    }

    public mapHealthCheck(metricId: any): void {
        this.selectedInstance = metricId || '';
        const currentMetrics = this.allHealthChecks.filter((h) => h.instanceId === metricId).shift();
        this.healthData = currentMetrics && currentMetrics.health
            ? this.healthService.transformHealthData(currentMetrics.health)
            : [];
        this.selectedInstanceStatus
            = currentMetrics
            && currentMetrics.health
            && currentMetrics.health.status
                ? currentMetrics.health.status : null;
    }

    public baseName(name: string): string {
        return this.healthService.getBaseName(name);
    }

    public getBadgeClass(statusState: string): string {
        if (statusState === 'UP') {
            return 'badge-success';
        } 
        return 'badge-danger';
        
    }

    public showHealth(health: JhiHealth): void {
        const modalRef = this.modalService.open(JhiHealthModalComponent, { width: '500px' });
        modalRef.componentInstance.currentHealth = health;
    }

    public subSystemName(name: string): string {
        return this.healthService.getSubSystemName(name);
    }

}
