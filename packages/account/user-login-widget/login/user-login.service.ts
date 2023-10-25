import { Injectable, OnDestroy } from '@angular/core';
import { XmEventManager } from '@xm-ngx/core';
import { JhiLanguageService } from '@xm-ngx/jhipster';
import { Subscription } from 'rxjs';

import { Principal } from '@xm-ngx/core/user';
import { XmConfigService } from '@xm-ngx/core/config';
import { UserLogin } from './user-login.model';

@Injectable()
export class UserLoginService implements OnDestroy {

    private promise: Promise<any>;
    private allLogins: any = {};
    private eventManagerSubscription: Subscription;
    constructor(
        private jhiLanguageService: JhiLanguageService,
        private specService: XmConfigService,
        private eventManager: XmEventManager,
        private principal: Principal,
    ) {
        this.getAllLogins().then((logins) => this.allLogins = logins);
        this.registerChangeAuth();
    }

    public ngOnDestroy(): void {
        this.eventManagerSubscription.unsubscribe();
    }

    public getAllLogins(): Promise<any> {
        if (this.promise) {
            return this.promise;
        }
        return this.promise = new Promise((resolve) => {
            this.specService.getLoginsSpec().toPromise().then(
                (result) => {
                    resolve(result.logins.reduce((map, obj) => {
                        map[obj.key] = obj;
                        return map;
                    }, {}));
                },
                () => this.promise = null,
            );
        });
    }

    public getLogin(login: UserLogin): string {
        if (!this.allLogins.hasOwnProperty(login.typeKey)) {
            return '';
        }
        return this.getName(login.typeKey) + ': ' + login.login;
    }

    public getName(typeKey: string): (string | number | 'MM/DD/YYYY HH:mm') | { name: 'English' } | any {
        const type = this.allLogins[typeKey];
        const name = type.name;
        const langKey = this.principal.getLangKey();
        if (name) {
            if (name[this.jhiLanguageService.currentLang]) {
                return name[this.jhiLanguageService.currentLang];
            } else if (name[langKey]) {
                return name[langKey];
            } else if (name.en) {
                return name.en;
            }
        }
        return type.key;
    }

    private registerChangeAuth(): void {
        this.eventManagerSubscription = this.eventManager.subscribe('authenticationSuccess', () => {
            this.allLogins = {};
            this.promise = null;
            this.getAllLogins().then((logins) => this.allLogins = logins);
        });
    }
}
