import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { XmHtmlComponent } from './xm-html';
import { XmHtml } from './html.model';

@Component({
    selector: 'xm-inner-html-widget',
    template: '<xm-html [config]="config"></xm-html>',
    standalone: true,
    imports: [
        XmHtmlComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class XmInnerHtmlWidget {
    @Input() public config: XmHtml;
}
