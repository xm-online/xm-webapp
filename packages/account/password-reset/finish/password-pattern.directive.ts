import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
    selector: '[noSpacePattern]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: NoSpacePatternDirective,
            multi: true,
        },
    ],
    standalone: true,
})
export class NoSpacePatternDirective implements Validator {
    public validate(control: AbstractControl): ValidationErrors | null {
        return new RegExp(/^[\S]*$/).test(control.value) ? null : { 'space' : true };
    }
}
