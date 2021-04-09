import { HttpResponse } from '@angular/common/http';
import { IId } from '@xm-ngx/shared/interfaces';
import { Observable, of } from 'rxjs';

export class MockEntityCollection<T extends IId = unknown> {
    public loading$: Observable<boolean> = of(false);

    public create(): Observable<T> {
        return of(null);
    }

    public delete(): Observable<unknown> {
        return of(null);
    }

    public getById(): Observable<T> {
        return of(null);
    }

    public getAll(): Observable<T[]> {
        return of(null);
    }

    public query(): Observable<T[]> {
        return of(null);
    }

    public update(): Observable<T> {
        return of(null);
    }

    public upsert(): Observable<T> {
        return of(null);
    }

    public getEntitiesByIds(): Observable<HttpResponse<T[]>> {
        return of({} as HttpResponse<T[]>);
    }
}
