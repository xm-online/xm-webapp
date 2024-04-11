import { Component, inject, Injector, OnInit, Optional, Self } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
import { XmTranslationModule } from '@xm-ngx/translation';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { MatIconModule } from '@angular/material/icon';
import { XmEnumControl, XmEnumControlOptions } from '@xm-ngx/components/enum';
import { HintModule } from '@xm-ngx/components/hint';
import { XmDynamicInstanceService } from '@xm-ngx/dynamic';
import { XmPermissionModule } from '@xm-ngx/core/permission';


interface XmEnumControlOptionsExtended extends XmEnumControlOptions {
    dataField?: string;
    disabledIfExternal?: boolean;
    controller?: {
        key: string;
    }
}

@Component({
    selector: 'xm-enum-from-service-control',
    standalone: true,
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
        HintModule],
    template: `
        <mat-form-field>
            <mat-label>{{ config?.title | translate }}</mat-label>
            <mat-select [formControl]="control"
                        [required]="config.required"
                        [id]="config.id"
                        [disabled]="disabledIfExternal"
                        [attr.data-qa]="config.dataQa">
                <mat-select-trigger>
                    <ng-container *ngIf="itemsMap && itemsMap[value + '']">
                        <mat-icon
                            class="align-middle"
                            [style.background-color]="itemsMap[value + '']?.iconColor"
                            *ngIf="itemsMap[value + '']?.icon">
                            {{ itemsMap[value + ''].icon }}
                        </mat-icon>
                        {{ (itemsMap[value + ''].title | translate) || '' }}
                    </ng-container>
                </mat-select-trigger>

                <ng-container *ngIf="config.showClearButton">
                    <mat-option [hidden]="value === undefined || value === null || value === ''">
                        <mat-icon>close</mat-icon>
                        {{ config.clearButtonText | translate }}
                    </mat-option>
                </ng-container>

                <ng-template ngFor [ngForOf]="itemsList" let-item>
                    <mat-option [value]="item.value" *xmPermission="item.permissions || []">
                        <mat-icon *ngIf="item.icon" [style.background-color]="item.iconColor">{{ item.icon }}</mat-icon>
                        {{ item.title | translate }}
                    </mat-option>
                </ng-template>
            </mat-select>

            <mat-error *xmControlErrors="control?.errors; message as message">{{ message }}</mat-error>

            <mat-hint [hint]="config.hint"></mat-hint>
        </mat-form-field>
    `,
})
export class EnumFromServiceControlComponent extends XmEnumControl implements OnInit {
    private dynamicInst = inject(XmDynamicInstanceService);
    private injector = inject(Injector);
    public disabledIfExternal: boolean = false;

    public get extendedConfig(): XmEnumControlOptionsExtended {
        return this.config as XmEnumControlOptionsExtended;
    }

    constructor(
        @Optional() @Self() ngControl: NgControl | null,
    ) {
        super(ngControl);
    }

    public ngOnInit(): void {
        const remoteDataService = this.dynamicInst.getControllerByKey(this.extendedConfig?.controller?.key || 'remoteData', this.injector);
        super.ngOnInit();
        remoteDataService.get$().subscribe((res: unknown) => {
            this.disabledIfExternal = false;
            if (res && this.extendedConfig?.dataField && res[this.extendedConfig.dataField]) {
                if (this.extendedConfig?.disabledIfExternal) {
                    this.disabledIfExternal = true;
                }
                this.control.setValue(res[this.extendedConfig.dataField]);
            }
        });
    }
}
