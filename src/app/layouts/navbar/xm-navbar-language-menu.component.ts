import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { XmSessionService, XmUiConfigService } from '@xm-ngx/core';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { LanguageService, Locale } from '@xm-ngx/translation';

@Component({
    selector: 'xm-navbar-language-menu-component',
    template: `
        <div *ngIf="!isSessionActive" class="navbar-container-part langs-part">
            <ul class="navbar-nav navbar-right xm-langs-chooser">
                <li class="dropdown">
                    <button aria-expanded="false"
                            aria-haspopup="true"
                            class="btn btn-icon btn-just-icon btn-link nav-link"
                            data-toggle="dropdown"
                            id="navbarLanguageMenuLink"
                            mat-icon-button>
                        <i class="material-icons">language</i>
                    </button>
                    <div aria-labelledby="navbarDropdownMenuLink"
                         class="dropdown-menu dropdown-menu-right langs-drop-container">
                        <ng-container *ngFor="let language of languages">
                            <a (click)="changeLanguage(language);" class="dropdown-item" href="javascript: void(0);">
                                {{language | findLanguageFromKey}}
                            </a>
                        </ng-container>
                    </div>
                </li>
            </ul>
        </div>
    `,
    encapsulation: ViewEncapsulation.None,
})
export class XmNavbarLanguageMenuComponent implements OnInit {
    public languages: Locale[];
    public isSessionActive: boolean;

    constructor(
        private xmUiConfigService: XmUiConfigService,
        private xmSessionService: XmSessionService,
        private languageService: LanguageService,
    ) {
    }

    public ngOnInit(): void {
        this.xmSessionService.isActive()
            .pipe(takeUntilOnDestroy(this))
            .subscribe((isActive) => this.isSessionActive = isActive);

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
