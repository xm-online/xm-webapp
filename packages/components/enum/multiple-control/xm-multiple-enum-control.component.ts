import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    Injector,
    Input,
    Optional,
    Self,
    ViewEncapsulation,
} from '@angular/core';
import { FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { HintModule, HintText } from '@xm-ngx/components/hint';
import { NgFormAccessor } from '@xm-ngx/components/ng-accessor';
import { XmPermissionModule } from '@xm-ngx/core/permission';
import { XmDynamicControl, XmDynamicInstanceService } from '@xm-ngx/dynamic';
import { DataQa } from '@xm-ngx/interfaces';
import { takeUntilOnDestroy } from '@xm-ngx/operators';
import { XmTranslationModule } from '@xm-ngx/translation';
import { clone, cloneDeep, defaults, forEach, keyBy } from 'lodash';
import { isObservable, Observable } from 'rxjs';
import { XmEnumControlOptionsItem } from '../control/xm-enum-control.component';
import { XmEnumValue } from '../value/xm-enum.component';
import { XmEnumViewOptions } from '../view/xm-enum-view';

export interface XmMultipleEnumControlOptions extends XmEnumViewOptions, DataQa {
    id?: string;
    required?: boolean;
    initValue?: boolean[] | string[] | number[];
    items: XmEnumControlOptionsItem[];
    hint?: HintText;
    itemsController?: {
        key: string;
        method: string;
    };
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
            <mat-label>{{ config?.title | translate }}</mat-label>
            <mat-select [formControl]="control"
                        [required]="config.required"
                        [id]="config.id"
                        [attr.data-qa]="config.dataQa"
                        (selectionChange)="selectionsChange($event)"
                        multiple>
                <mat-select-trigger>
                    <ng-container *ngIf="itemsMap && itemsMap[value[0] + '']">
                        <mat-icon style="vertical-align: middle"
                                  *ngIf="itemsMap[value[0] + '']?.icon">{{ itemsMap[value[0] + ''].icon }}
                        </mat-icon>
                        {{ (itemsMap[value[0] + ''].title | translate) || '' }}
                    </ng-container>
                    <span *ngIf="control.value?.length > 1" class="small">
                        (+{{ control.value?.length - 1 }} {{ (control.value?.length === 2 ? "xm-enum.other" : "xm-enum.others")  | translate }}
                        )
                        </span>
                </mat-select-trigger>
                <div class="empty-option" *ngIf="config?.clearButton" [hidden]="!control.value" (click)="deselect()">
                    <mat-icon>close</mat-icon>
                    <div>
                        {{ 'ext-entity.common.cancel' | translate }}
                    </div>
                </div>

                <ng-template ngFor [ngForOf]="itemsList" let-item>
                    <mat-option [value]="item.value" *xmPermission="item.permissions || []">
                        <mat-icon *ngIf="item.icon">{{ item.icon }}</mat-icon>
                        {{ item.title | translate }}
                    </mat-option>
                </ng-template>
            </mat-select>

            <mat-error *xmControlErrors="control?.errors; message as message">{{ message }}</mat-error>

            <mat-hint [hint]="config.hint"></mat-hint>
        </mat-form-field>
    `,
    styles: [`
        .empty-option {
            cursor: pointer;
            padding: 9px 13px;
            align-items: center;
            display: flex;
        }

        .empty-option:hover {
            background: rgba(0, 0, 0, 0.04);
        }
    `],
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
        MatButtonModule,
    ],
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class XmMultipleEnumControl
    extends NgFormAccessor<XmEnumValue[] | undefined>
    implements XmDynamicControl<XmEnumValue[] | undefined, XmMultipleEnumControlOptions> {
    public itemsList: XmEnumControlOptionsItem[];
    public itemsMap: { [value: string]: XmEnumControlOptionsItem };
    public dynamicInjector = inject(Injector);
    private dynamicInstanceService = inject(XmDynamicInstanceService);

    constructor(@Optional() @Self() public ngControl: NgControl) {
        super(ngControl);
    }

    private _config: XmMultipleEnumControlOptions = clone(XM_MULTIPLE_ENUM_CONTROL_OPTIONS_DEFAULT);

    public get config(): XmMultipleEnumControlOptions {
        return this._config;
    }

    @Input()
    public set config(value: XmMultipleEnumControlOptions) {
        this._config = defaults({}, value, XM_MULTIPLE_ENUM_CONTROL_OPTIONS_DEFAULT);

        this.setInitValue();
        if (this._config.itemsController) {
            this.setItemsFromController();
            return;
        }
        this.setItems(value.items);
    }

    public get value(): XmEnumValue[] {
        return this._value == undefined ? [] : this._value;
    }

    @Input()
    public set value(data: XmEnumValue[] | undefined) {
        this._value = data;
    }

    public selectionsChange(res: MatSelectChange): void {
        if (res.value?.length === 0) {
            this.control.patchValue(null);
        }
    }

    public deselect(): void {
        this.control.patchValue(null);
    }

    private setInitValue(): void {
        const {initValue} = this.config;

        if (initValue?.length) {
            this.value = initValue;
        }

        this.control.patchValue(this.value);
    }

    private setItemsFromController(): void {
        const {key, method} = this.config.itemsController;
        const controller = this.dynamicInstanceService.getControllerByKey(key, this.dynamicInjector);
        if (!controller) {
            console.warn('XmMultipleEnumControl: cant get items controller!');
            return;
        }
        const methodExecutionResult = controller[method]?.() || [];
        if (isObservable(methodExecutionResult)) {
            (methodExecutionResult as Observable<XmEnumControlOptionsItem[]>).pipe(takeUntilOnDestroy(this))
                .subscribe(items => {
                    this.setItems(cloneDeep(items));
                });
        } else {
            this.setItems(cloneDeep(methodExecutionResult));
        }
    }

    private setItems(items: XmEnumControlOptionsItem[]): void {
        this.itemsList = cloneDeep(items);
        forEach(this.itemsList, item => {
            if (item.value === undefined) {
                item.value = '';
            }
        });
        this.itemsMap = keyBy(this.itemsList, 'value');
    }

}
