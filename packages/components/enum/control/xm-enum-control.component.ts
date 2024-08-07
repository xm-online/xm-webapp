import { ChangeDetectionStrategy, Component, inject, Injector, Input, OnDestroy, Optional, Self, ViewEncapsulation } from '@angular/core';
import { NgFormAccessor } from '@xm-ngx/components/ng-accessor';
import { XmDynamicControl, XmDynamicInstanceService } from '@xm-ngx/dynamic';
import { DataQa } from '@xm-ngx/interfaces';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import { clone, cloneDeep, defaults, forEach, keyBy } from 'lodash';
import { XmEnumOptionsItem, XmEnumValue } from '../value/xm-enum.component';
import { XmEnumViewOptions } from '../view/xm-enum-view';
import { HintModule, HintText } from '@xm-ngx/components/hint';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XmPermissionModule } from '@xm-ngx/core/permission';
import { Observable } from 'rxjs';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';

export interface XmEnumControlOptions extends XmEnumViewOptions, DataQa {
    id?: string;
    required?: boolean;
    /** @deprecated use {@link items} instead */
    enum?: XmEnumControlOptionsItem[];
    items: XmEnumControlOptionsItem[];
    showClearButton?: boolean;
    clearButtonText?: Translate | string;
    hint?: HintText;
    resetValueOnDestroy?: boolean;
    itemsController?: {
        key: string;
        method: string;
    };
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
export class XmEnumControl
    extends NgFormAccessor<XmEnumValue>
    implements XmDynamicControl<XmEnumValue, XmEnumControlOptions>, OnDestroy {
    public itemsList: XmEnumControlOptionsItem[];
    public itemsMap: { [value: string]: XmEnumControlOptionsItem };
    private _config: XmEnumControlOptions = clone(XM_ENUM_CONTROL_OPTIONS_DEFAULT);
    private dynamicInstanceService = inject(XmDynamicInstanceService);
    public dynamicInjector = inject(Injector);

    public get config(): XmEnumControlOptions {
        return this._config;
    }

    @Input()
    public set config(value: XmEnumControlOptions) {
        this._config = defaults({}, value, XM_ENUM_CONTROL_OPTIONS_DEFAULT);

        if (this._config.itemsController) {
            this.setItemsFromController();
            return;
        }
        this.itemsList = this._config.items || this._config.enum;
        this.setItems();

        if (value?.enum) {
            console.warn('"enum" is deprecated use "items" instead!');
        }
    }

    private setItems(): void {
        forEach(this.itemsList, item => {
            if (item.value === undefined) {
                item.value = '';
            }
        });
        this.itemsMap = keyBy(this.itemsList, 'value');
    }

    constructor(@Optional() @Self() public ngControl: NgControl) {
        super(ngControl);
    }

    private setItemsFromController(): void {
        const { key, method } = this.config.itemsController;
        const controller = this.dynamicInstanceService.getControllerByKey(key, this.dynamicInjector);
        if (!controller) {
            console.warn('XmEnumControl: cant get items controller!');
            return;
        }
        (controller[method] as () => Observable<XmEnumControlOptionsItem[]>)()
            .pipe(takeUntilOnDestroy(this))
            .subscribe(items => {
                this.itemsList = cloneDeep(items);
                this.setItems();
            });
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
        if (this.config?.resetValueOnDestroy) {
            this.change(null);
        }

        super.ngOnDestroy();
    }
}
