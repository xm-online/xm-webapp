import { Component, Input, NgModule, OnInit, Type, ViewChild } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { HintModule, HintText } from '@xm-ngx/components/hint';
import { NgFormAccessor } from '@xm-ngx/components/ng-accessor';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XmTranslationModule } from '@xm-ngx/translation';
import { XmDynamicEntryModule } from '@xm-ngx/dynamic';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatPseudoCheckboxModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

export interface XmMultiSelectConfig {
    title?: string;
    required?: boolean;
    defaultSelectedAll?: boolean;
    feedback?: string;
    disabled: boolean;
    selected?: string[];
    enum?: string[];
    valueKey?: string;
    titleKey?: string;
    hint?: HintText;
}

export type XmMultiSelectConfigOptional = XmMultiSelectConfig | null;

interface XmMultiSelectItem {
    valueKey: string;
    titleKey: string;
}

type XmMultiSelectItemOrString = XmMultiSelectItem | string;

@Component({
    selector: 'xm-multi-select-control',
    template: `
        <mat-form-field [ngClass]="{ 'mat-form-field-disabled': disabled }" class="label-touchable">
            <mat-label>
                <span class="pr-2">{{ config?.title | translate }}</span>
                <mat-icon *ngIf="config.feedback" [matTooltip]="config?.feedback | translate">help</mat-icon>
            </mat-label>

            <mat-select multiple
                        [formControl]="control"
                        [panelClass]="allItemsSelected() ? 'allSelected' : ''"
                        [style.background]="'transparent'"
                        (selectionChange)="change($event.value)"
            >

                <mat-select-trigger>
                    <ng-container *ngIf="allItemsSelected(); else someSelected">
                        {{ 'xm-enum.all' | translate }}
                    </ng-container>

                    <ng-template #someSelected>
                        {{ (selectedLength ? selectedValues[0] : '') | translate }}
                        <span *ngIf="selectedLength > 1" class="small">
          (+{{selectedLength - 1}} {{(selectedLength === 2 ? 'xm-enum.other' : 'xm-enum.others')  | translate}}
                            )
        </span>
                    </ng-template>
                </mat-select-trigger>

                <div [attr.disabled]="disabled"
                     [ngClass]="{
                        'mat-active': allItemsSelected(),
                        'mat-option-disabled': disabled
                     }"
                     class="mat-option mat-option-multiple mat-select-trigger"
                     (click)="toggleAll()">

                    <mat-pseudo-checkbox
                        class="mat-option-pseudo-checkbox"
                        [disabled]="disabled"
                        [state]="allItemsSelected() ? 'checked' : 'unchecked'"></mat-pseudo-checkbox>

                    <span class="mat-option-text">{{ 'xm-enum.all' | translate }}</span>
                </div>

                <mat-option *ngFor="let item of items"
                            class="multiselect-option"
                            [disabled]="disabled"
                            [value]="item?.valueKey">
                    {{ item?.titleKey | translate  }}
                </mat-option>

            </mat-select>

            <mat-hint [hint]="config?.hint"></mat-hint>
        </mat-form-field>
        <mat-error *ngIf="required && selectedValues.length === 0 && control.touched">
            {{ 'entity.validation.required' | translate }}
        </mat-error>
    `,
    styleUrls: ['./multi-select.component.scss'],
})
export class XmMultiSelectControlComponent extends NgFormAccessor<string[]> implements OnInit {
    private _config: XmMultiSelectConfigOptional;

    @Input() set config(config: XmMultiSelectConfigOptional) {
        this._config = _.defaultsDeep(config, {
            defaultSelectedAll: false,
            disabled: false,
            required: false,
            selected: [],
            enum: [],
        });

        this._syncControl();
    }
    get config(): XmMultiSelectConfigOptional {
        return this._config;
    }

    @Input() set required(value: boolean) {
        value
            ? this.control.addValidators(Validators.required)
            : this.control.removeValidators(Validators.required);
    }
    get required(): boolean {
        return this.control.hasValidator(Validators.required);
    }

    @Input()
    public selected(value: XmMultiSelectItemOrString[]): void {
        this.change(this._toModel(value));
    }

    public get selectedValues(): string[] {
        return this.control.value;
    }

    public get selectedLength(): number {
        return this.selectedValues?.length;
    }

    @ViewChild(MatSelect, {static: false}) public matSelect: MatSelect;

    public items: XmMultiSelectItem[] = [];

    public ngOnInit(): void {
        this._syncControl();
    }

    public allItemsSelected(): boolean {
        return this.items?.length === this.value?.length;
    }

    public toggleAll(): void {
        this.allItemsSelected()
            ? this.deselectAll()
            : this.selectAll();
    }

    public selectAll(): void {
        if (this.disabled) {
            return;
        }

        this.change(this.config.enum);
    }

    public deselectAll(): void {
        if (this.disabled) {
            return;
        }

        this.change([]);
    }

    public writeValue(value: string[]): void {
        value = this._toModel(value);
        super.writeValue(value);
    }

    private _syncControl() {
        if (this.config == null) {
            return;
        }

        this.disabled = coerceBooleanProperty(this.config?.disabled);
        this.required = coerceBooleanProperty(this.config?.required);

        if (this.config.defaultSelectedAll) {
            this.selectAll();
        }

        this.items = this._toView(this.config.enum);
    }

    private _toView(value: XmMultiSelectItemOrString[]): XmMultiSelectItem[] {
        return (value ?? []).map(item => {
            const valueKey = _.get(item, this.config?.valueKey, item);
            const titleKey = _.get(item, this.config?.titleKey, item);

            return {
                valueKey,
                titleKey,
            };
        });
    }

    private _toModel(value: XmMultiSelectItemOrString[]): string[] {
        return (value ?? []).map(item => {
            return _.get(item, this.config?.valueKey, item);
        }).filter(value => !!value);
    }
}

@NgModule({
    declarations: [ XmMultiSelectControlComponent ],
    exports: [ XmMultiSelectControlComponent ],
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatPseudoCheckboxModule,
        ControlErrorModule,
        XmTranslationModule,
        MatTooltipModule,
        HintModule,
        MatSelectModule,
        ReactiveFormsModule,
    ],
})
export class XmMultiSelectControlModule implements XmDynamicEntryModule {
    public entry: Type<XmMultiSelectControlComponent> = XmMultiSelectControlComponent;
}
