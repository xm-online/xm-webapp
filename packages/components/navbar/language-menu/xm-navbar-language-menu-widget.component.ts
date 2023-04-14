import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { XmSessionService } from '@xm-ngx/core';
import { XmUiConfigService } from '@xm-ngx/core/config';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { LanguageModule, LanguageService, Locale, XmTranslationModule } from '@xm-ngx/translation';
import { Observable } from 'rxjs';
import { XmDynamicWidget } from '@xm-ngx/dynamic';
import { XmLanguageUiConfig } from '@xm-ngx/administration/translations/services/translation.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';

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
        <button *ngIf="!(isSessionActive$ | async)"
                mat-button
                [matMenuTriggerFor]="menu"
                [matTooltip]="'xm-navbar-language-menu.choose-language' | translate"
                [attr.aria-label]="'xm-navbar-language-menu.choose-language' | translate">
            {{languageService.locale | findLanguageFromKey}}
            <mat-icon>expand_more</mat-icon>
        </button>

        <mat-menu #menu="matMenu" xPosition="before">
            <button mat-menu-item
                    *ngFor="let language of languages"
                    (click)="changeLanguage(language);">
                <span>{{language | findLanguageFromKey}}</span>
            </button>
        </mat-menu>
    `,
    encapsulation: ViewEncapsulation.None,
})
export class XmNavbarLanguageMenuWidget implements OnInit, XmDynamicWidget {
    @Input() public config: unknown;

    public languages: Locale[];
    public isSessionActive$: Observable<boolean> = this.xmSessionService.isActive();

    constructor(
        private xmUiConfigService: XmUiConfigService<XmLanguageUiConfig>,
        private xmSessionService: XmSessionService,
        public languageService: LanguageService,
    ) {
    }

    public ngOnInit(): void {
        this.xmUiConfigService.config$().pipe(takeUntilOnDestroy(this)).subscribe((config) => {
            this.languages = (config && config.langs) ? config.langs : this.languageService.languages;
        });
    }

    public changeLanguage(languageKey: string): void {
        this.languageService.locale = languageKey;
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

}
