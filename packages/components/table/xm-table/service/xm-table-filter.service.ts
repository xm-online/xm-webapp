import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormGroup } from '@angular/forms';
import { FormGroupLayoutFactoryService, FormGroupLayoutItem } from '@xm-ngx/components/form-layout';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'any',
})
export class XmTableFilterService<T> {
    public filterChange$: Subject<T> = new Subject<T>();
    private form: FormGroup;

    constructor(private layoutFactoryService: FormGroupLayoutFactoryService,
    ) {
        this.form.valueChanges.subscribe(value => this.filterChange$.next(value));
    }

    public createForm(config: FormGroupLayoutItem[]): UntypedFormGroup {
        this.form = this.layoutFactoryService.createForm(config);
        return this.form;
    }

    public initFilter: any;

    public clearFilter(): void {
        this.form.reset();
    }
}
