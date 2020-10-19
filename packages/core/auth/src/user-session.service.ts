import { Injectable } from '@angular/core';
import { SessionService } from '@xm-ngx/core';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, pluck } from 'rxjs/operators';

export interface IUserSession {
    active: boolean;
}

/**
 * Modifing information about user session.
 */
@Injectable({ providedIn: 'root' })
export class UserSessionService {

    constructor(
        protected sessionService: SessionService<IUserSession>,
    ) {
    }

    public create(session: IUserSession = { active: true }): void {
        this.sessionService.store(session);
    }

    public update(session: IUserSession): void {
        this.sessionService.store(session);
    }

    public get(): Observable<IUserSession> {
        return this.sessionService.get();
    }

    public destory(): void {
        this.sessionService.store({ active: false });
    }

    public isActive(): Observable<boolean> {
        return this.get().pipe(
            filter<IUserSession>(Boolean),
            pluck('active'),
            distinctUntilChanged(),
        );
    }
}
