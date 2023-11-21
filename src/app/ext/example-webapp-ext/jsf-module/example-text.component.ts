import { Component, Input, OnInit } from '@angular/core';
import { JsonSchemaFormService } from '@ajsf/core';


/**
 * Configuration sample:
 *```json
 *{
 *  "schema": {
 *    "sample": {
 *      "widget": "example-text"
 *    }
 *  }
 *}
 *```
 *
 */
@Component({
    selector: 'xm-example-text',
    standalone: true,
    template: 'example text={{controlValue}} <input (change)="changeText($event)"/>',
})
export class ExampleTextComponent implements OnInit {

    @Input() public layoutNode: unknown;
    public controlValue: string;

    constructor(
        private jsf: JsonSchemaFormService,
    ) {
    }

    public ngOnInit(): void {
        this.jsf.initializeControl(this);
    }

    public changeText($event: Event): void {
        this.jsf.updateValue(this, ($event.target as HTMLInputElement).value);
    }

}
