import { Component, OnInit } from '@angular/core';

import { Log } from './log.model';
import { LogsService } from './logs.service';
import { JhiHealthService } from '../health/health.service';

@Component({
    selector: 'xm-logs',
    templateUrl: './logs.component.html',
})
export class LogsComponent implements OnInit {

    loggers: Log[];
    filter: string;
    orderProp: string;
    showLoader: boolean;
    reverse: boolean;
    selectedService = '';
    services: any[];

    constructor(
        private logsService: LogsService,
        private healthService: JhiHealthService
    ) {
        this.filter = '';
        this.orderProp = 'name';
        this.reverse = false;
    }

    ngOnInit() {
        this.healthService
            .getMonitoringServicesCollection()
            .subscribe(result => {
                this.services = result || [];
                if (this.services.length > 0) {
                    this.selectedService = this.services[1].name;
                    this.onServiceSelect();
                }
            }, error => console.log(error));
    }

    getLoggers() {
        this.logsService
            .findByService(this.selectedService)
            .subscribe((loggers) => {
                this.loggers = loggers.body || [];
                this.showLoader = false;
            }, error => {
                console.error(error);
                this.showLoader = false;
                this.loggers = null;
            });
    }

    onServiceSelect(): void {
        this.loggers = [];
        this.showLoader = true;
        this.getLoggers();
    }

    changeLevel(name: string, level: string): void {
        this.showLoader = true;
        const log = new Log(name, level);
        this.logsService
            .changeLevel(log, this.selectedService)
            .subscribe(() => this.getLoggers());
    }
}
