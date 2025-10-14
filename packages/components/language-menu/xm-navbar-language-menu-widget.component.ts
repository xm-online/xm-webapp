import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { XmSessionService } from '@xm-ngx/core';
import { XmUIConfig, XmUiConfigService } from '@xm-ngx/core/config';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { LanguageModule, LanguageService, Locale, XmTranslationModule } from '@xm-ngx/translation';
import { from, map, Observable, tap } from 'rxjs';
import { XmDynamicWidget } from '@xm-ngx/dynamic';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { AccountService, Principal, XmUser } from '@xm-ngx/core/user';
import { TranslateService } from '@ngx-translate/core';
import { TitleService } from 'lib/translation';

export interface XmLanguageUiConfig extends XmUIConfig {
    exts: string[];
    langs: string[];
}

@Component({
    selector: 'xm-navbar-language-menu-widget',
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        XmTranslationModule,
        LanguageModule,
        MatMenuModule,
    ],
    standalone: true,
    template: `
        @if (!isHidden) {
            <button *ngIf="showWidget() | async"
                    mat-button
                    [matMenuTriggerFor]="menu"
                    [matTooltip]="'xm-navbar-language-menu.choose-language' | translate"
                    [attr.aria-label]="'xm-navbar-language-menu.choose-language' | translate">
                {{ languageService.locale | findLanguageFromKey }}
                <mat-icon>expand_more</mat-icon>
            </button>
        }
        
        <mat-menu #menu="matMenu" xPosition="before">
            <button mat-menu-item
                    *ngFor="let language of languages"
                    (click)="changeLanguage(language);">
                <span>{{ language | findLanguageFromKey }}</span>
            </button>
        </mat-menu>
    `,
    encapsulation: ViewEncapsulation.None,
})
export class XmNavbarLanguageMenuWidget implements OnInit, XmDynamicWidget {
    @Input() public config: unknown;
    @Input() public showAlways: boolean = false;
    @Input() public isHidden: boolean = false;
    public languages: Locale[];
    public isSessionActive$: Observable<boolean> = this.xmSessionService.isActive();
    public accountSettings?: XmUser;

    constructor(
        private xmUiConfigService: XmUiConfigService<XmLanguageUiConfig>,
        private xmSessionService: XmSessionService,
        public languageService: LanguageService,
        public principal: Principal,
        public translateService: TranslateService,
        public titleService: TitleService,
        private accountService: AccountService,
    ) {
    }

    public ngOnInit(): void {
        from(this.principal.identity())
            .pipe(
                takeUntilOnDestroy(this),
                map((resp: any) => (resp?.body ?? resp) as XmUser | null),
                tap((account: XmUser | null) => {
                    if (account) {
                        this.accountSettings = account;
                    }
                }),
            )
            .subscribe();
        this.xmUiConfigService.config$().pipe(takeUntilOnDestroy(this)).subscribe({
            next: (config) => {
                this.languages = (config && config.langs) ? config.langs : this.languageService.languages;
            },
            error: () => {
                this.languages = this.languageService.languages;
            },
        });
    }

    public changeLanguage(languageKey: string): void {
        if (!this.accountSettings || !this.principal.isAuthenticated()) {
            this.languageService.locale = languageKey;
            return;
        }

        this.accountSettings.langKey = languageKey;
        this.accountService.saveWithoutCashe(this.accountSettings).subscribe({
            next: () => {
                this.principal.identity(true).then((resp) => {
                    const account = ((resp?.body ?? resp) as XmUser | null);
                    if (account && account.langKey === languageKey) {
                        this.accountSettings = account;
                        this.languageService.locale = languageKey;
                    }
                });
            },
            error: () => console.error('Error updating language preference'),
        });
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    public showWidget(): Observable<boolean> {
        return this.isSessionActive$.pipe(
            map(isSessionActive => {
                return !isSessionActive || this.showAlways;
            }),
        );
    }
}
