import { Component, OnDestroy, OnInit } from '@angular/core';
import { JhiAlertService } from 'ng-jhipster';
import { JhiAlert } from 'ng-jhipster';

@Component({
    selector: 'xm-alerts',
    templateUrl: './xm-alerts.component.html',
})
export class JhiAlertComponent implements OnInit, OnDestroy {
    public alerts: JhiAlert[];

    constructor(private alertService: JhiAlertService) {
    }

    public ngOnInit(): void {
        this.alerts = this.alertService.get();
    }

    public ngOnDestroy(): void {
        this.alerts = [];
    }
}
