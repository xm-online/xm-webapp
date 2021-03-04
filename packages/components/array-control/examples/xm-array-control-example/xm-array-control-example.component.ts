import { Component } from '@angular/core';
import { XmArrayControlOptions } from '@xm-ngx/components/array-control';

@Component({
    selector: 'xm-array-control-example',
    templateUrl: './xm-array-control-example.component.html',
    styleUrls: ['./xm-array-control-example.component.scss'],
})
export class XmArrayControlExampleComponent {

    public arrayControlOptions: XmArrayControlOptions = {
        title: { en: 'arrayControl' },
        placeholder: { en: 'Array Control...' },
        dataQa: 'array-control-example',
        removable: true,
        selectable: true,
        ariaLabel: 'Array control example',
        autocomplete: ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'],
    };

    public arrayControlValue: string[] = ['Lime'];
}
