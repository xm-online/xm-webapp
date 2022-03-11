import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { NgFormAccessor } from '@xm-ngx/components/ng-accessor';
import { XmDynamicControl } from '@xm-ngx/dynamic';
import { DataQa } from '@xm-ngx/shared/interfaces';
import { clone, defaults, forEach, keyBy } from 'lodash';
import { XmEnumControlOptionsItem } from '../control/xm-enum-control.component';
import { XmEnumValue } from '../value/xm-enum.component';
import { XmEnumViewOptions } from '../view/xm-enum-view';
import { HintText } from '@xm-ngx/components/hint';

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
            <mat-select [formControl]="control"
                        [required]="options.required"
                        [id]="options.id"
                        [attr.data-qa]="options.dataQa"
                        [placeholder]="options?.title | translate"
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

            <mat-hint [hint]="options.hint"></mat-hint>
        </mat-form-field>
    `,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class XmMultipleEnumControlComponent
    extends NgFormAccessor<XmEnumValue[] | undefined>
    implements XmDynamicControl<XmEnumValue[] | undefined, XmMultipleEnumControlOptions> {
    public itemsList: XmEnumControlOptionsItem[];
    public itemsMap: {[value: string]: XmEnumControlOptionsItem};
    private _options: XmMultipleEnumControlOptions = clone(XM_MULTIPLE_ENUM_CONTROL_OPTIONS_DEFAULT);

    public get value(): XmEnumValue[] {
        return this._value == undefined ? [] : this._value;
    }

    @ Input()
    public set value(data: XmEnumValue[] | undefined) {
        this._value = data;
    }

    public get options(): XmMultipleEnumControlOptions {
        return this._options;
    }

    @Input()
    public set options(value: XmMultipleEnumControlOptions) {
        this._options = defaults({}, value, XM_MULTIPLE_ENUM_CONTROL_OPTIONS_DEFAULT);
        this.itemsList = value.items;
        forEach(this.itemsList, (item) => {
            if (item.value === undefined) {
                item.value = '';
            }
        });
        this.itemsMap = keyBy(this.itemsList, 'value');
    }
}
