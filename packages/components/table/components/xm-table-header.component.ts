import { Component, Input } from '@angular/core';

import { injectByKey, XmDynamicModule } from '@xm-ngx/dynamic';
import { Translate, XmTranslatePipe, XmTranslationModule } from '@xm-ngx/translation';
import { XmTableActionsButtonsComponent } from './xm-table-actions-buttons.component';
import { MatIconModule } from '@angular/material/icon';
import { XmTableHeaderConfig, XmTableHeaderController } from './xm-table-header.model';

@Component({
    selector: 'xm-table-header',
    host: {class: 'xm-table-header'},
    template: `
        @if (config?.title && !showQuickFilterInsteadOfTitle) {
            <div class="d-flex align-items-center header-title">
                @if (config.titleIcon) {
                    <div class="header-title__icon">
                        <mat-icon>{{ config.titleIcon }}</mat-icon>
                    </div>
                }
                <h5 class="no-margin">{{ config.title | xmTranslate }}</h5>
            </div>
        }

        <ng-content></ng-content>

        @if (config?.actions) {
            <xm-table-actions-buttons
                class="push-self-right"
                [config]="config.actions"
            ></xm-table-actions-buttons>
        }

        <ng-content select="[expandPanelButton]"></ng-content>
    `,
    styles: [`
        :host(.xm-table-header) {
            display: flex;
            align-items: center;
            margin-left: 1rem;
            margin-right: 1rem;
            min-height: 48px;

            .push-self-right {
                display: flex;
                align-items: center;
                margin-left: auto;
            }

            .no-margin {
                margin: 0;
            }

            .header-title {
                & __icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 16px;
                    padding: 8px;
                    margin-right: 16px;
                    background: #ebebeb;
                }
            }
        }
    `],
    standalone: true,
    imports: [
        XmTableActionsButtonsComponent,
        XmTranslatePipe,
        XmDynamicModule,
        XmTranslationModule,
        MatIconModule,
    ],
})
export class XmTableHeaderComponent {
    public _config: XmTableHeaderConfig;
    private titleController: XmTableHeaderController = injectByKey<XmTableHeaderController>('table-title-controller', {optional: true});

    @Input()
    public set config(val: XmTableHeaderConfig) {
        const {title, actions, titleIcon} = val || {};
        const enrichedTitle: Translate = this.enrichTitle(title);

        this._config = {
            title: enrichedTitle,
            titleIcon,
            actions: actions?.map(action => {
                return {
                    ...action,
                    config: {
                        ...action.config,
                        columns: val.columns,
                    },
                };
            }),
        };
    };

    public enrichTitle(title: Translate): Translate {
        if (this.titleController?.enrichTitle) {
            return this.titleController.enrichTitle(title);
        }

        return title;
    }

    public get config(): XmTableHeaderConfig {
        return this._config;
    }

    @Input() public loading: boolean;
    @Input() public showQuickFilterInsteadOfTitle: boolean;
}
