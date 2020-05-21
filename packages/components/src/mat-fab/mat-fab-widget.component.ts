import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IWidget } from '@xm-ngx/dynamic';
import * as _ from 'lodash';

interface FabConfig {
    navigateTo: string;
    icon?: string;
    indent?: boolean;
    color?: string;
    permitted?: string | string[];
}

const DEFAULT_FAB_CONFIG: FabConfig = {
    navigateTo: '',
    icon: 'add',
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
    constructor(private router: Router) {
    }

    private _config: FabConfig;

    public get config(): FabConfig {
        return this._config;
    }

    @Input()
    public set config(value: FabConfig) {
        this._config = _.defaults(value, DEFAULT_FAB_CONFIG);
    }

    public onClick(): void {
        this.router.navigate([this.config.navigateTo]);
    }

}
