import { Component, Input } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { Params } from '@angular/router';
import { XmDynamicWidget } from '@xm-ngx/dynamic';
import { DataQa } from '@xm-ngx/interfaces';
import { Translate } from '@xm-ngx/translation';
import * as _ from 'lodash';
import { clone } from 'lodash';

export interface MatFabConfigBase extends DataQa {
    icon?: string;
    tooltip?: Translate;
    indent?: boolean;
    color?: ThemePalette;
    permitted?: string | string[];
    permittedByDashboardSlug?: string;
}

export interface MatFabConfig extends MatFabConfigBase {
    navigateTo: string | string[];
    queryParams?: Params;
}

export const MAT_FAB_DEFAULT_CONFIG: MatFabConfig = {
    navigateTo: '',
    icon: 'add',
    tooltip: 'dashboard-config-widget.create',
    indent: true,
    color: 'primary',
    // ACCOUNT.ACTIVATE is default permission available for all authed users
    permitted: 'ACCOUNT.ACTIVATE',
    dataQa: 'fab-button-default-key',
};

@Component({
    selector: 'xm-mat-fab',
    templateUrl: './mat-fab-widget.component.html',
    styleUrls: ['./mat-fab-widget.component.scss'],
    standalone: false,
})
export class MatFabWidget implements XmDynamicWidget {
    private _config: MatFabConfig = clone(MAT_FAB_DEFAULT_CONFIG);

    public get config(): MatFabConfig {
        return this._config;
    }

    @Input()
    public set config(value: MatFabConfig) {
        this._config = _.defaults({}, value, MAT_FAB_DEFAULT_CONFIG);
    }

}
