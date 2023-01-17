import { OverlayRef } from '@angular/cdk/overlay';
import { TemplateRef, Type } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface OverlayCloseEvent<R> {
    data: R | null;
}

export class CustomOverlayRef<R, T> {
    private afterClosedEvent$ = new Subject<OverlayCloseEvent<R>>();

    constructor(
        public overlay: OverlayRef,
        public content: string | TemplateRef<unknown> | Type<unknown>,
        public context: T, // pass data to modal i.e. FormData
    ) {
        overlay.backdropClick().subscribe(() => this._close(null));
    }

    public get afterClosed$(): Observable<{data: R | null}> {
        return this.afterClosedEvent$.asObservable();
    }

    public close(data?: R): void {
        this._close(data);
    }

    private _close(data: R): void {
        this.overlay.dispose();
        this.afterClosedEvent$.next({ data });
        this.afterClosedEvent$.complete();
    }
}
