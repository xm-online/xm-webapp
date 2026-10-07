import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UntypedFormGroup } from '@angular/forms';

/**
 * Service for sharing form data between form-layout and other components
 */
@Injectable({providedIn: 'root'})
export class FormLayoutDataService {
    private formGroupSubject$ = new BehaviorSubject<UntypedFormGroup | null>(null);
    private formDataSubject$ = new BehaviorSubject<Record<string, any> | null>(null);

    /**
     * Observable that emits form group
     */
    public formGroup$(): Observable<UntypedFormGroup | null> {
        return this.formGroupSubject$.asObservable();
    }

    /**
     * Observable that emits form data values
     */
    public formData$(): Observable<Record<string, any> | null> {
        return this.formDataSubject$.asObservable();
    }

    /**
     * Get current form group synchronously
     */
    public getFormGroup(): UntypedFormGroup | null {
        return this.formGroupSubject$.value;
    }

    /**
     * Get current form data synchronously
     */
    public getFormData(): Record<string, any> | null {
        return this.formDataSubject$.value;
    }

    /**
     * Register form group
     */
    public registerFormGroup(formGroup: UntypedFormGroup): void {
        this.formGroupSubject$.next(formGroup);
    }

    /**
     * Update form data
     */
    public updateFormData(data: Record<string, any>): void {
        this.formDataSubject$.next(data);
    }

    /**
     * Clear form data (when form is destroyed)
     */
    public clear(): void {
        this.formGroupSubject$.next(null);
        this.formDataSubject$.next(null);
    }
}
