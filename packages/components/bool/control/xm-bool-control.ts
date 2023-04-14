import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { NgFormAccessor } from '@xm-ngx/components/ng-accessor';
import { XmDynamicControl } from '@xm-ngx/dynamic';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';


@Component({
    selector: 'xm-bool-control',
    template: `
        <mat-form-field>
            <mat-label>{{config?.title | translate}}</mat-label>
            <mat-select [formControl]="control"
                        [disabled]="disabled"
                        (ngModelChange)="change($event)">

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
            <mat-error *xmControlErrors="control?.errors; message as message">{{message}}</mat-error>
        </mat-form-field>
    `,
    imports: [
        MatOptionModule,
        MatIconModule,
        MatFormFieldModule,
        MatSelectModule,
        FormsModule,
        XmTranslationModule,
        ControlErrorModule,
        CommonModule,
        ReactiveFormsModule,
    ],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class XmBoolControl extends NgFormAccessor<boolean> implements XmDynamicControl<boolean, { title?: Translate }> {
    @Input() public config: { title?: string };
}
