import { Injectable } from '@angular/core';
import {
    getControl,
    buildLayout,
    JsonPointer,
    JsonSchemaFormService,
} from '@ajsf/core';
import { Subject } from 'rxjs';
import { FormArray, FormControl } from '@angular/forms';
import { fixNestedBuildLayout } from '@xm-ngx/json-schema-form/shared/fix-build-layout';

export interface JsonSchemaOrderChange {
    previousIndex: number;
    currentIndex: number;
}

@Injectable({
    providedIn: 'root',
})
export class XmJsonSchemaFormService extends JsonSchemaFormService {
    public orderChanges = new Subject<JsonSchemaOrderChange>();

    public moveArrayItemAndUpdateIndex({layoutIndex, dataIndex, layout}: {
        layout: any[],
        layoutIndex: number[],
        dataIndex: number[]
    }, previousIndex: number, currentIndex: number): boolean {
        const { moveNodePointers }: { moveNodePointers: string[] } = this.formOptions;

        const moved = this.moveArrayItem({
            layoutNode: layout[previousIndex],
            layoutIndex,
            dataIndex,
        }, previousIndex, currentIndex);

        if (moved) {
            const formArray = this.getFormControlGroup({
                layoutNode: layout[previousIndex],
                layoutIndex,
                dataIndex,
            });

            if (!formArray || !(formArray instanceof FormArray)) {
                return false;
            }

            formArray.controls.forEach((formGroup, index) => {
                moveNodePointers
                    ?.forEach((dataPointer) => {
                        if (!JsonPointer.isJsonPointer(dataPointer)) {
                            return;
                        }

                        const formControl = getControl(formGroup, JsonPointer.toKey(dataPointer));

                        if (formControl && formControl instanceof FormControl) {
                            formControl.patchValue(index);
                        }
                    });
            });

            this.orderChanges.next({
                currentIndex,
                previousIndex,
            });

            return true;
        }

        return false;
    }

    public buildLayout(widgetLibrary: any): void {
        this.layout = buildLayout(this, widgetLibrary);

        if (this.formValues) {
            fixNestedBuildLayout({
                builtLayout: this.layout,
                formData: this.formValues,
            });
        }
    }
}
