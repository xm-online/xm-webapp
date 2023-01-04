import { UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';

export class MockFormGroupLayoutFactoryService {
    public createControl(): UntypedFormControl {
        return new UntypedFormControl();
    }

    public createForm(): UntypedFormGroup {
        return new UntypedFormGroup({});
    }

    public createFormWithFormArray(): UntypedFormGroup {
        return new UntypedFormGroup({aliases: new UntypedFormArray([])});
    }
}
