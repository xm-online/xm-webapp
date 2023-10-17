import { Injectable, OnDestroy } from '@angular/core';
import { XmSessionService } from '@xm-ngx/core';
import { XmUserService } from './xm-user.service';
import { OnInitialize } from '@xm-ngx/interfaces';
import { takeUntilOnDestroyDestroy } from '@xm-ngx/operators';

import moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { filter, shareReplay, takeUntil } from 'rxjs/operators';


import { AccountService } from './account.service';
import { SUPER_ADMIN, XmAuthenticationService } from '@xm-ngx/core/auth';

const CACHE_SIZE = 1;


@Injectable({ providedIn: 'root' })
export class Principal implements OnDestroy, OnInitialize {
    private userIdentity: any;
    private authenticated: boolean = false;
    private authenticationState: Subject<any> = new Subject<any>();
    private promise: Promise<any>;
    private reload$: Subject<void> = new Subject<void>();
    private xmProfileCache$: Observable<any>;

    constructor(private account: AccountService,
                private sessionService: XmSessionService,
                private xmAuthenticationService: XmAuthenticationService,
                private userService: XmUserService,
    ) {
    }

    public init(): void {
        this.sessionService.isActive().pipe(
            filter(i => i === false),
        ).subscribe(() => this.logout());
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    public isSuperAdmin(): boolean {
        return this.userIdentity && this.userIdentity.roleKey === SUPER_ADMIN;
    }

    public identityUserKey(): string {
        return this.userIdentity && this.userIdentity.userKey;
    }

    public logout(): void {
        this.userIdentity = null;
        this.authenticated = false;
        this.promise = null;
        this.authenticationState.next(this.userIdentity);
        this.resetCachedProfile();
    }

    public hasAnyAuthority(authorities: string[]): Promise<boolean> {
        if (!this.authenticated || !this.userIdentity || !this.userIdentity.roleKey) {
            return Promise.resolve(false);
        }

        //if has role but no authorities provided, return true
        if (this.userIdentity.roleKey && !authorities?.length) {
            return Promise.resolve(true);
        }

        const hasKey = authorities.some(it => it === this.userIdentity.roleKey);

        return Promise.resolve(hasKey);
    }

    public hasPrivilegesInline(privileges: string[] = [], privilegesOperation: string = 'OR'): any {
        if (!this.authenticated || !this.userIdentity || !this.userIdentity.privileges) {
            return false;
        }

        if (SUPER_ADMIN === this.userIdentity.roleKey) {
            return true;
        }

        if (privilegesOperation === 'OR') {
            for (let i = privileges.length; i--;) {
                if (this.userIdentity.privileges.indexOf(privileges[i]) !== -1) {
                    return true;
                }
            }
            return false;
        } else if (privilegesOperation === 'AND') {
            return privileges.filter((el) => this.userIdentity.privileges.indexOf(el) === -1);
        }
        console.warn('error.privilegeOperationWrong', { name: privilegesOperation });
        return false;

    }

    public hasPrivileges(privileges: string[] = [], privilegesOperation: string = 'OR'): Promise<any> {
        return Promise.resolve(this.hasPrivilegesInline(privileges, privilegesOperation));
    }

    public hasAuthority(authority: string): Promise<boolean> {
        if (!this.authenticated) {
            return Promise.resolve(false);
        }

        return this.identity().then((result) => Promise.resolve(result.roleKey && result.roleKey === authority), () => Promise.resolve(false));
    }

    public identity(force: boolean = false, mockUser: boolean = false): Promise<any> {
        if (!force && this.promise) {
            return this.promise;
        }
        return this.promise = new Promise((resolve, reject) => {
            if (force === true) {
                this.userService.forceReload();
                this.authenticated = false;
                this.userIdentity = undefined;
            }

            /*
                 * Check and see if we have retrieved the userIdentity data from the server.
                 * if we have, reuse it by immediately resolving
                 */
            if (this.userIdentity) {
                this.promise = null;
                resolve(this.userIdentity);
                return;
            }

            if (this.xmAuthenticationService.isSureGuestSession()) {
                this.promise = null;
                resolve(this.userIdentity);
                return;
            }

            // Retrieve the userIdentity data from the server, update the identity object, and then resolve.
            this.account
                .get()
                .toPromise()
                .then((response) => {
                    const account = response.body;
                    this.promise = null;
                    this.resetCachedProfile();
                    if (account) {
                        if (account.permissions) {
                            account.privileges = account.permissions.reduce((result, el) => {
                                if (el.enabled) {
                                    result.push(el.privilegeKey);
                                }
                                return result;
                            }, []);
                        }
                        this.sessionService.create();
                        this.userIdentity = account;
                        this.authenticated = true;
                        account.timeZoneOffset = this.setTimezoneOffset();
                    } else {
                        this.sessionService.clear();
                        this.userIdentity = null;
                        this.authenticated = false;
                    }
                    this.authenticationState.next(this.userIdentity);
                    resolve(this.userIdentity);
                })
                .catch(() => {
                    this.promise = null;
                    this.resetCachedProfile();
                    if (mockUser) {
                        this.userIdentity = {
                            firstName: 'NoName',
                            lastName: 'NoName',
                            roleKey: 'ROLE_USER',
                        };
                        this.authenticated = true;
                        this.authenticationState.next(this.userIdentity);
                        resolve(this.userIdentity);
                    } else {
                        this.sessionService.clear();
                        this.userIdentity = null;
                        this.authenticated = false;
                        this.authenticationState.next(this.userIdentity);
                        resolve(this.userIdentity);
                    }
                });
        });

    }

    /**
     * Returns user XM Profile
     * @param force - if true loads profile from the backend
     */
    public getXmEntityProfile(force: boolean = false): Observable<any> {
        if (force) {
            this.resetCachedProfile();
        }

        if (!this.xmProfileCache$) {
            this.xmProfileCache$ = this.loadProfile().pipe(
                takeUntil(this.reload$),
                shareReplay(CACHE_SIZE),
            );
        }

        return this.xmProfileCache$;
    }

    public isAuthenticated(): boolean {
        return this.authenticated;
    }

    public getAuthenticationState(): Observable<any> {
        return this.authenticationState.asObservable();
    }

    public getImageUrl(): string {
        if (this.isIdentityResolved()) {
            if (this.userIdentity.imageUrl === 'null') {
                return null;
            }
            return this.userIdentity.imageUrl;
        }
        return null;
    }

    public getUserKey(): string {
        return this.isIdentityResolved() ? this.userIdentity.userKey : null;
    }

    public getName(): string {
        if (!this.isIdentityResolved()) {
            return null;
        }
        if (this.userIdentity.firstName || this.userIdentity.lastName) {
            return [this.userIdentity.firstName, this.userIdentity.lastName].join(' ');
        }
        return this.userIdentity.logins[0].login;

    }

    public getDetailName(): string[] {
        if (!this.isIdentityResolved()) {
            return null;
        }

        return [
            this.userIdentity.firstName ? this.userIdentity.firstName : this.userIdentity.logins[0].login,
            this.userIdentity.lastName ? this.userIdentity.lastName : null,
        ];
    }

    public getLangKey(): string {
        return this.isIdentityResolved() ? this.userIdentity.langKey : null;
    }

    public setLangKey(langKey: string): void {
        if (this.isIdentityResolved()) {
            this.userIdentity.langKey = langKey;
        }
    }

    public setTimezoneOffset(): string {
        // For now setting offset from browser
        return moment().format('Z');
    }

    /**
     * True if resolved. Inner helper method.
     * @returns `{boolean}`
     */
    private isIdentityResolved(): boolean {
        return this.userIdentity;
    }

    private loadProfile(): Observable<any> {
        return this.account.getProfile();
    }

    private resetCachedProfile(): void {
        this.reload$.next();
        this.xmProfileCache$ = null;
    }
}
