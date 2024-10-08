import { ComponentStore } from '@ngrx/component-store';
import { inject, Injectable } from '@angular/core';
import { StateWrapperModel, WidgetStateInstance } from './state-wrapper.model';
import { HttpClient } from '@angular/common/http';
import { catchError, mergeMap, Observable, of, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';


@Injectable({providedIn: 'root'})
export class StateWrapperService extends ComponentStore<Record<string, StateWrapperModel<any, any>>> {
    private httpClient: HttpClient = inject(HttpClient);

    constructor() {
        const initialState: Record<string, StateWrapperModel<any, any>> = {};
        super(initialState);
        this.logState();
    }

    private logState(): void {
        this.select(state => state).subscribe((state) => {
            // eslint-disable-next-line no-console
            // console.group('%cApp state', 'background: #555555; padding: 4px 8px; border-radius: 4px; color: #ffffff;');
            // console.info(state);
            // eslint-disable-next-line no-console
            // console.groupEnd();
        });
    }

    public readonly addWidget = this.updater(
        (state: Record<string, StateWrapperModel<any, any>>, value: WidgetStateInstance) => {
            return {
                ...state,
                [value.selector]: {...value.data},
            };
        },
    );

    public updateHttpRequestResponse = this.updater((state: Record<string, StateWrapperModel<any, any>>, value: any) => {
        // const key: string = new URL(`${window.location.origin}/speech-evaluation/api/v1/operators/dvizer/summaries?filterStrategy=&fromDate.greaterThan=&toDate.lessThan=&sort=creationDate%2CDESC`).pathname;
        return {
            ...state,
            httpRequest: {...state.httpRequest, [value.config.state.key]: value.data},
        };
    });

    public fetchWidgetData = this.effect((config$: Observable<any>) => {
        return config$.pipe(
            mergeMap((config) => {
                if (!config?.httpRequest) {
                    return of(null);
                }
                const {
                    method,
                    url,
                    options,
                } = config?.httpRequest || {};
                return this.httpClient.request(method, url, options).pipe(
                    tap({
                        next: (data) => this.updateHttpRequestResponse({config, data}),
                        error: console.error,
                    }),
                    catchError((error) => {
                        console.error('Failed to fetch widget data.', error);
                        return throwError(() => error);
                    }),
                );
            }),
        );
    });
}
