import { Component, Input } from '@angular/core';
import { XmDynamicWidget } from '@xm-ngx/dynamic';
import { Translate } from '@xm-ngx/translation';
import * as _ from 'lodash';

export interface ExampleWidgetComponentConfig {
    title: Translate
}

export const EXAMPLE_WIDGET_COMPONENT_DEFAULT_CONFIG: ExampleWidgetComponentConfig = {
    title: 'Example widget',
};

@Component({
    selector: 'xm-example-widget',
    templateUrl: './example-widget.component.html',
    styleUrls: ['./example-widget.component.scss'],
})
export class ExampleWidgetComponent implements XmDynamicWidget {
    private _config: ExampleWidgetComponentConfig = _.cloneDeep(EXAMPLE_WIDGET_COMPONENT_DEFAULT_CONFIG);

    public get config(): ExampleWidgetComponentConfig {
        return this._config;
    }

    @Input()
    public set config(value: ExampleWidgetComponentConfig) {
        this._config = _.defaultsDeep(value, EXAMPLE_WIDGET_COMPONENT_DEFAULT_CONFIG);
    }
}
