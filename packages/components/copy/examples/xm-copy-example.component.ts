import { Component } from '@angular/core';
import { XmCopyIconOptions } from '@xm-ngx/components/copy';

@Component({
    selector: 'xm-copy-example',
    templateUrl: './xm-copy-example.component.html',
})
export class XmCopyExampleComponent {
    public copyIconValue: unknown = { text: 'Copy text' };

    public copyIconOptions: XmCopyIconOptions = {
        template: {
            en: 'Your text is "{{value.text}}"',
        },
        copiedMessage: {
            en: 'You have copied "{{value.text}}"!',
        },
    };
}
