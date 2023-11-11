import { Component, Input, OnInit } from '@angular/core';
import { JsonSchemaFormService } from '@ajsf/core';


/**
 *
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

    @Input() public layoutNode: any;
    public controlValue: string;

    constructor(
        private jsf: JsonSchemaFormService,
    ) {
    }

    ngOnInit(): void {
        this.jsf.initializeControl(this);
    }

    changeText($event: Event): void {
        this.jsf.updateValue(this, ($event.target as HTMLInputElement).value);
    }

}
