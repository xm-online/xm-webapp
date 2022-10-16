import { JsonSchemaFormService } from '@ajsf/core';
import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormControl } from '@angular/forms';

interface JsfLayoutNode {
    options?: {
        selector?: string;
        title?: string
    };
}

@Component({
    selector: 'xm-dynamic-control-injector',
    template: `
        <ng-container *ngIf="formControl"
                      [formControl]="formControl"
                      [selector]="layoutNode.options?.selector"
                      [options]="layoutNode.options"
                      xmDynamicControl></ng-container>`,
})
export class DynamicControlInjectorComponent implements OnInit {
    @Input() public layoutNode: JsfLayoutNode;
    public formControl: UntypedFormControl | UntypedFormArray;

    constructor(private jsf: JsonSchemaFormService) {
    }

    public ngOnInit(): void {
        this.jsf.initializeControl(this);
    }
}
