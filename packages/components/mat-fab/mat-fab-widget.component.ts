import { Component, Input } from '@angular/core';
import { ThemePalette } from '@angular/material/core/common-behaviors/color';
import { IWidget } from '@xm-ngx/dynamic';
import { Translate } from '@xm-ngx/translation';
import * as _ from 'lodash';

export interface MatFabConfigBase {
    icon?: string;
    tooltip?: Translate;
    indent?: boolean;
    color?: ThemePalette;
    permitted?: string | string[];
    permittedByDashboardSlug?: string;
}

export interface MatFabConfig extends MatFabConfigBase {
    navigateTo: string | string[];
}

export const MAT_FAB_DEFAULT_CONFIG: MatFabConfig = {
    navigateTo: '',
    icon: 'add',
    tooltip: 'dashboard-config-widget.create',
    indent: true,
    color: 'primary',
    // ACCOUNT.ACTIVATE is default permission available for all authed users
    permitted: 'ACCOUNT.ACTIVATE',
};

@Component({
    selector: 'xm-mat-fab',
    templateUrl: './mat-fab-widget.component.html',
    styleUrls: ['./mat-fab-widget.component.scss'],
})
export class MatFabWidget implements IWidget<MatFabConfig> {
    private _config: MatFabConfig;

    public get config(): MatFabConfig {
        return this._config;
    }

    @Input()
    public set config(value: MatFabConfig) {
        this._config = _.defaults({}, value, MAT_FAB_DEFAULT_CONFIG);
    }

}
