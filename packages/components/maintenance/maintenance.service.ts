import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
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
        this.themeLoader.loaded$.subscribe({
            next: (it) => this.applicationConfigService.setResolved(it),
            error: (err) => {
                this.setMaintenanceProgress(true)
                return throwError(err);
            }
        });
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
