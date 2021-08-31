import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { NgFormAccessor } from '@xm-ngx/components/ng-accessor';
import { XmDynamicControl } from '@xm-ngx/dynamic';
import { DataQa } from '@xm-ngx/shared/interfaces';
import { Translate } from '@xm-ngx/translation';
import { clone, defaults, forEach, keyBy } from 'lodash';
import { XmEnumOptionsItem, XmEnumValue } from '../value/xm-enum.component';
import { XmEnumViewOptions } from '../view/xm-enum-view';


export interface XmEnumControlOptions extends XmEnumViewOptions, DataQa {
    id?: string;
    required?: boolean;
    /** @deprecated use {@link items} instead */
    enum?: XmEnumControlOptionsItem[];
    items: XmEnumControlOptionsItem[];
    showClearButton?: boolean;
    clearButtonText?: Translate | string;
    multiple?: boolean;
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
    showClearButton: false,
    clearButtonText: 'admin-config.common.cancel',
    multiple: false,
};

@Component({
    selector: 'xm-enum-control',
    template: `
        <mat-form-field>
            <mat-select [formControl]="control"
                        [required]="options.required"
                        [id]="options.id"
                        [multiple]="options.multiple"
                        [attr.data-qa]="options.dataQa"
                        [placeholder]="options?.title | translate">
                <mat-select-trigger>
                    <ng-container *ngIf="options.multiple; else singleSelection">
                        <ng-container *ngIf="itemsMap && itemsMap[value[0] + '']">
                            <mat-icon style="vertical-align: middle"
                                      *ngIf="itemsMap[value[0] + '']?.icon">{{itemsMap[value[0] + ''].icon}}</mat-icon>
                            {{(itemsMap[value[0] + ''].title | translate) || ''}}
                        </ng-container>
                        <span *ngIf="control.value?.length > 1" class="small">
                        (+{{control.value?.length - 1}} {{(control.value?.length === 2 ? "xm-enum.other" : "xm-enum.others")  | translate}})
                        </span>
                    </ng-container> 

                    <ng-template #singleSelection>
                        <ng-container *ngIf="itemsMap && itemsMap[value + '']">
                            <mat-icon style="vertical-align: middle"
                                      *ngIf="itemsMap[value + '']?.icon">{{itemsMap[value + ''].icon}}</mat-icon>
                            {{(itemsMap[value + ''].title | translate) || ''}}
                        </ng-container>
                    </ng-template>


                </mat-select-trigger>

                <ng-container *ngIf="options.showClearButton">
                    <mat-option [hidden]="value === undefined || value === null || value === ''">
                        <mat-icon>close</mat-icon>
                        {{ options.clearButtonText | translate}}
                    </mat-option>
                </ng-container>

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
export class XmEnumControlComponent
    extends NgFormAccessor<XmEnumValue | XmEnumValue[]>
    implements XmDynamicControl<XmEnumValue | XmEnumValue[], XmEnumControlOptions> {
    public itemsList: XmEnumControlOptionsItem[];
    public itemsMap: {[value: string]: XmEnumControlOptionsItem};
    private _options: XmEnumControlOptions = clone(XM_ENUM_CONTROL_OPTIONS_DEFAULT);

    public get options(): XmEnumControlOptions {
        return this._options;
    }

    @Input()
    public set options(value: XmEnumControlOptions) {
        this._options = defaults({}, value, XM_ENUM_CONTROL_OPTIONS_DEFAULT);
        this.itemsList = value.items || value.enum;
        forEach(this.itemsList, (item) => {
            if (item.value === undefined) {
                item.value = '';
            }
        });
        this.itemsMap = keyBy(this.itemsList, 'value');

        if (value?.enum) {
            console.warn('"enum" is deprecated use "items" instead!');
        }
    }
}
