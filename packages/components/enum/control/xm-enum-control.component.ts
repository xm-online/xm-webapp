import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { XmEnumOptionsItem } from '../value/xm-enum.component';
import { NgFormAccessor } from '@xm-ngx/components/ng-accessor';
import { XmDynamicControl } from '@xm-ngx/dynamic';
import { DataQa } from '@xm-ngx/shared/interfaces';
import { clone, defaults, keyBy } from 'lodash';
import { XmEnumViewOptions } from '../view/xm-enum-view';


export interface XmEnumControlOptions extends XmEnumViewOptions, DataQa {
    id?: string;
    required?: boolean;
    /** @deprecated use {@link items} instead */
    enum?: XmEnumControlOptionsItem[]
    items: XmEnumControlOptionsItem[]
}

export interface XmEnumControlOptionsItem extends XmEnumOptionsItem {
    icon?: string;
    permissions?: string[];
}

export const XM_ENUM_CONTROL_OPTIONS_DEFAULT: XmEnumControlOptions = {
    title: '',
    dataQa: 'enum-control',
    required: false,
    enum: [],
    items: [],
};

@Component({
    selector: 'xm-enum-control',
    template: `
        <mat-form-field>
            <mat-select [formControl]="control"
                        [required]="options.required"
                        [id]="options.id"
                        [attr.data-qa]="options.dataQa"
                        [placeholder]="options?.title | translate">
                <mat-select-trigger>
                    <ng-container *ngIf="(value !== undefined) && itemsMap[value]">
                        <mat-icon style="vertical-align: middle"
                                  *ngIf="itemsMap[value]?.icon">{{itemsMap[value].icon}}</mat-icon>
                        {{(itemsMap[value].title | translate) || ''}}
                    </ng-container>
                </mat-select-trigger>

                <ng-template ngFor [ngForOf]="itemsList" let-item>
                    <mat-option [value]="item.value" *xmPermission="item.permissions || []">
                        <mat-icon *ngIf="item.icon">{{item.icon}}</mat-icon>
                        {{item.title | translate}}
                    </mat-option>
                </ng-template>
            </mat-select>

            <mat-error *xmControlErrors="control?.errors; message as message">{{message}}</mat-error>
        </mat-form-field>
    `,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class XmEnumControlComponent extends NgFormAccessor<string> implements XmDynamicControl<string, XmEnumControlOptions> {
    public itemsList: XmEnumControlOptionsItem[];
    public itemsMap: { [value: string]: XmEnumControlOptionsItem };
    private _options: XmEnumControlOptions = clone(XM_ENUM_CONTROL_OPTIONS_DEFAULT);

    public get options(): XmEnumControlOptions {
        return this._options;
    }

    @Input()
    public set options(value: XmEnumControlOptions) {
        this._options = defaults({}, value, XM_ENUM_CONTROL_OPTIONS_DEFAULT);
        this.itemsList = value.items || value.enum;
        this.itemsMap = keyBy(this.itemsList, 'value');

        if (value?.enum) {
            console.warn('"enum" is deprecated use "items" instead!');
        }
    }
}
