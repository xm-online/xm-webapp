import { Injectable } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { FormFieldLayoutConfig } from './form-layout.model';

/**
 * Stateless helper that applies declarative field `rules` to the real form controls.
 * Rules mutate actual controls via patchValue (emitEvent: false), so their result is
 * reflected in getRawValue() and shared consumers, unlike snapshot-based condition hacks.
 */
@Injectable({providedIn: 'root'})
export class FormFieldRulesService {

    public apply(
        formGroup: UntypedFormGroup,
        fields: FormFieldLayoutConfig[],
        dataValue: unknown,
    ): void {
        if (!formGroup) {
            return;
        }

        if (!fields?.some((field) => field?.rules?.length)) {
            return;
        }

        const form = formGroup.getRawValue();
        const patch: Record<string, unknown> = {};

        for (const field of fields) {
            for (const rule of (field?.rules ?? [])) {
                if (!rule) {
                    continue;
                }

                const whenResult = rule.when
                    ? this.evalExpr(rule.when, {form, dataValue})
                    : {success: true, value: true};

                if (!whenResult.success || !Boolean(whenResult.value)) {
                    continue;
                }

                for (const [property, expr] of Object.entries(rule.set ?? {})) {
                    const setResult = this.evalExpr(expr, {form, dataValue});
                    if (setResult.success) {
                        patch[property] = setResult.value;
                    }
                }
            }
        }

        const effectivePatch: Record<string, unknown> = {};
        for (const property of Object.keys(patch)) {
            const control = formGroup.get([property]);
            if (control && control.value !== patch[property]) {
                effectivePatch[property] = patch[property];
            }
        }

        if (Object.keys(effectivePatch).length) {
            formGroup.patchValue(effectivePatch, {emitEvent: false});
        }
    }

    private evalExpr(code: string, args: Record<string, unknown>): {success: boolean; value: unknown} {
        try {
            const fn = new Function(...Object.keys(args), `return (${code});`);
            return {success: true, value: fn(...Object.values(args))};
        } catch (e) {
            console.error(e);
            return {success: false, value: undefined};
        }
    }
}
