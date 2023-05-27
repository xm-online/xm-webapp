import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { XmTranslationModule } from '@xm-ngx/translation';
import { JsonSchemaFormService } from '@ajsf/core';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ContentTextareaOptions } from './content-textarea-options.model';
import { ContentTextareaLayoutNode } from './content-textarea.layoutNode';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    imports: [CommonModule, MatFormFieldModule, MatInputModule, XmTranslationModule, FormsModule],
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
