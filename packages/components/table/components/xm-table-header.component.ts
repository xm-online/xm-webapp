import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';

import { XmDynamicPresentationLayout } from '@xm-ngx/dynamic';
import { Translate, XmTranslatePipe } from '@xm-ngx/translation';
import { XmTableFilterButtonComponent } from './xm-table-filter-button.component';
import { XmTableFilterChipsComponent } from './xm-table-filter-chips.component';
import { XmTableActionsButtonsComponent } from './xm-table-actions-buttons.component';
import { XmTableColumn } from '../columns/xm-table-column-dynamic-cell.component';

export interface XmTableHeaderConfig {
    actions: XmDynamicPresentationLayout[],
    title: Translate;
    columns?: XmTableColumn[];
}

@Component({
    selector: 'xm-table-header',
    host: {class: 'xm-table-header'},
    template: `
        <div *ngIf="config?.title">
            <h5 class="no-margin">{{config.title | xmTranslate }}</h5>
        </div>

        <ng-content></ng-content>

        <ng-container *ngIf="config?.actions">
            <xm-table-actions-buttons
                class="push-self-right"
                [config]="config.actions"></xm-table-actions-buttons>
        </ng-container>

        <ng-content select="[expandPanelButton]"></ng-content>
    `,
    styles: [`
        :host(.xm-table-header) {
            display: flex;
            align-items: center;
            margin-left: 1rem;
            margin-right: 1rem;
            min-height: 48px;
        }

        :host(.xm-table-header) .push-self-right {
            display: flex;
            align-items: center;
            margin-left: auto;
        }

        :host(.xm-table-header) .no-margin {
            margin: 0;
        }
    `],
    standalone: true,
    imports: [
        NgIf,
        XmTableActionsButtonsComponent,
        XmTableFilterButtonComponent,
        XmTableFilterChipsComponent,
        XmTranslatePipe,
        XmTableFilterButtonComponent,
        XmTableFilterChipsComponent,
        XmTableActionsButtonsComponent,
        XmTableFilterButtonComponent,
        XmTableFilterChipsComponent,
        XmTableActionsButtonsComponent,
    ],
})
export class XmTableHeaderComponent {
    public _config: XmTableHeaderConfig;

    @Input()
    public set config(val: XmTableHeaderConfig) {
        this._config = {
            title: val.title,
            actions: val.actions.map(action => {
                return {
                    ...action,
                    config: {
                        ...action.config,
                        columns: val.columns
                    },
                };
            })
        };
    };

    public get config(): XmTableHeaderConfig {
        return this._config;
    }

    @Input() public loading: boolean;
}
