import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DASHBOARDS_TRANSLATES } from '@xm-ngx/administration/dashboards-config';
import { WidgetConfig } from '@xm-ngx/dynamic';

@Component({
    selector: 'xm-widget-view',
    templateUrl: './widget-view.component.html',
    styleUrls: ['./widget-view.component.scss'],
})
export class WidgetViewComponent {
    public TRS: typeof DASHBOARDS_TRANSLATES = DASHBOARDS_TRANSLATES;

    public formGroup: FormGroup;
    public widgetConfig: WidgetConfig;

    constructor(private fb: FormBuilder) {
        this.formGroup = this.fb.group({
            selector: [''],
            config: [''],
        });
    }

    public updateValue(): void {
        const form = this.formGroup.getRawValue();
        this.widgetConfig = {
            selector: form.selector,
            config: form.config,
            component: null,
            module: null,
        };
    }

}
