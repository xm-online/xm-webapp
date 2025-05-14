import { BehaviorSubject, Observable } from 'rxjs';

export class ButtonControllerBase {
    private loading$$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private disabled$$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    protected loading$: Observable<boolean> = this.loading$$.asObservable();
    protected disabled$: Observable<boolean> = this.disabled$$.asObservable();

    protected setDisableState(value: boolean): void {
        this.disabled$$.next(value);
    }

    protected setLoadingState(value: boolean): void {
        this.loading$$.next(value);
    }
}
