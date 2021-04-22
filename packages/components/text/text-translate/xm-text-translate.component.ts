import { Component, Input } from '@angular/core';
import { XmDynamicPresentation } from '@xm-ngx/dynamic';
import { Translate } from '@xm-ngx/translation';

@Component({
    selector: 'xm-text-translate',
    template: '{{value | translate}}',
})
export class XmTextTranslateComponent implements XmDynamicPresentation<Translate, undefined> {
    @Input() public value: Translate;
    @Input() public options: undefined;
}
