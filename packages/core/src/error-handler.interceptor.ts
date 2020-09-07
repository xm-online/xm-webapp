import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpHeaders,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { XmEventManagerService as XmEventManager } from './xm-event-manager.service';

export const SKIP_ERROR_HANDLER_INTERCEPTOR_HEADER_KEY = 'X-Skip-Interceptor';
export const SKIP_ERROR_HANDLER_INTERCEPTOR_HEADERS = new HttpHeaders().set(
    SKIP_ERROR_HANDLER_INTERCEPTOR_HEADER_KEY,
    '',
);

export interface ErrorHandlerEventPayload {
    content: HttpErrorResponse,
    request: HttpRequest<unknown>
}

export const ErrorHandlerEventName = 'xm.httpError';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {

    constructor(private eventManager: XmEventManager) {
    }

    public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        if (request.headers.has(SKIP_ERROR_HANDLER_INTERCEPTOR_HEADER_KEY)) {
            const headers = request.headers.delete(SKIP_ERROR_HANDLER_INTERCEPTOR_HEADER_KEY);
            return next.handle(request.clone({ headers }));
        } else {
            return next.handle(request).pipe(tap({
                error: (err: HttpErrorResponse) => this.handleError(err, request),
            }));
        }
    }

    private handleError(err: HttpErrorResponse, request: HttpRequest<unknown>): void {
        if (err instanceof HttpErrorResponse
            && !(err.status === 401 &&
                (err.message === '' || (err.url && err.url.includes('/api/account'))))) {
            this.eventManager.broadcast({ name: ErrorHandlerEventName, content: err, request });
        }
    }
}
