import { JsonSchemaFormService } from '@xm-ngx/json-schema-form/core';
import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';

import { LinkFieldOptions } from './link-field-options.model';

@Component({
    selector: 'xm-link-field-widget',
    templateUrl: 'link-field.component.html',
})
export class LinkFieldComponent implements OnInit {

    @ViewChild('linkField') public linkField: ElementRef;
    @Input() public layoutNode: any;

    public controlValue: any;
    public options: LinkFieldOptions;
    public modeEdit: boolean;

    constructor(private jsf: JsonSchemaFormService) {
    }

    public ngOnInit(): void {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
    }

    public changeText(event: any): void {
        this.jsf.updateValue(this, event.target.value);
    }

    public enableEdit(): void {
        this.modeEdit = true;
        setTimeout(()=>{
            this.linkField.nativeElement.focus();
        },0);
    }

    public disableEdit(): void {
        this.modeEdit = false;
    }

}
