import { Injectable, OnDestroy } from '@angular/core';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { XmUiConfigService } from './src/xm-ui-config.service';
import { XmUIConfig } from './src/xm-ui-config-model';

@Injectable()
export class XmApplicationConfigService<T extends XmUIConfig = XmUIConfig> implements OnDestroy {

    public resolved$: BehaviorSubject<boolean>;
    private appConfig: T;

    constructor(
        private configService: XmUiConfigService<T>,
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
