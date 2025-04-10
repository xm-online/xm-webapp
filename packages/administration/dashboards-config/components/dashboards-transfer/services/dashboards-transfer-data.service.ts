import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';


@Injectable()
export class DashboardsTransferDataService {
    private resetStepper$$ = new Subject<void>();
    public resetStepper$ = this.resetStepper$$.asObservable();

    private readonly loading$$ = new BehaviorSubject<boolean>(false);
    public readonly loading$ = this.loading$$.asObservable();

    public set loading(value: boolean) {
        this.loading$$.next(value);
    }

    public resetStepper(): void {
        this.resetStepper$$.next();
    }
}
