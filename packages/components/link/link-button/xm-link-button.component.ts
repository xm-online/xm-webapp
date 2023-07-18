import { Component, Input } from '@angular/core';
import * as _ from 'lodash';
import { clone } from 'lodash';
import { MAT_FAB_DEFAULT_CONFIG, MatFabConfig } from '@xm-ngx/components/mat-fab';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { IfDashboardSlugModule } from '@xm-ngx/components/if-dashboard-slug';
import { XmPermissionModule } from '@xm-ngx/core/permission';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

export interface XmLinkButtonOptions extends MatFabConfig {
    title: Translate
}

export const XM_LINK_BUTTON_DEFAULT_OPTIONS = {
    ...MAT_FAB_DEFAULT_CONFIG,
    title: '',
};

@Component({
    selector: 'xm-link-button',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        IfDashboardSlugModule,
        XmPermissionModule,
        MatTooltipModule,
        RouterModule,
        MatIconModule,
        XmTranslationModule,
    ],
    templateUrl: './xm-link-button.component.html',
})
export class XmLinkButtonComponent {

    private _config: XmLinkButtonOptions = clone(XM_LINK_BUTTON_DEFAULT_OPTIONS);

    public get config(): XmLinkButtonOptions {
        return this._config;
    }

    @Input()
    public set config(value: XmLinkButtonOptions) {
        this._config = _.defaults({}, value, XM_LINK_BUTTON_DEFAULT_OPTIONS);
    }
}
