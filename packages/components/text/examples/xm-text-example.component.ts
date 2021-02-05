import { Component } from '@angular/core';
import { XmTextControlOptions, XmTextRangeOptions } from '@xm-ngx/components/text';

@Component({
    selector: 'xm-text-example',
    templateUrl: './xm-text-example.component.html',
    styleUrls: ['./xm-text-example.component.scss'],
})
export class XmTextExampleComponent {

    public textRangeOptions: XmTextRangeOptions = {
        id: 'unique-id',
        placeholder: { en: 'Write your text here...' },
        title: { en: 'Range text' },
        rows: 3,
    };

    public textControlOptions: XmTextControlOptions = {
        id: 'unique-id',
        placeholder: { en: 'Placeholder...' },
        title: { en: 'Text Control' },
    };

}
