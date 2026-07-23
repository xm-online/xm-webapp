import { CommonModule } from '@angular/common';
import { Component, inject, input, Input, InputSignal, NgModule, OnInit, Signal, Type } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConditionModule } from '@xm-ngx/components/condition';
import { XmLoadingModule } from '@xm-ngx/components/loading';
import { XmPermissionModule } from '@xm-ngx/core/permission';
import { ThemeSchemeType, XmTheme, XmThemeController } from '@xm-ngx/core/theme';
import { XmDynamicWidget } from '@xm-ngx/dynamic';
import { JavascriptCode } from '@xm-ngx/interfaces';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import * as _ from 'lodash';
import { finalize } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { XmPublicUiConfigService } from '@xm-ngx/core';

export interface SwitchThemeOptionsTheme {
    theme: string,
    scheme: ThemeSchemeType,
    icon: string,
    color: string,
    tooltip: Translate,
    dataQa?: string;
}

export interface SwitchThemeOptions {
    themes: SwitchThemeOptionsTheme[];
    permission: string;
    condition: JavascriptCode;
}


@Component({
    selector: 'switch-theme-widget',
    template: `
        <ng-container *xmCondition="config.condition; arguments {config: config}">
            <ng-container *xmPermission="config.permission">
                @if (nextTheme) {
                    @if (showAsStrokedButton()) {
                        <button class="stroked-theme-switch-button"
                                mat-stroked-button
                                (click)="changeTheme(nextTheme)"
                                [attr.data-qa]="nextTheme.dataQa || 'stroked-switch-theme-button'"
                        >
                            <mat-icon>{{ nextTheme.icon }}</mat-icon>
                            <span>{{ 'theme.switch' | translate: {theme: ('theme.themes.' + nextTheme.scheme | translate)} }}</span>
                        </button>
                    } @else {
                        <button (click)="changeTheme(nextTheme)"
                                [xm-loading]="loading"
                                [disabled]="loading"
                                [matTooltip]="nextTheme.tooltip | translate"
                                [attr.data-qa]="nextTheme.dataQa || 'switch-theme-button'"
                                mat-icon-button>
                            <mat-icon>{{ nextTheme.icon }}</mat-icon>
                        </button>
                    }
                }
            </ng-container>
        </ng-container>
    `,
    styles: `
        button {
            line-height: 0
        }

        .stroked-theme-switch-button {
            width: 100%;
        }
    `,
    standalone: false,
})
export class SwitchThemeWidget implements OnInit, XmDynamicWidget {
    private configService: XmPublicUiConfigService<XmTheme> = inject(XmPublicUiConfigService<XmTheme>);
    private themeService: XmThemeController = inject(XmThemeController);

    public showAsStrokedButton: InputSignal<boolean> = input(false);
    public publicConfig: Signal<XmTheme> = toSignal<XmTheme>(this.configService.config$());
    @Input() public config: SwitchThemeOptions;
    public loading: boolean;
    public nextTheme: SwitchThemeOptionsTheme;

    public ngOnInit(): void {
        if (!this.config?.themes?.length) {
            return;
        }
        const fromStore = this.themeService.get();
        const current = _.find(this.config?.themes, {theme: fromStore?.name});
        this.changeTheme(current);
        this.nextTheme = this.getNext(current);
    }

    public getNext(current: SwitchThemeOptionsTheme): SwitchThemeOptionsTheme | null {
        if (!this.config?.themes?.length) {
            return null;
        }
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
            themeStrategy: this.publicConfig()?.themeStrategy || 'THEME',
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

