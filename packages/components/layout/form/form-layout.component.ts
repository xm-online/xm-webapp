import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { FormLayoutConfig } from '@xm-ngx/components/layout/form/form-layout.model';
import { EDIT_EVENT, EditStateStoreService } from '@xm-ngx/controllers/features/edit-state-store';
import { ResourceDataService } from '@xm-ngx/controllers/features/resource-data';
import { DashboardStore } from '@xm-ngx/core/dashboard';
import { XmDynamicModule } from '@xm-ngx/dynamic';
import {
    XmDynamicInjectionTokenStoreService,
} from '@xm-ngx/dynamic/src/services/xm-dynamic-injection-token-store.service';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { get, set } from 'lodash';
import { of } from 'rxjs';
import { debounceTime, filter, map, switchMap, withLatestFrom } from 'rxjs/operators';

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

    public formGroup: FormGroup<any>;

    public config: FormLayoutConfig;

    public ngOnInit(): void {
        this.formGroup = this.fb.group(Object.fromEntries(this.config.fields.map(field => [field.property, new UntypedFormControl()])));

        this.dataController.get().pipe(
            takeUntilOnDestroy(this),
            map(data => {
                return Object.fromEntries(this.config.fields.map(({property}) => [property, property ? get(data, property) : data]));
            }),
        ).subscribe(value => {
            this.formGroup.patchValue(value, {emitEvent: false});
        });

        this.formGroup.valueChanges.pipe(
            debounceTime(200),
            filter(() => this.formGroup.valid && this.formGroup.touched && this.formGroup.dirty),
            // map(transform)
            withLatestFrom(this.dataController.get()),
            map(([value, data]) => {
                this.config.fields.forEach(field => {
                    set(data, field.property, value[field.property]);
                });
                return data;
            }),
            switchMap(entity => this.dataController.update(entity)),
            takeUntilOnDestroy(this),
        ).subscribe();

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

    public getControl(property: string): UntypedFormControl {
        return this.formGroup.controls[property] as UntypedFormControl;
    }

}
