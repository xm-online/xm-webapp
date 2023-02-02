import { Component, Input, OnInit } from '@angular/core';
import { DarkThemeManagerConfig, XmDarkThemeManager } from '@xm-ngx/core/theme';
import { Defaults } from '@xm-ngx/shared/operators';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { NgForOf } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { XmUserService } from '@xm-ngx/core/user';
import { finalize } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { cloneDeep } from 'lodash';

export interface XmAppearanceThemeWidgetConfig {
    themes: DarkThemeManagerConfig[];
}

export const XM_APPEARANCE_THEME_WIDGET_CONFIG_DEFAULT: XmAppearanceThemeWidgetConfig = {
    themes: [
        { theme: 'red', darkTheme: 'red-dark', themeStrategy: 'THEME', themeColor: '#F44336' },
        { theme: 'pink', darkTheme: 'pink-dark', themeStrategy: 'THEME', themeColor: '#E91E63' },
        { theme: 'purple', darkTheme: 'purple-dark', themeStrategy: 'THEME', themeColor: '#9C27B0' },
        { theme: 'deep-purple', darkTheme: 'deep-purple-dark', themeStrategy: 'THEME', themeColor: '#673AB7' },
        { theme: 'indigo', darkTheme: 'indigo-dark', themeStrategy: 'THEME', themeColor: '#3F51B5' },
        { theme: 'blue', darkTheme: 'blue-dark', themeStrategy: 'THEME', themeColor: '#2196f3' },
        { theme: 'light-blue', darkTheme: 'light-blue-dark', themeStrategy: 'THEME', themeColor: '#03A9F4' },
        { theme: 'cyan', darkTheme: 'cyan-dark', themeStrategy: 'THEME', themeColor: '#00BCD4' },
        { theme: 'teal', darkTheme: 'teal-dark', themeStrategy: 'THEME', themeColor: '#009688' },
        { theme: 'green', darkTheme: 'green-dark', themeStrategy: 'THEME', themeColor: '#4CAF50' },
        { theme: 'light-green', darkTheme: 'light-green-dark', themeStrategy: 'THEME', themeColor: '#8BC34A' },
        { theme: 'lime', darkTheme: 'lime-dark', themeStrategy: 'THEME', themeColor: '#CDDC39' },
        { theme: 'yellow', darkTheme: 'yellow-dark', themeStrategy: 'THEME', themeColor: '#FFEB3B' },
        { theme: 'amber', darkTheme: 'amber-dark', themeStrategy: 'THEME', themeColor: '#ffc107' },
        { theme: 'orange', darkTheme: 'orange-dark', themeStrategy: 'THEME', themeColor: '#FF9800' },
        { theme: 'deep-orange', darkTheme: 'deep-orange-dark', themeStrategy: 'THEME', themeColor: '#FF5722' },
        { theme: 'brown', darkTheme: 'brown-dark', themeStrategy: 'THEME', themeColor: '#795548' },
        { theme: 'grey', darkTheme: 'grey-dark', themeStrategy: 'THEME', themeColor: '#9E9E9E' },
        { theme: 'blue-grey', darkTheme: 'blue-grey-dark', themeStrategy: 'THEME', themeColor: '#607d8b' },
        { theme: 'example', darkTheme: 'example-dark', themeStrategy: 'THEME', themeColor: '#FFEB3B' },
    ],
};

@Component({
    selector: 'xm-appearance-theme-widget',
    template: `
        <mat-card>
            <div mat-card-title>Appearance</div>

            Appearance:
            <mat-radio-group [(ngModel)]="lightDarkThemeStrategy"
                             [disabled]="loading"
                             (ngModelChange)="updateTheme()">
                <mat-radio-button [value]="'light'">{{'light'}}</mat-radio-button>
                <mat-radio-button [value]="'dark'">{{'dark'}}</mat-radio-button>
                <mat-radio-button [value]="'auto'">{{'auto'}}</mat-radio-button>
            </mat-radio-group>

            Accent color:
            <mat-radio-group [(ngModel)]="selectedTheme"
                             [disabled]="loading"
                             (ngModelChange)="updateTheme()"
                             class="grid-flow"
                             aria-label="Select an option">
                <mat-radio-button *ngFor="let theme of config.themes"
                                  class="color-container"
                                  [style.--theme-fill-color]="theme.themeColor"
                                  [value]="theme">{{theme.theme}}</mat-radio-button>
            </mat-radio-group>

        </mat-card>
    `,
    standalone: true,
    styles: [`
        :host {
            .grid-flow {
                display:               grid;
                grid-gap:              10px;
                grid-template-columns: repeat(auto-fill, 92px);
            }

            .color-container {
                --theme-fill-color: #000;
            }

            .color-container ::ng-deep .mat-radio-outer-circle {
                background-color: var(--theme-fill-color);
            }
        }
    `],
    imports: [
        MatRadioModule,
        FormsModule,
        NgForOf,
        MatCheckboxModule,
        MatCardModule,
    ],
})

export class XmUserAppearanceThemeWidget implements OnInit {

    @Defaults(XM_APPEARANCE_THEME_WIDGET_CONFIG_DEFAULT)
    @Input() public config: XmAppearanceThemeWidgetConfig;

    public loading: boolean;
    public selectedTheme: DarkThemeManagerConfig;
    public lightDarkThemeStrategy: 'light' | 'dark' | 'auto' = 'light';

    constructor(
        private themeManager: XmDarkThemeManager,
        private userStore: XmUserService,
        // private userService: UserService,
    ) {

    }

    public updateTheme(): void {
        if (this.loading) {
            return;
        }

        const theme = cloneDeep(this.selectedTheme);

        switch (this.lightDarkThemeStrategy) {
            case 'light': {
                theme.darkTheme = null;
                break;
            }
            case 'dark': {
                theme.theme = theme.darkTheme;
                break;
            }
            case 'auto': {
                break;
            }
        }

        this.loading = true;
        this.themeManager.set(theme)
            .pipe(finalize(() => this.loading = false))
            .subscribe();

        // this.userService.update()
        //     .pipe(tap(e => this.userStore.next(e.body)))
        //     .subscribe();
    }

    public ngOnInit(): void {
        // this.loading = true;
        this.userStore.user$()
            // .pipe(finalize(() => this.loading = false))
            .subscribe();
    }
}
