import { Directive, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { injectByKey, XM_DYNAMIC_COMPONENT_CONFIG } from '@xm-ngx/dynamic';
import { isObservable, Observable, of } from 'rxjs';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { FabButtonConfigInterface } from '../types/fab-button-config.interface';
import { ControllerBaseInterface } from '../types/button-controller-base.interface';


@Directive()
export class ButtonBase implements OnInit, OnDestroy {
    @Input() protected config = inject<FabButtonConfigInterface>(XM_DYNAMIC_COMPONENT_CONFIG);

    public loading$: Observable<boolean>;
    public disabled$: Observable<boolean>;

    private readonly controller: ControllerBaseInterface = injectByKey<ControllerBaseInterface>(this.config?.controller?.key, { optional: true });

    public ngOnInit(): void {
        this.loading$ = this.controller?.loading$ || of(false);
        this.disabled$ = this.controller?.disabled$ || of(false);
    }

    public executeControllerMethod(): void {
        const executedMethod = this.controller[this.config?.controller?.method]();
        if (isObservable(executedMethod)) {
            executedMethod.pipe(takeUntilOnDestroy(this)).subscribe();
        }
    }

    public ngOnDestroy(): void{
        takeUntilOnDestroyDestroy(this);
    }
}
