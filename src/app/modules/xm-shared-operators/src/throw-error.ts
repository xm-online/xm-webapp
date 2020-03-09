import { environment } from '@xm-ngx/environment';

export function throwError(text: string): never {
    if (!environment.production) {
        // eslint-disable-next-line no-debugger
        debugger;
    }
    throw new Error(text);
}
