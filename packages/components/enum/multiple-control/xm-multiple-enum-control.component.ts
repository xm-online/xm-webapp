import { ChangeDetectionStrategy, Component, Input, Optional, Self, ViewEncapsulation } from '@angular/core';
import { NgFormAccessor } from '@xm-ngx/components/ng-accessor';
import { XmDynamicControl } from '@xm-ngx/dynamic';
import { DataQa } from '@xm-ngx/interfaces';
import { clone, defaults, forEach, keyBy } from 'lodash';
import { XmEnumControlOptionsItem } from '../control/xm-enum-control.component';
import { XmEnumValue } from '../value/xm-enum.component';
import { XmEnumViewOptions } from '../view/xm-enum-view';
import { HintModule, HintText } from '@xm-ngx/components/hint';
import { XmTranslationModule } from '@xm-ngx/translation';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XmPermissionModule } from '@xm-ngx/core/permission';

export interface XmMultipleEnumControlOptions extends XmEnumViewOptions, DataQa {
    id?: string;
    required?: boolean;
    items: XmEnumControlOptionsItem[];
    hint?: HintText;
}

export const XM_MULTIPLE_ENUM_CONTROL_OPTIONS_DEFAULT: XmMultipleEnumControlOptions = {
    hint: null,
    title: '',
    dataQa: 'multiple-enum-control',
    required: false,
    items: [],
};

@Component({
    selector: 'xm-multiple-enum-control',
    template: `
        <mat-form-field>
            <mat-label>{{config?.title | translate}}</mat-label>
            <mat-select [formControl]="control"
                        [required]="config.required"
                        [id]="config.id"
                        [attr.data-qa]="config.dataQa"
                        multiple>
                <mat-select-trigger>
                    <ng-container *ngIf="itemsMap && itemsMap[value[0] + '']">
                        <mat-icon style="vertical-align: middle"
                                  *ngIf="itemsMap[value[0] + '']?.icon">{{itemsMap[value[0] + ''].icon}}</mat-icon>
                        {{(itemsMap[value[0] + ''].title | translate) || ''}}
                    </ng-container>
                    <span *ngIf="control.value?.length > 1" class="small">
                        (+{{control.value?.length - 1}} {{(control.value?.length === 2 ? "xm-enum.other" : "xm-enum.others")  | translate}}
                        )
                        </span>
                </mat-select-trigger>

                <ng-template ngFor [ngForOf]="itemsList" let-item>
                    <mat-option [value]="item.value" *xmPermission="item.permissions || []">
                        <mat-icon *ngIf="item.icon">{{item.icon}}</mat-icon>
                        {{item.title | translate}}
                    </mat-option>
                </ng-template>
            </mat-select>

            <mat-error *xmControlErrors="control?.errors; message as message">{{message}}</mat-error>

            <mat-hint [hint]="config.hint"></mat-hint>
        </mat-form-field>
    `,
    imports: [
        XmTranslationModule,
        MatFormFieldModule,
        MatSelectModule,
        FormsModule,
        MatIconModule,
        CommonModule,
        ControlErrorModule,
        ReactiveFormsModule,
        XmPermissionModule,
        HintModule,
    ],
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class XmMultipleEnumControl
    extends NgFormAccessor<XmEnumValue[] | undefined>
    implements XmDynamicControl<XmEnumValue[] | undefined, XmMultipleEnumControlOptions> {
    public itemsList: XmEnumControlOptionsItem[];
    public itemsMap: {[value: string]: XmEnumControlOptionsItem};
    private _config: XmMultipleEnumControlOptions = clone(XM_MULTIPLE_ENUM_CONTROL_OPTIONS_DEFAULT);

    constructor(@Optional() @Self() public ngControl: NgControl) {
        super(ngControl);
    }
    public get value(): XmEnumValue[] {
        return this._value == undefined ? [] : this._value;
    }

    @Input()
    public set value(data: XmEnumValue[] | undefined) {
        this._value = data;
    }

    public get config(): XmMultipleEnumControlOptions {
        return this._config;
    }

    @Input()
    public set config(value: XmMultipleEnumControlOptions) {
        this._config = defaults({}, value, XM_MULTIPLE_ENUM_CONTROL_OPTIONS_DEFAULT);
        this.itemsList = value.items;
        forEach(this.itemsList, (item) => {
            if (item.value === undefined) {
                item.value = '';
            }
        });
        this.itemsMap = keyBy(this.itemsList, 'value');
    }
}
