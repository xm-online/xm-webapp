import { ChangeDetectorRef, Component } from '@angular/core';
import { FieldArrayType, FieldType, FormlyModule } from '@ngx-formly/core';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import {
    SelectorTextControlComponent
} from '@xm-ngx/administration/dashboards-config/widget-edit/selector-text-control/selector-text-control.component';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import {
    SchemaEditorComponent
} from '@xm-ngx/administration/dashboards-config/widget-edit/schema-editor/schema-editor.component';
import { FormsModule } from '@angular/forms';
import { FormlyMaterialModule } from '@ngx-formly/material';

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
        NgForOf
    ]
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
        NgForOf
    ]
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
    ]
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
            <formly-field *ngFor="let f of field.fieldGroup" [field]="f"></formly-field>
        </div>

        <xm-selector-text-control [ngModel]="formControl?.value?.selector"
                                  (valueChange)="updateSelector($event)"
                                  [options]="{ title: 'selector' }"
                                  name="selector"></xm-selector-text-control>

        <!--        // TODO: research propriate way of implementation-->
        <formly-form [model]="formControl?.value?.config"
                     (modelChange)="updateModel($event)"
                     [fields]="fields"></formly-form>

    `,
    imports: [
        NgIf,
        FormlyModule,
        NgForOf,
        JsonPipe,
        FormsModule,
        FormlyMaterialModule,
        SelectorTextControlComponent
    ]
})
export class ConfigComponent extends FieldType {
    public fields = [];

    constructor(
        private formlyJsonschema: FormlyJsonschema,
        private changeDetectorRef: ChangeDetectorRef
    ) {
        super();
    }

    public updateModel(model: any): void {
        this.formControl.value.config = model;
        this.formControl.setValue(this.formControl.value);
    }

    public updateSelector(selector: string): void {
        const schema = SchemaEditorComponent.dynamicComponentSpecEntity.find(i => i.selector === selector);
        if (!schema) {
            return;
        }
        if(!this.formControl.value){
            this.formControl.setValue({});
        }
        this.formControl.value.selector = selector;
        this.formControl.setValue(this.formControl.value);
        this.fields = [this.formlyJsonschema.toFieldConfig(schema.configurationSchema as any)];
        this.changeDetectorRef.detectChanges();
    }
}

@Component({ standalone: true, selector: 'formly-null-type', template: '', })
export class NullTypeComponent extends FieldType {
}


export function addWidgetEditSchema() {
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
