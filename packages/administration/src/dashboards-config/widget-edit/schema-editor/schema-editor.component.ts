import {Component, Input, OnChanges, OnInit, Optional, Self, SimpleChanges} from '@angular/core';
import {NgControlAccessor} from '@xm-ngx/components/ng-accessor';
import {NgControl} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {DynamicComponentSpecEntity} from '@xm-ngx/cli';
import * as _ from 'lodash';

export interface SchemaEditorOptions {
    selector: string;
}

@Component({
    selector: 'xm-schema-editor',
    templateUrl: './schema-editor.component.html',
    styleUrls: ['./schema-editor.component.scss']
})
export class SchemaEditorComponent
    extends NgControlAccessor<object>
    implements OnInit, OnChanges {

    @Input() public options: SchemaEditorOptions;
    public componentSpecification: DynamicComponentSpecEntity[] = [];

    public schema: object;

    constructor(
        @Optional() @Self() public ngControl: NgControl,
        protected readonly httpClient: HttpClient
    ) {
        super(ngControl);
    }

    public ngOnInit(): void {
        this.httpClient.get<DynamicComponentSpecEntity[]>('/assets/specification/dynamic_components_spec_output.json')
            .subscribe(res => {
                this.componentSpecification = res;
                this.ngOnChanges({});
            });
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.options) {
            if (this.options.selector) {
                this.schema = this.componentSpecification
                    .find(i => i.selector == this.options.selector)
                    ?.configurationSchema;
            } else
                this.schema = null;
        }
    }

    public changeBridge(value: object): void {
        // WORKAROUND: AJSF has a bug. After the data change it set `{}` with `value` interchangeable 5 times.
        if (_.isEmpty(value)) {
            return;
        }

        if (_.isEqual(this.value, value)) {
            return;
        }

        this.change(value);
    }

}
