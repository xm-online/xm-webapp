import { Component, Input, OnChanges, OnInit, Optional, Self, SimpleChanges } from '@angular/core';
import { NgControlAccessor } from '@xm-ngx/components/ng-accessor';
import { NgControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DynamicComponentSpecEntity } from '@xm-ngx/cli';
import Ajv from 'ajv';

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

    public entity?: DynamicComponentSpecEntity;
    public errors: object[];

    constructor(
        @Optional() @Self() public ngControl: NgControl,
        protected readonly httpClient: HttpClient
    ) {
        super(ngControl);
    }

    public entityAsString = (): string => JSON.stringify(this.entity, null, 2);

    public ngOnInit(): void {
        this.httpClient.get<DynamicComponentSpecEntity[]>('/assets/specification/dynamic_components_spec_output.json')
            .subscribe(res => {
                this.componentSpecification = res;
                this.ngOnChanges(null);
            });
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (this.options.selector) {
            this.entity = this.componentSpecification
                .find(i => i.selector == this.options.selector);
        } else
            this.entity = null;

        if (!this.entity) {
            return;
        }
        const ajv = new Ajv({
            allErrors: true,
            verbose: true,
            strict: true,
        });

        const validate = ajv.compile(this.entity.configurationSchema);
        validate(this.value);
        this.errors = validate.errors;
    }

    public override writeValue(value: object): void {
        super.writeValue(value);
        this.ngOnChanges(null);
    }
}
