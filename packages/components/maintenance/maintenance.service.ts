import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { XmThemeLoader } from '@xm-ngx/core/theme';
import { XmApplicationConfigService } from '@xm-ngx/core/config';

@Injectable({
    providedIn: 'root',
})
export class MaintenanceService {
    private maintenance: BehaviorSubject<boolean>;

    constructor(
        private themeLoader: XmThemeLoader,
        private applicationConfigService: XmApplicationConfigService,
    ) {
        this.maintenance = new BehaviorSubject<boolean>(false);
    }

    public init(): void {
        this.themeLoader.loaded$.pipe(
            tap(() => this.applicationConfigService.setResolved(true)),
            catchError((err) => {
                this.setMaintenanceProgress(true);
                return throwError(err);
            }),
        ).subscribe();
    }

    public maintenance$(): Observable<boolean> {
        return this.maintenance.asObservable();
    }

    public isMaintenanceProgress(): Observable<boolean> {
        return this.maintenance.asObservable();
    }

    public setMaintenanceProgress(newValue: boolean): void {
        this.maintenance.next(newValue);
    }
}
