import { Injectable, OnDestroy } from '@angular/core';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { XmUiConfigService } from '@xm-ngx/core';

@Injectable()
export class XmApplicationConfigService<T = unknown> implements OnDestroy {

    public resolved$: BehaviorSubject<boolean>;
    private appConfig: T;

    constructor(
        private configService: XmUiConfigService,
    ) {
        this.resolved$ = new BehaviorSubject<boolean>(false);
        this.configService.config$()
            .pipe(filter((c => Boolean(c))), takeUntilOnDestroy(this))
            .subscribe(config => this.appConfig = config);
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    public isResolved(): Observable<boolean> {
        return this.resolved$.asObservable();
    }

    public setResolved(newValue: boolean): void {
        this.resolved$.next(newValue);
    }

    public getAppConfig(): T {
        return this.appConfig;
    }
}
