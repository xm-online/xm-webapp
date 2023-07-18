import { Component, Input, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { XmUser } from '@xm-ngx/core/user';
import { takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { LanguageModule, LanguageService, Locale, TitleService } from '@xm-ngx/translation';
import * as _ from 'lodash';
import { interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountService, Principal } from '@xm-ngx/core/user';
import { XmDynamicWidget } from '@xm-ngx/dynamic';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { XmPermissionModule } from '@xm-ngx/core/permission';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'xm-user-settings-widget',
    templateUrl: './xm-user-settings-widget.component.html',
    imports: [CommonModule, MatCardModule, TranslateModule, MatFormFieldModule, MatInputModule, FormsModule, XmPermissionModule, MatSelectModule, MatButtonModule, LanguageModule],
    standalone: true,
})
export class XmUserSettingsWidgetComponent implements OnInit, XmDynamicWidget {
    public languages$: Observable<Locale[]> = this.languageService.languages$();

    @Input() public config: {hideDates: boolean};
    public timeZoneOffset: string;
    public settingsAccount: XmUser;
    public error: string;
    public success: string;
    public clock$: Observable<Date> = interval(1000).pipe(map(() => new Date()));

    constructor(
        private accountService: AccountService,
        private translateService: TranslateService,
        private titleService: TitleService,
        private principal: Principal,
        private languageService: LanguageService,
    ) {
    }

    public ngOnInit(): void {
        this.principal.identity().then((account: XmUser) => {
            if (!account){
                return;
            }
            this.settingsAccount = account;
            this.timeZoneOffset = account.timeZoneOffset || '';

            if (!account.langKey) {
                account.langKey = this.languageService.languages[0];
            }
        });
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    public save(): void {
        this.accountService.save(this.settingsAccount).subscribe(() => {
            this.error = null;
            this.success = 'OK';
            this.principal.identity(true).then((account) => {
                this.settingsAccount = _.cloneDeep(account);
                this.languageService.locale = this.settingsAccount.langKey;
                this.translateService.getTranslation(this.settingsAccount.langKey).subscribe(() => {
                    this.titleService.update();
                });
            });
        }, () => {
            this.success = null;
            this.error = 'ERROR';
        });
    }


}
