import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { XmTranslationModule } from '@xm-ngx/translation';
import { JsonSchemaFormService } from '@ajsf/core';
import { Component, Input, OnInit } from '@angular/core';

import { ExtTextareaOptions } from './ext-textarea-options.model';

@Component({
    standalone: true,
    imports: [MatFormFieldModule, MatInputModule, XmTranslationModule],
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
