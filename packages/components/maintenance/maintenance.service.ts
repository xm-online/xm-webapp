import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { XmThemeLoader } from '@xm-ngx/core/theme';
import { XmApplicationConfigService } from '@xm-ngx/core/config';

export type MaintenanceMode = 'SERVICE-NOT-FOUND' | 'SERVICE-SUSPENDED';
export const SERVICE_NOT_FOUND = 'SERVICE-NOT-FOUND';
export const SERVICE_SUSPENDED = 'SERVICE-SUSPENDED';

@Injectable({
    providedIn: 'root',
})
export class MaintenanceService {
    private maintenance: BehaviorSubject<boolean>;
    private maintenanceMode: BehaviorSubject<MaintenanceMode>;

    constructor(
        private themeLoader: XmThemeLoader,
        private applicationConfigService: XmApplicationConfigService,
    ) {
        this.maintenance = new BehaviorSubject<boolean>(false);
        this.maintenanceMode = new BehaviorSubject<MaintenanceMode>(null);
    }

    public init(): void {
        this.themeLoader.loaded$.subscribe({
            next: (it) => this.applicationConfigService.setResolved(it),
            error: (err) => {
                if (err?.status === 400 && err?.error?.error === SERVICE_NOT_FOUND) {
                    this.setMaintenanceMode(SERVICE_NOT_FOUND);
                }
                if (err?.status === 400 && err?.error?.error === SERVICE_SUSPENDED) {
                    this.setMaintenanceMode(SERVICE_SUSPENDED);
                }
                this.setMaintenanceProgress(true);
                return throwError(err);
            }
        });
    }

    public maintenance$(): Observable<boolean> {
        return this.maintenance.asObservable();
    }

    public maintenanceMode$(): Observable<MaintenanceMode> {
        return this.maintenanceMode.asObservable();
    }

    public setMaintenanceMode(newValue: MaintenanceMode): void {
        this.maintenanceMode.next(newValue);
    }

    public isMaintenanceProgress(): Observable<boolean> {
        return this.maintenance.asObservable();
    }

    public setMaintenanceProgress(newValue: boolean): void {
        this.maintenance.next(newValue);
    }
}
