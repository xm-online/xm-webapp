import { JsonSchemaFormService } from '@xm-ngx/json-schema-form/core';
import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';

import { ContentTextareaOptions } from './content-textarea-options.model';
import {ContentTextareaLayoutNode} from './content-textarea.layoutNode';

@Component({
    selector: 'xm-content-textarea-widget',
    templateUrl: 'content-textarea.component.html',
    styleUrls: ['./content-textarea.component.scss'],
})
export class ContentTextareaComponent implements OnInit {

    @Input() public layoutNode: ContentTextareaLayoutNode;
    @ViewChild('massageField') public massageField: ElementRef;

    public controlValue: string;
    public messageValue: string;
    public options: ContentTextareaOptions;

    constructor(private jsf: JsonSchemaFormService) {
    }

    public ngOnInit(): void {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
        this.messageValue = this.controlValue;
    }

    public innerHtml(): void {
        this.massageField.nativeElement.innerHTML = this.controlValue;
    }

    public changeText(event: any): void {
        this.jsf.updateValue(this, event.target.innerHTML.trim());
    }

}
