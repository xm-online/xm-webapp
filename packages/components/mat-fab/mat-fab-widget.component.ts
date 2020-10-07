import { Component, Input } from '@angular/core';
import { ThemePalette } from '@angular/material/core/common-behaviors/color';
import { IWidget } from '@xm-ngx/dynamic';
import { Translate } from '@xm-ngx/translation';
import * as _ from 'lodash';

interface FabConfig {
    navigateTo: string | string[];
    icon?: string;
    tooltip?: Translate;
    indent?: boolean;
    color?: ThemePalette;
    permitted?: string | string[];
    permittedByDashboardSlug?: string;
}

const DEFAULT_FAB_CONFIG: FabConfig = {
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
export class MatFabWidget implements IWidget<FabConfig> {
    private _config: FabConfig;

    public get config(): FabConfig {
        return this._config;
    }

    @Input()
    public set config(value: FabConfig) {
        this._config = _.defaults({}, value, DEFAULT_FAB_CONFIG);
    }

}
