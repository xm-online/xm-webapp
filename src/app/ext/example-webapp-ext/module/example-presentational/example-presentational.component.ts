import {Component, OnInit} from '@angular/core';
import {XmDynamicPresentation} from "@xm-ngx/dynamic";
import {Translate} from "@xm-ngx/translation";
import {Defaults} from "@xm-ngx/shared/operators";

export interface ExamplePresentationalComponentConfig {
    title: Translate
}

export const EXAMPLE_PRESENTATIONAL_COMPONENT_DEFAULT_CONFIG: ExamplePresentationalComponentConfig = {
    title: 'Example presentational',
};

@Component({
    selector: 'xm-example-presentational',
    templateUrl: './example-presentational.component.html',
    styleUrls: ['./example-presentational.component.scss']
})
export class ExamplePresentationalComponent implements XmDynamicPresentation<null, ExamplePresentationalComponentConfig> {
    @Input() @Defaults(null)
    public value: null;

    @Input() @Defaults(EXAMPLE_PRESENTATIONAL_COMPONENT_DEFAULT_CONFIG)
    public config: ExamplePresentationalComponentConfig;
}
