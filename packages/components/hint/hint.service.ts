import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class HintService {
    private _state = new BehaviorSubject(false);

    public get state(): boolean {
        return this._state.getValue();
    }

    public toggle(): void {
        this._state.next(!this.state);
    }

    public changes(): Observable<boolean> {
        return this._state;
    }
}
