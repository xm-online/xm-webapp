import { ErrorHandler, Provider, StaticProvider } from '@angular/core';
import { GlobalErrorHandler } from './global-error-handler';

export const GLOBAL_ERROR_HANDLER_PROVIDER: StaticProvider = {
    provide: ErrorHandler, useClass: GlobalErrorHandler,
};

export function globalErrorHandlerFactory(): Provider[] {
    return [GLOBAL_ERROR_HANDLER_PROVIDER];
}
