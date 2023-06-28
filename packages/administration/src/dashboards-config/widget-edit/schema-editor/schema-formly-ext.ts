import { ChangeDetectorRef, Component, ModuleWithProviders } from '@angular/core';
import { FieldArrayType, FieldType, FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import {
    SelectorTextControlComponent,
} from '@xm-ngx/administration/dashboards-config/widget-edit/selector-text-control/selector-text-control.component';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import {
    SchemaEditorComponent,
} from '@xm-ngx/administration/dashboards-config/widget-edit/schema-editor/schema-editor.component';
import { FormsModule } from '@angular/forms';
import { FormlyMaterialModule } from '@ngx-formly/material';
import _ from 'lodash';

export function getSchema(formlyJsonschema: FormlyJsonschema, configurationSchema: any): FormlyFieldConfig[] {
    return [formlyJsonschema.toFieldConfig(configurationSchema, {
        map: (m, f) => {
            if (f['isSelectorConfig']) {
                m.type = 'config';
                _.filter(m.fieldGroup, i =>
                    i.key === 'config'
                    || i.key === 'options'
                ).forEach(i => {
                    i.type = 'object';
                    delete i.defaultValue;
                });
            }

            return m;
        },
    })];
}

@Component({
    standalone: true,
    selector: 'formly-array-type',
    template: `
        <div class="mb-3">
            <legend *ngIf="props.label">{{ props.label }}</legend>
            <p *ngIf="props.description">{{ props.description }}</p>
            <div class="d-flex flex-row-reverse">
                <button class="btn btn-primary" type="button" (click)="add()">+</button>
            </div>
            <div class="alert alert-danger" role="alert" *ngIf="showError && formControl.errors">
                <formly-validation-message [field]="field"></formly-validation-message>
            </div>
            <div *ngFor="let field of field.fieldGroup; let i = index" class="row align-items-start">
                <formly-field class="col" [field]="field"></formly-field>
                <div *ngIf="field.props.removable !== false" class="col-2 text-right">
                    <button class="btn btn-danger" type="button" (click)="remove(i)">-</button>
                </div>
            </div>
        </div> `,
    imports: [
        NgIf,
        FormlyModule,
        NgForOf,
    ],
})
export class ArrayTypeComponent extends FieldArrayType {
}

@Component({
    standalone: true,
    selector: 'formly-object-type',
    template: `
        <div class="mb-3">
            <legend *ngIf="props.label">{{ props.label }}</legend>
            <p *ngIf="props.description">{{ props.description }}</p>
            <div class="alert alert-danger" role="alert" *ngIf="showError && formControl.errors">
                <formly-validation-message [field]="field"></formly-validation-message>
            </div>
            <formly-field *ngFor="let f of field.fieldGroup" [field]="f"></formly-field>
        </div> `,
    imports: [
        NgIf,
        FormlyModule,
        NgForOf,
    ],
})
export class ObjectTypeComponent extends FieldType {
}

@Component({
    standalone: true,
    selector: 'formly-multi-schema-type',
    template: `
        <div class="card mb-3">
            <div class="card-body">
                <legend *ngIf="props.label">{{ props.label }}</legend>
                <p *ngIf="props.description">{{ props.description }}</p>
                <div class="alert alert-danger" role="alert" *ngIf="showError && formControl.errors">
                    <formly-validation-message [field]="field"></formly-validation-message>
                </div>
                <formly-field *ngFor="let f of field.fieldGroup" [field]="f"></formly-field>
            </div>
        </div> `,
    imports: [
        NgIf,
        FormlyModule,
        NgForOf,
    ],
})
export class MultiSchemaTypeComponent extends FieldType {
}

@Component({
    standalone: true,
    selector: 'formly-multi-schema-type',
    template: `
        <!--        //TODO: copy of object-->
        <div class="mb-3">
            <legend *ngIf="props.label">{{ props.label }}</legend>
            <p *ngIf="props.description">{{ props.description }}</p>
            <div class="alert alert-danger" role="alert" *ngIf="showError && formControl.errors">
                <formly-validation-message [field]="field"></formly-validation-message>
            </div>
            <ng-container *ngFor="let f of field.fieldGroup">
                <formly-field [class.d-none]="f.key=='selector' || f.key=='options' || f.key=='config'"
                              [field]="f"></formly-field>
            </ng-container>
        </div>

        <xm-selector-text-control [ngModel]="formControl?.value?.selector || model?.selector"
                                  (valueChange)="updateSelector($event)"
                                  [options]="{ title: 'selector' }"
                                  name="selector"></xm-selector-text-control>

        <formly-form [model]="formControl?.value?.config || model?.config"
                     (modelChange)="updateConfig($event)"
                     [fields]="fields"></formly-form>

    `,
    imports: [
        NgIf,
        FormlyModule,
        NgForOf,
        JsonPipe,
        FormsModule,
        FormlyMaterialModule,
        SelectorTextControlComponent,
    ],
})
export class ConfigComponent extends FieldType {
    public fields: FormlyFieldConfig[] = [];

    constructor(
        private formlyJsonschema: FormlyJsonschema,
        private changeDetectorRef: ChangeDetectorRef,
    ) {
        super();
    }

    public updateConfig(config: any): void {
        this.formControl.patchValue({ config });
    }

    public updateSelector(selector: string): void {
        const schema = SchemaEditorComponent.dynamicComponentSpecEntity.find(i => i.selector === selector);
        if (!schema) {
            return;
        }
        if (!this.formControl.value) {
            this.formControl.patchValue({});
        }
        this.formControl.patchValue({ selector });
        this.fields = getSchema(this.formlyJsonschema, schema.configurationSchema);
        this.changeDetectorRef.detectChanges();
    }
}

@Component({ standalone: true, selector: 'formly-null-type', template: '' })
export class NullTypeComponent extends FieldType {
}


export function addWidgetEditSchema(): ModuleWithProviders<FormlyModule> {
    return FormlyModule.forRoot({
        types: [
            { name: 'null', component: NullTypeComponent, wrappers: ['form-field'] },
            { name: 'array', component: ArrayTypeComponent },
            { name: 'object', component: ObjectTypeComponent },
            { name: 'multischema', component: MultiSchemaTypeComponent },
            { name: 'config', component: ConfigComponent },
        ],
    });
}
