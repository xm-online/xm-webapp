import { Component, Input, OnInit } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { NgForOf } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { Defaults } from '@xm-ngx/shared/operators';
import { XmTheme, XmThemeController } from '@xm-ngx/core/theme';
import { cloneDeep, find } from 'lodash';
import { finalize } from 'rxjs';
import { AppearanceStrategy } from '@xm-ngx/core/theme/src/interfaces/xm.theme';

export interface XmAppearanceThemeWidgetConfig {
    themes: XmTheme[];
}

export const XM_APPEARANCE_THEME_WIDGET_CONFIG_DEFAULT: XmAppearanceThemeWidgetConfig = {
    themes: [
        { name: 'red', lightTheme: 'red', darkTheme: 'example-dark', themeStrategy: 'THEME', themeColor: '#F44336', appearanceStrategy: 'auto' },
        { name: 'pink', lightTheme: 'pink', darkTheme: 'example-dark', themeStrategy: 'THEME', themeColor: '#E91E63', appearanceStrategy: 'auto' },
        { name: 'purple', lightTheme: 'purple', darkTheme: 'example-dark', themeStrategy: 'THEME', themeColor: '#9C27B0', appearanceStrategy: 'auto' },
        { name: 'deep-purple', lightTheme: 'deep-purple', darkTheme: 'example-dark', themeStrategy: 'THEME', themeColor: '#673AB7', appearanceStrategy: 'auto' },
        { name: 'indigo', lightTheme: 'indigo', darkTheme: 'example-dark', themeStrategy: 'THEME', themeColor: '#3F51B5', appearanceStrategy: 'auto' },
        { name: 'blue', lightTheme: 'blue', darkTheme: 'example-dark', themeStrategy: 'THEME', themeColor: '#2196f3', appearanceStrategy: 'auto' },
        { name: 'light-blue', lightTheme: 'light-blue', darkTheme: 'example-dark', themeStrategy: 'THEME', themeColor: '#03A9F4', appearanceStrategy: 'auto' },
        { name: 'cyan', lightTheme: 'cyan', darkTheme: 'example-dark', themeStrategy: 'THEME', themeColor: '#00BCD4', appearanceStrategy: 'auto' },
        { name: 'teal', lightTheme: 'teal', darkTheme: 'example-dark', themeStrategy: 'THEME', themeColor: '#009688', appearanceStrategy: 'auto' },
        { name: 'green', lightTheme: 'green', darkTheme: 'example-dark', themeStrategy: 'THEME', themeColor: '#4CAF50', appearanceStrategy: 'auto' },
        { name: 'light-green', lightTheme: 'light-green', darkTheme: 'example-dark', themeStrategy: 'THEME', themeColor: '#8BC34A', appearanceStrategy: 'auto' },
        { name: 'lime', lightTheme: 'lime', darkTheme: 'example-dark', themeStrategy: 'THEME', themeColor: '#CDDC39', appearanceStrategy: 'auto' },
        { name: 'yellow', lightTheme: 'yellow', darkTheme: 'example-dark', themeStrategy: 'THEME', themeColor: '#FFEB3B', appearanceStrategy: 'auto' },
        { name: 'amber', lightTheme: 'amber', darkTheme: 'example-dark', themeStrategy: 'THEME', themeColor: '#ffc107', appearanceStrategy: 'auto' },
        { name: 'orange', lightTheme: 'orange', darkTheme: 'example-dark', themeStrategy: 'THEME', themeColor: '#FF9800', appearanceStrategy: 'auto' },
        { name: 'deep-orange', lightTheme: 'deep-orange', darkTheme: 'example-dark', themeStrategy: 'THEME', themeColor: '#FF5722', appearanceStrategy: 'auto' },
        { name: 'brown', lightTheme: 'brown', darkTheme: 'example-dark', themeStrategy: 'THEME', themeColor: '#795548', appearanceStrategy: 'auto' },
        { name: 'grey', lightTheme: 'grey', darkTheme: 'example-dark', themeStrategy: 'THEME', themeColor: '#9E9E9E', appearanceStrategy: 'auto' },
        { name: 'blue-grey', lightTheme: 'blue-grey', darkTheme: 'example-dark', themeStrategy: 'THEME', themeColor: '#607d8b', appearanceStrategy: 'auto' },
        { name: 'example', lightTheme: 'example', darkTheme: 'example-dark', themeStrategy: 'THEME', themeColor: '#FFEB3B', appearanceStrategy: 'auto' },
    ],
};

@Component({
    selector: 'xm-appearance-theme-widget',
    template: `
        <mat-card class="mb-3">
            <div mat-card-title>Appearance</div>

            <h6>Appearance:</h6>
            <mat-radio-group [(ngModel)]="appearanceStrategy"
                             [disabled]="loading"
                             class="grid-flow mb-3"
                             (ngModelChange)="updateTheme()">
                <mat-radio-button [value]="'light'">{{'light'}}</mat-radio-button>
                <mat-radio-button [value]="'dark'">{{'dark'}}</mat-radio-button>
                <mat-radio-button [value]="'auto'">{{'auto'}}</mat-radio-button>
            </mat-radio-group>

            <h6>Accent color:</h6>
            <mat-radio-group [(ngModel)]="selectedTheme"
                             [disabled]="loading"
                             (ngModelChange)="updateTheme()"
                             class="grid-flow"
                             aria-label="Select an option">
                <mat-radio-button *ngFor="let theme of config.themes"
                                  class="color-container"
                                  [style.--theme-fill-color]="theme.themeColor"
                                  [value]="theme">{{theme.name}}</mat-radio-button>
            </mat-radio-group>

        </mat-card>
    `,
    standalone: true,
    styleUrls: ['./xm-user-appearance-theme-widget.component.scss'],
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
    public selectedTheme: XmTheme;
    public appearanceStrategy: AppearanceStrategy;

    constructor(
        private themeManager: XmThemeController,
    ) {
    }

    public ngOnInit(): void {
        const activeTheme = this.themeManager.get();
        if(activeTheme == null){
            return;
        }

        this.selectedTheme = find(this.config.themes, {name: activeTheme.name});
        this.appearanceStrategy = this.selectedTheme.appearanceStrategy;
    }

    public updateTheme(): void {
        if (this.loading) {
            return;
        }

        const theme = cloneDeep(this.selectedTheme);
        theme.appearanceStrategy = this.appearanceStrategy;

        this.loading = true;
        this.themeManager.set(theme)
            .pipe(finalize(() => this.loading = false))
            .subscribe();
    }
}
