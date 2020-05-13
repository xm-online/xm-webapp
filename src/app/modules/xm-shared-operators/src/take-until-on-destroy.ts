import { OnDestroy, Type } from '@angular/core';
import { MonoTypeOperatorFunction, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface TakeUntilOnDestroyInstance extends OnDestroy {
    __takeUntilOnDestroy$?: Subject<void>;
}

/**
 * Emit an event when Angular calls the ngOnDestroy method
 * @example
 *   @TakeUntilOnDestroy()
 *   @Component({    ..., template: ``})
 *   export class AppComponent implements OnInit {
 *     ngOnInit() {
 *       this.observable$ = Rx.Observable.interval(1000);
 *       this.observable$.pipe(takeUntilOnDestroy(this)).subscribe();
 *     }
 * }
 */
export function takeUntilOnDestroy<T>(instance: TakeUntilOnDestroyInstance): MonoTypeOperatorFunction<T> {
    if (!instance.__takeUntilOnDestroy$) {
        instance.__takeUntilOnDestroy$ = new Subject<void>();
    }

    return takeUntil(instance.__takeUntilOnDestroy$);
}

/**
 * Wrap the ngOnDestroy method and emit __takeUntilOnDestroy$ changes
 */
export function TakeUntilOnDestroy(): (c: Type<TakeUntilOnDestroyInstance>) => void {
    return (constructor): void => {
        const prevNgOnDestroy = constructor.prototype.ngOnDestroy;
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,func-names
        constructor.prototype.ngOnDestroy = function(this: TakeUntilOnDestroyInstance) {
            if (this.__takeUntilOnDestroy$) {
                this.__takeUntilOnDestroy$.next();
                this.__takeUntilOnDestroy$.complete();
            }
            prevNgOnDestroy.apply();
        };
    };
}
