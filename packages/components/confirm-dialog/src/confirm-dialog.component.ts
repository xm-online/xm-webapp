import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import {
    XmConfirmDialogComputedData,
    XmConfirmDialogGroup,
} from './confirm-dialog.interface';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ConditionModule } from '@xm-ngx/components/condition';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { XmTranslationModule } from '@xm-ngx/translation';
import { XmDynamicModule } from '@xm-ngx/dynamic';
import { XmPermissionModule } from '@xm-ngx/core/permission';
import _ from 'lodash';
import { XmConfirmDialogDataService } from './confirm-dialog-data.service';

@Component({
    standalone: true,
    selector: 'xm-confirm-dialog',
    template: `
        <ng-container *ngIf="computedData | async as data">
            <div mat-dialog-title class="heading">
                <h2 class="heading-title" *ngIf="data?.title">{{data.title | translate}}</h2>
                <div class="heading-subtitle" *ngIf="data?.subtitle">{{data.subtitle | translate}}</div>
            </div>

            <form mat-dialog-content [formGroup]="form">
                <ng-container *ngFor="let group of (conditionControls | async); trackBy: uniqTrackBy">
                    <ng-container *xmPermission="group.permission">
                        <ng-template
                            xmDynamicControl
                            [formControlName]="group.type"
                            [class]="group.control.class"
                            [style]="group.control.style"
                            [options]="group.control.config ? group.control.config : group.control.options"
                            [config]="group.control.config"
                            [selector]="group.control.selector"
                            [value]="group.control.value"
                        ></ng-template>
                    </ng-container>
                </ng-container>
            </form>

            <div mat-dialog-actions [align]="'end'">
                <button mat-stroked-button mat-dialog-close>{{ data?.cancelButtonText | translate }}</button>
                
                <ng-container *ngIf="data.hasControls; then applyTpl else confirmTpl"></ng-container>

                <ng-template #applyTpl>
                    <button mat-flat-button color="primary" [disabled]="isFormDisabled | async" (click)="applyForm(form)">{{ data?.confirmButtonText | translate }}</button>
                </ng-template>

                <ng-template #confirmTpl>
                    <button mat-flat-button color="primary" (click)="confirm()">{{ data?.confirmButtonText | translate }}</button>
                </ng-template>
            </div>
        </ng-container>

        <button mat-icon-button mat-dialog-close class="icon-close">
            <mat-icon>close</mat-icon>
        </button>
    `,
    styles: [`
        .heading {
            text-align: center;
        }

        .heading-subtitle {
            font-size: 14px;
            font-weight: 400;
        }

        button.close[mat-dialog-close] {
            position: absolute;
            top: 0;
            right: 0;
            z-index: 1;
        }
    `],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        XmTranslationModule,
        XmDynamicModule,
        ConditionModule,
        XmPermissionModule,
    ],
})
export class XmConfirmDialogComponent implements OnInit {
    public form = this.fb.group({});
    public conditionControls: Observable<XmConfirmDialogGroup[]> = of([]);
    public isFormDisabled: Observable<boolean>;
    public computedData: Observable<XmConfirmDialogComputedData>;

    constructor(
        private fb: UntypedFormBuilder,
        private dialogRef: MatDialogRef<XmConfirmDialogComponent>,
        private dialogData: XmConfirmDialogDataService,
    ) {}

    public ngOnInit(): void {
        this.form = this.dialogData.form;
        this.conditionControls = this.dialogData.buildConditionControls();
        this.isFormDisabled = this.dialogData.hasFormDisabled();
        this.computedData = this.dialogData.getComputedData();
    }

    public applyForm({ invalid }: UntypedFormGroup): void {
        if (invalid) {
            return;
        }

        const value = this.form.getRawValue();
        const { isManualClose } = this.dialogData.data;

        if (isManualClose) {
            this.dialogData.manualClose(value);
        } else {
            this.dialogRef.close(value);
        }
    }

    public confirm(): void {
        this.dialogRef.close(true);
    }

    public uniqTrackBy = (index: number, item: XmConfirmDialogGroup): string => item.type;
}
