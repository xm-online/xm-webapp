import { Injectable } from '@angular/core';
import { SessionService } from '@xm-ngx/core';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, pluck, skip } from 'rxjs/operators';

export interface IUserSession {
    active: boolean;
    refreshToken: string;
    accessToken: string;
    useAutoRefreshToken: boolean;
}

/**
 * Modifying information about user session.
 */
@Injectable({ providedIn: 'root' })
export class UserSessionService {

    public dispose$: Observable<void> = this.isActive().pipe(
        skip(1),
        distinctUntilChanged((active) => active === false),
        map(() => undefined),
    );

    public readonly sessionKey: string = 'UserSessionKey';

    constructor(
        protected sessionService: SessionService,
    ) {
    }

    public create(session: IUserSession): void {
        this.sessionService.store(this.sessionKey, session);
    }

    public update(session: Partial<IUserSession>): void {
        this.sessionService.store(this.sessionKey, session);
    }

    public get(): Observable<IUserSession> {
        return this.sessionService.get(this.sessionKey);
    }

    public destroy(): void {
        this.sessionService.store(this.sessionKey, { active: false });
    }

    public isActive(): Observable<boolean> {
        return this.get().pipe(
            filter<IUserSession>(Boolean),
            pluck('active'),
            distinctUntilChanged(),
        );
    }
}
