import { Component, Input } from '@angular/core';
import { XmDynamicWidget } from '@xm-ngx/dynamic';
import { Translate } from '@xm-ngx/translation';
import { CommonModule } from '@angular/common';
import { Defaults } from '@xm-ngx/shared/operators';

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
    standalone: true,
    imports: [CommonModule],
})
export class ExampleWidgetComponent implements XmDynamicWidget {
    @Input() @Defaults(EXAMPLE_WIDGET_COMPONENT_DEFAULT_CONFIG)
    public config: ExampleWidgetComponentConfig;
}
