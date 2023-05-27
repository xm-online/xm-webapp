import { XmJsonSchemaFormService as JsonSchemaFormService } from '../../core/xm-json-schema-form.service';
import { Component, Input, OnInit } from '@angular/core';

import { ExtTextareaOptions } from './ext-textarea-options.model';

@Component({
    selector: 'xm-ext-textarea-widget',
    templateUrl: 'ext-textarea.component.html',
})
export class ExtTextareaComponent implements OnInit {

    @Input() public layoutNode: any;

    public controlValue: any;
    public options: ExtTextareaOptions;

    constructor(private jsf: JsonSchemaFormService) {
    }

    public ngOnInit(): void {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
    }

    public changeText(event: any): void {
        this.jsf.updateValue(this, event.target.value);
    }

}
