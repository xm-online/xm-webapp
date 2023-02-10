import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { NgFormAccessor } from '@xm-ngx/components/ng-accessor';
import { XmDynamicControl } from '@xm-ngx/dynamic';
import { DataQa } from '@xm-ngx/shared/interfaces';
import { Translate } from '@xm-ngx/translation';
import { clone, defaults, forEach, keyBy } from 'lodash';
import { XmEnumOptionsItem, XmEnumValue } from '../value/xm-enum.component';
import { XmEnumViewOptions } from '../view/xm-enum-view';
import { HintText } from '@xm-ngx/components/hint';


export interface XmEnumControlOptions extends XmEnumViewOptions, DataQa {
    id?: string;
    required?: boolean;
    /** @deprecated use {@link items} instead */
    enum?: XmEnumControlOptionsItem[];
    items: XmEnumControlOptionsItem[];
    showClearButton?: boolean;
    clearButtonText?: Translate | string;
    hint?: HintText;
}

export interface XmEnumControlOptionsItem extends XmEnumOptionsItem {
    icon?: string;
    iconColor?: string;
    permissions?: string[];
}

export const XM_ENUM_CONTROL_OPTIONS_DEFAULT: XmEnumControlOptions = {
    hint: null,
    title: '',
    dataQa: 'enum-control',
    required: false,
    enum: [],
    items: [],
    showClearButton: false,
    clearButtonText: 'admin-config.common.cancel',
};

@Component({
    selector: 'xm-enum-control',
    template: `
        <mat-form-field>
            <mat-label>{{config?.title | translate}}</mat-label>
            <mat-select [formControl]="control"
                        [required]="config.required"
                        [id]="config.id"
                        [attr.data-qa]="config.dataQa">
                <mat-select-trigger>
                    <ng-container *ngIf="itemsMap && itemsMap[value + '']">
                        <mat-icon
                            class="align-middle"
                            [style.background-color]="itemsMap[value + '']?.iconColor"
                            *ngIf="itemsMap[value + '']?.icon">
                            {{itemsMap[value + ''].icon}}
                        </mat-icon>
                        {{(itemsMap[value + ''].title | translate) || ''}}
                    </ng-container>
                </mat-select-trigger>

                <ng-container *ngIf="config.showClearButton">
                    <mat-option [hidden]="value === undefined || value === null || value === ''">
                        <mat-icon>close</mat-icon>
                        {{ config.clearButtonText | translate}}
                    </mat-option>
                </ng-container>

                <ng-template ngFor [ngForOf]="itemsList" let-item>
                    <mat-option [value]="item.value" *xmPermission="item.permissions || []">
                        <mat-icon *ngIf="item.icon" [style.background-color]="item.iconColor">{{item.icon}}</mat-icon>
                        {{item.title | translate}}
                    </mat-option>
                </ng-template>
            </mat-select>

            <mat-error *xmControlErrors="control?.errors; message as message">{{message}}</mat-error>

            <mat-hint [hint]="config.hint"></mat-hint>
        </mat-form-field>
    `,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class XmEnumControlComponent
    extends NgFormAccessor<XmEnumValue>
    implements XmDynamicControl<XmEnumValue, XmEnumControlOptions> {
    public itemsList: XmEnumControlOptionsItem[];
    public itemsMap: {[value: string]: XmEnumControlOptionsItem};
    private _config: XmEnumControlOptions = clone(XM_ENUM_CONTROL_OPTIONS_DEFAULT);

    public get config(): XmEnumControlOptions {
        return this._config;
    }

    @Input()
    public set config(value: XmEnumControlOptions) {
        this._config = defaults({}, value, XM_ENUM_CONTROL_OPTIONS_DEFAULT);
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
