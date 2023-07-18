import { JsonSchemaFormService } from '@ajsf/core';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { XmTranslationModule } from '@xm-ngx/translation';
import { LinkFieldOptions } from './link-field-options.model';
import { LinkFieldLayoutNode } from './link-field.layoutNode';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    imports: [
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        XmTranslationModule,
        FormsModule,
        CommonModule,
    ],
    selector: 'xm-link-field-widget',
    templateUrl: 'link-field.component.html',
})
export class LinkFieldComponent implements OnInit {

    @ViewChild('linkField') public linkField: ElementRef;
    @Input() public layoutNode: LinkFieldLayoutNode;

    public controlValue: string;
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
        setTimeout(() => {
            this.linkField.nativeElement.focus();
        }, 0);
    }

    public disableEdit(): void {
        this.modeEdit = false;
    }

}
