import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, map, shareReplay } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DynamicContentService {
    private _content = new BehaviorSubject(null);

    public get content(): Observable<unknown> {
        return this._content.asObservable().pipe(shareReplay(1));
    }

    public hasContent(): Observable<boolean> {
        return this.content.pipe(
            map((value) => coerceBooleanProperty(value)),
        );
    }

    public loadContent(data: unknown): void {
        this._content.next(data);
    }

    public clearContent(): void {
        this._content.next(null);
    }
}
