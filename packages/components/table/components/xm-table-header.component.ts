import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';

import { XmDynamicPresentationLayout } from '@xm-ngx/dynamic';
import { Translate, XmTranslatePipe } from '@xm-ngx/translation';
import { XmTableFilterButtonComponent } from './xm-table-filter-button.component';
import { XmTableFilterChipsComponent } from './xm-table-filter-chips.component';
import { XmTableActionsButtonsComponent } from './xm-table-actions-buttons.component';
import { XmTableFiltersControlRequestConfig } from './xm-table-filter-button-dialog-controls.component';

@Component({
    selector: 'xm-table-header',
    host: { class: 'xm-table-header' },
    template: `
        <div *ngIf="config.title">
            <h5 class="no-margin">{{config.title | xmTranslate }}</h5>
        </div>

        <xm-table-filter-button [config]="config"
                                [loading]="loading"
        ></xm-table-filter-button>

        <xm-table-filter-chips [config]="config"></xm-table-filter-chips>

        <xm-table-actions-buttons
            class="push-self-right"
            [config]="config.actions"></xm-table-actions-buttons>
    `,
    styles: [`
        :host(.xm-table-header) {
            display: flex;
            align-items: center;
            margin-left: 1rem;
            margin-right: 1rem;
        }

        :host(.xm-table-header) .push-self-right {
            display: block;
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
        XmTableActionsButtonsComponent
    ]
})
export class XmTableHeaderComponent {
    @Input() public config: XmTableFiltersControlRequestConfig
        & { actions: XmDynamicPresentationLayout[] }
        & { title: Translate }
    ;
    @Input() public loading: boolean;
}
