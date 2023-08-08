import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, UntypedFormControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { FormFieldLayoutConfig, FormLayoutConfig } from '@xm-ngx/components/layout/form/form-layout.model';
import { EDIT_EVENT, EditStateStoreService } from '@xm-ngx/controllers/features/edit-state-store';
import { ResourceDataService } from '@xm-ngx/controllers/features/resource-data';
import { DashboardStore } from '@xm-ngx/core/dashboard';
import { XmDynamicModule } from '@xm-ngx/dynamic';
import {
    XmDynamicInjectionTokenStoreService,
} from '@xm-ngx/dynamic/src/services/xm-dynamic-injection-token-store.service';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { get } from 'lodash';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
    standalone: true,
    selector: 'xm-form-layout',
    templateUrl: './form-layout.component.html',
    styleUrls: ['./form-layout.component.scss'],
    imports: [
        MatCardModule,
        XmDynamicModule,
        NgIf,
        NgForOf,
        AsyncPipe,
    ],
    providers: [DashboardStore],
    changeDetection: ChangeDetectionStrategy.Default, // keep OnPush
})
export class FormLayoutComponent {

    private dynamicInjectionTokenStore = inject(XmDynamicInjectionTokenStoreService);
    private dataController = inject<ResourceDataService>(this.dynamicInjectionTokenStore.resolve('data'));
    private editStateStore = inject<EditStateStoreService>(this.dynamicInjectionTokenStore.resolve('edit-state-store'));

    private fb = inject<FormBuilder>(FormBuilder);

    private formGroup = this.fb.group({});

    public config: FormLayoutConfig;

    private controlRegistry: Record<string, Observable<UntypedFormControl>> = {};

    public ngOnInit(): void {
        this.formGroup.valueChanges.pipe(
            takeUntilOnDestroy(this),
            // map(transform)
        ).subscribe(value => {
            this.config.fields.forEach(field => {
                value[field.property]
            })
        });

        this.editStateStore.event$.pipe(
            takeUntilOnDestroy(this),
            switchMap((event) => {
                if (event === EDIT_EVENT.SAVE) {
                    return this.dataController.save();
                } else if (event === EDIT_EVENT.CANCEL) {
                    return this.dataController.reset();
                }
                return of();
            }),
        ).subscribe();
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    public getControl({ property}: FormFieldLayoutConfig): Observable<UntypedFormControl> {
        if (!this.controlRegistry[property]) {
            this.controlRegistry[property] = this.dataController.get().pipe(
                map(obj => property ? get(obj, property) : obj),
                // transform
                map(value => {
                    const syncValidators = []; // field.validators.map(validator => inject<ValidatorFn>(this.dynamicInjectionTokenStore.resolve(validator.key)))
                    const asyncValidators = [];
                    const control = new UntypedFormControl(value, syncValidators, asyncValidators);
                    this.formGroup.setControl(property, control);
                    return control;
                }),
            );
        }
        return this.controlRegistry[property];
    }

}
