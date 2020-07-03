import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class MaintenanceService {
    private maintenance: BehaviorSubject<boolean>;

    constructor() {
        this.maintenance = new BehaviorSubject<boolean>(false);
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
