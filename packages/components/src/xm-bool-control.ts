import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, Input, NgModule } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { NgModelWrapper } from '@xm-ngx/components/ng-model-wrapper';
import { IComponentFn, IControl } from '@xm-ngx/dynamic';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';


@Component({
    selector: 'xm-bool-control',
    template: `
        <mat-form-field>
            <mat-select [value]="value"
                        [disabled]="disabled"
                        [placeholder]="options?.title | translate"
                        (valueChange)="change($event)">

                <mat-select-trigger>
                    <ng-container *ngIf="value === true">{{'xm-bool-control.true' | translate}}</ng-container>
                    <ng-container *ngIf="value === false">{{'xm-bool-control.false' | translate}}</ng-container>
                </mat-select-trigger>

                <mat-option [hidden]="value !== true && value !== false" (click)="value = null">
                    <mat-icon>close</mat-icon>
                    {{'xm-bool-control.cancel' | translate}}
                </mat-option>

                <mat-option [value]="true">
                    <mat-icon>done</mat-icon>
                    {{'xm-bool-control.true' | translate}}
                </mat-option>

                <mat-option [value]="false">
                    <mat-icon>remove</mat-icon>
                    {{'xm-bool-control.false' | translate}}
                </mat-option>

            </mat-select>
        </mat-form-field>
    `,
    providers: [{provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => XmBoolControl), multi: true}],
    changeDetection: ChangeDetectionStrategy.Default,
})
export class XmBoolControl extends NgModelWrapper<boolean> implements IControl<boolean, { title?: Translate }> {
    @Input() public value: boolean;
    @Input() public options: { title?: string };
}

@NgModule({
    imports: [
        MatOptionModule,
        MatIconModule,
        MatFormFieldModule,
        MatSelectModule,
        FormsModule,
        XmTranslationModule,
        CommonModule,
    ],
    exports: [XmBoolControl],
    declarations: [XmBoolControl],
    providers: [],
})
export class XmBoolControlModule {
    public entry: IComponentFn<boolean, { title?: string }> = XmBoolControl;
}
