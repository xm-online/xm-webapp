import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { XmAlertService } from '@xm-ngx/alert';
import { JhiLanguageHelper } from '@xm-ngx/translation';

import { AccountService, User, UserService } from '@xm-ngx/core/user';

import { UserLoginService } from '@xm-ngx/account/user-login-widget';
import { UserLogin } from '@xm-ngx/account/user-login-widget';

@Component({
    selector: 'xm-user-mgmt-detail',
    templateUrl: './user-management-detail.component.html',
    providers: [],
})
export class UserMgmtDetailComponent implements OnInit, OnDestroy {

    public user: User;
    public showLoader: boolean;
    public userEmail: string;
    private routeData: any;
    private subscription: any;
    private routeDataSubscription: any;

    constructor(
        private jhiLanguageHelper: JhiLanguageHelper,
        private alertService: XmAlertService,
        private userService: UserService,
        private userLoginService: UserLoginService,
        private pwsResetService: AccountService,
        private route: ActivatedRoute,
        private location: Location,
    ) {
        this.routeDataSubscription = this.route.data.subscribe((data) => {
            this.routeData = data;
        });
    }

    public ngOnInit(): void {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params.userKey);
        });
    }

    public load(userKey: string): void {
        this.showLoader = true;
        this.userService.find(userKey).subscribe(
            (user) => {
                this.user = user;
                this.userEmail = this.getEmail();
                this.routeData.pageSubSubTitle = user.userKey;
                this.jhiLanguageHelper.updateTitle();
            },
            (err) => console.info(err),
            () => this.showLoader = false);
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
        this.routeDataSubscription.unsubscribe();
    }

    public getLogin(login: UserLogin): string {
        return this.userLoginService.getLogin(login);
    }

    public onBack(): void {
        this.location.back();
    }

    public resetPassword(): void {
        this.alertService.open({
            title: `Initiate password reset for ${this.userEmail}?`,
            showCancelButton: true,
            confirmButtonText: 'Yes, reset!',
        }).subscribe((result) => {
            if (result.value) {
                this.pwsResetService.resetPasswordV2(
                    this.user.logins[0].login,
                    this.user.logins[0].typeKey,
                ).subscribe();
            }
        });
    }

    public pwdResetDisabled(): boolean {
        return !this.user.activated;
    }

    private getEmail(): string {
        let email = '';
        if (this.user.logins) {
            this.user.logins.forEach((item: UserLogin) => {
                if (item.typeKey === 'LOGIN.EMAIL') {
                    email = item.login;
                }
            });
        }
        return email;
    }

}
