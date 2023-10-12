import { Component, Input, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { XmUser } from '@xm-ngx/core/user';
import { takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { LanguageModule, LanguageService, Locale, TitleService } from '@xm-ngx/translation';
import * as _ from 'lodash';
import { firstValueFrom, interval, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
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
import { XmConfigService, XmUiConfigService } from '@xm-ngx/core/config';
import { buildJsfAttributes, nullSafe, XmJsonSchemaFormModule } from '@xm-ngx/json-schema-form';

@Component({
    selector: 'xm-user-settings-widget',
    templateUrl: './xm-user-settings-widget.component.html',
    imports: [CommonModule, MatCardModule, TranslateModule, MatFormFieldModule, MatInputModule, FormsModule, XmPermissionModule, MatSelectModule, MatButtonModule, LanguageModule, XmJsonSchemaFormModule],
    standalone: true,
})
export class XmUserSettingsWidgetComponent implements OnInit, XmDynamicWidget {
    public languages$: Observable<Locale[]> = this.languageService.languages$();

    @Input() public config: {hideDates: boolean};
    public timeZoneOffset: string;
    public settingsAccount: XmUser;
    public error: string;
    public success: string;
    public jsfAttributes: any;
    public clock$: Observable<Date> = interval(1000).pipe(map(() => new Date()));

    constructor(
        private accountService: AccountService,
        private translateService: TranslateService,
        private titleService: TitleService,
        public principal: Principal,
        private uiConfigService: XmUiConfigService,
        private languageService: LanguageService,
        private configService: XmConfigService,
    ) {
    }

    public async ngOnInit(): Promise<void> {
        const uiConfig = await firstValueFrom(
            this.uiConfigService.config$().pipe(
                catchError(() => {
                    return of(null);
                })
            )
        )
        if (!uiConfig?.disableAccountSettingsJsf) {
            this.initJsfForAccountRole();
        }

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

    public onChangeJsf(jsfFormData: any): void {
        if (this.settingsAccount.data) {
            this.settingsAccount = { ...this.settingsAccount, data: { ...this.settingsAccount.data, ...jsfFormData } };
        } else {
            this.settingsAccount = { ...this.settingsAccount, data: { ...jsfFormData } };
        }
    }

    private initJsfForAccountRole(): void {
        this.principal.identity().then((account) => {
            this.configService.getUaaDataSchema(account.roleKey)
                .subscribe(res => {
                    const { dataSpec, dataForm } = res;
                    this.jsfAttributes = buildJsfAttributes(dataSpec, dataForm);
                    this.jsfAttributes.data = Object.assign(nullSafe(this.jsfAttributes.data), nullSafe(account.data));
                });
        });
    }

}
