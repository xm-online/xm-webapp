import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit, Type } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { XmLoadingModule } from '@xm-ngx/components/loading';
import { XmThemeService } from '@xm-ngx/core/theme';
import { Translate } from '@xm-ngx/translation';
import * as _ from 'lodash';
import { finalize } from 'rxjs/operators';

interface SwitchThemeOptionsTheme {
    theme: string,
    icon: string,
    color: string,
    tooltip: Translate
}

interface SwitchThemeOptions {
    themes: SwitchThemeOptionsTheme[]
}

@Component({
    selector: 'switch-theme-widget',
    template: `
        <button *ngIf="nextTheme"
                (click)="changeTheme(nextTheme)"
                [xm-loading]="loading"
                [disabled]="loading"
                [matTooltip]="nextTheme.tooltip"
                mat-icon-button>
            <mat-icon>{{nextTheme.icon}}</mat-icon>
        </button>
    `,
})
export class SwitchThemeWidget implements OnInit {
    public config: SwitchThemeOptions;
    public loading: boolean;
    public nextTheme: SwitchThemeOptionsTheme;

    constructor(private themeService: XmThemeService) {
    }

    public ngOnInit(): void {
        const theme = this.themeService.getTheme();
        this.nextTheme = _.find(this.config?.themes, { theme });
    }

    public changeTheme(theme: SwitchThemeOptionsTheme): void {
        if (this.loading || !this.config?.themes) {
            return;
        }
        this.loading = true;
        this.themeService.set(theme.theme, { themeColor: theme.color, themeStrategy: 'THEME' })
            .pipe(
                finalize(() => this.loading = false),
            ).subscribe(() => {
            const idx = this.config.themes.indexOf(this.nextTheme);
            this.nextTheme = this.config.themes[idx + 1] || this.config.themes[0];
        });
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
    ],
})
export class SwitchThemeWidgetModule {
    public entry: Type<SwitchThemeWidget> = SwitchThemeWidget;
}

