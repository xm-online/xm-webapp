import { Component } from '@angular/core';
import { XmEnumControlOptions, XmEnumOptions, XmEnumViewOptions } from '@xm-ngx/components/enum';

@Component({
    selector: 'xm-enum-example',
    templateUrl: './xm-enum-example.component.html',
})
export class XmEnumExampleComponent {
    public enumValue: string = 'A_KEY';

    public enumOptions: XmEnumOptions = {
        items: [
            { title: 'A Key', value: 'A_KEY' },
            { title: 'B Key', value: 'B_KEY' },
        ],
    };

    public enumViewOptions: XmEnumViewOptions = {
        title: { en: 'Title' },
        items: [
            { title: 'A Key', value: 'A_KEY' },
            { title: 'B Key', value: 'B_KEY' },
        ],
    };

    public enumControlOptions: XmEnumControlOptions = {
        title: { en: 'Title' },
        dataQa: 'enum-control',
        items: [
            { title: 'A Key', value: 'A_KEY', permissions: [''], icon: 'accessibility' },
            { title: 'B Key', value: 'B_KEY', permissions: [''], icon: 'accessible_forward' },
        ],
    };

}
