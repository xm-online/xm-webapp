import { JsonSchemaFormService } from '@ajsf/core';
import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormControl } from '@angular/forms';

interface JsfLayoutNode {
    options?: {
        config?: any;
        selector?: string;
        title?: string
    };
}

@Component({
    selector: 'xm-dynamic-control-injector',
    template: `
        @if (formControl) {
            <ng-container
                [formControl]="formControl"
                [selector]="layoutNode.options?.selector"
                [options]="layoutNode.options"
                [config]="layoutNode.options?.config"
                xmDynamicControl></ng-container>
        }
    `,
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
