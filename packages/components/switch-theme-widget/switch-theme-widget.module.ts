import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, OnInit, Type } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConditionModule } from '@xm-ngx/components/condition';
import { XmLoadingModule } from '@xm-ngx/components/loading';
import { XmPermissionModule } from '@xm-ngx/core/permission';
import { XmTheme, XmThemeController } from '@xm-ngx/core/theme';
import { JavascriptCode } from '@xm-ngx/shared/interfaces';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import * as _ from 'lodash';
import { finalize } from 'rxjs/operators';
import { XmDynamicWidget } from '@xm-ngx/dynamic';
import { ThemeSchemeType } from '@xm-ngx/core/theme';

interface SwitchThemeOptionsTheme {
    theme: string,
    scheme: ThemeSchemeType,
    icon: string,
    color: string,
    tooltip: Translate
}

interface SwitchThemeOptions {
    themes: SwitchThemeOptionsTheme[];
    permission: string;
    condition: JavascriptCode;
}


@Component({
    selector: 'switch-theme-widget',
    template: `
        <ng-container *xmCondition="config.condition; arguments {config: config}">
            <ng-container *xmPermission="config.permission">
                <button *ngIf="nextTheme"
                        (click)="changeTheme(nextTheme)"
                        [xm-loading]="loading"
                        [disabled]="loading"
                        [matTooltip]="nextTheme.tooltip | translate"
                        mat-icon-button>
                    <mat-icon>{{nextTheme.icon}}</mat-icon>
                </button>
            </ng-container>
        </ng-container>
    `,
})
export class SwitchThemeWidget implements OnInit, XmDynamicWidget {
    @Input() public config: SwitchThemeOptions;
    public loading: boolean;
    public nextTheme: SwitchThemeOptionsTheme;

    constructor(private themeService: XmThemeController) {
    }

    public ngOnInit(): void {
        const fromStore = this.themeService.get();
        const current = _.find(this.config?.themes, { theme: fromStore.name });
        this.changeTheme(current);
        this.nextTheme = this.getNext(current);
    }

    public getNext(current: SwitchThemeOptionsTheme): SwitchThemeOptionsTheme | null {
        const idx = _.indexOf(this.config.themes, current);
        return this.config.themes[idx + 1] || this.config.themes[0] || null;
    }

    public changeTheme(theme: SwitchThemeOptionsTheme): void {
        if (this.loading || !this.config?.themes || !theme) {
            return;
        }
        const options: XmTheme = {
            name: theme.theme,
            lightTheme: theme.theme,
            darkTheme: theme.theme,
            themeColor: theme.color,
            themeStrategy: 'THEME',
            appearanceStrategy: theme.scheme,
        };

        this.loading = true;
        this.themeService.set(options)
            .pipe(finalize(() => this.loading = false))
            .subscribe(() => this.nextTheme = this.getNext(theme));
    }
}

@NgModule({
    declarations: [SwitchThemeWidget],
    exports: [SwitchThemeWidget],
    imports: [
        CommonModule,
        MatIconModule,
        XmLoadingModule,
        MatButtonModule,
        MatTooltipModule,
        XmPermissionModule,
        ConditionModule,
        XmTranslationModule,
    ],
})
export class SwitchThemeWidgetModule {
    public entry: Type<SwitchThemeWidget> = SwitchThemeWidget;
}

