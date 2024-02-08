import { Component, Input, OnChanges, OnInit, Optional, Self, SimpleChanges } from '@angular/core';
import { NgControlAccessor } from '@xm-ngx/components/ng-accessor';
import { NgControl, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DynamicComponentSpecEntity } from '@xm-ngx/cli';

import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { getSchema } from './schema-formly-ext';

export interface SchemaEditorOptions {
    selector: string;
}

@Component({
    selector: 'xm-schema-editor',
    templateUrl: './schema-editor.component.html',
    styleUrls: ['./schema-editor.component.scss'],
    standalone: true,
    imports: [
        FormlyMaterialModule,
        FormlyModule,
        ReactiveFormsModule,
    ],
})
export class SchemaEditorComponent
    extends NgControlAccessor<object>
    implements OnInit, OnChanges {

    public static dynamicComponentSpecEntity: DynamicComponentSpecEntity[];
    @Input() public options: SchemaEditorOptions;
    public componentSpecification: DynamicComponentSpecEntity[] = [];
    public entity?: DynamicComponentSpecEntity;
    public fields: FormlyFieldConfig[];

    constructor(
        @Optional() @Self() public ngControl: NgControl,
        private formlyJsonschema: FormlyJsonschema,
        protected readonly httpClient: HttpClient,
    ) {
        super(ngControl);
    }

    public ngOnInit(): void {
        this.httpClient.get<DynamicComponentSpecEntity[]>('/assets/specification/dynamic_components_spec_output.json')
            .subscribe(res => {
                this.componentSpecification = res;
                SchemaEditorComponent.dynamicComponentSpecEntity = res;
                this.ngOnChanges(null);
            });
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (this.options.selector) {
            this.entity = this.componentSpecification
                .find(i => i.selector == this.options.selector || i.alternativeSelector == this.options.selector);

            this.fields = this.entity
                ? getSchema(this.formlyJsonschema, this.entity.configurationSchema)
                : [];
        } else
            this.entity = null;
    }

    public changeBridge(value: object): void {
        this.change(value);
    }
}

