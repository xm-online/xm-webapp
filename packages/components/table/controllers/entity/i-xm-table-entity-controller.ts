import { Observable } from 'rxjs';

export interface IXmTableEntityState<T> {
    item: T;
    error: string;
    loading: boolean;
}

export interface IXmTableEntityController<T> {
    state$(): Observable<IXmTableEntityState<T>>;

}

