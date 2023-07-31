/* eslint-disable no-console,no-debugger */
import { MonoTypeOperatorFunction } from 'rxjs';
import { tap } from 'rxjs/operators';

export function debug<T>(key: string | number, isDebugger: boolean = true): MonoTypeOperatorFunction<T> {

    return tap<T>({
        next: (data) => {
            if (isDebugger) {
                debugger;
            }
            console.info(`NEXT: ${key} `, data);
        },
        error: (err) => {
            if (isDebugger) {
                debugger;
            }
            console.info(`ERROR: ${key} `, err);
        },
        complete: () => {
            if (isDebugger) {
                debugger;
            }
            console.info(`COMPLETE: ${key} `);
        },
    });
}
