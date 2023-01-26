import { Injectable } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { FormGroupLayoutFactoryService, FormGroupLayoutItem } from '@xm-ngx/components/form-layout';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'any',
})
export class XmTableFilterService<T> {
    private formGroup: UntypedFormGroup;

    constructor(private layoutFactoryService: FormGroupLayoutFactoryService,
    ) {
    }

    public createFormGroup(config: FormGroupLayoutItem[]): UntypedFormGroup {
        this.formGroup = this.layoutFactoryService.createForm(config);
        return this.formGroup;
    }

    public setFormValue(value: T): void {
        this.formGroup.patchValue(value);
    }

    public formValueChange(): Observable<T> {
        return this.formGroup.valueChanges;
    }

    public clearForm(): void {
        this.formGroup.reset();
    }
}
