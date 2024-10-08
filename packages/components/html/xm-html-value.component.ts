import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { XmDynamicPresentation } from '@xm-ngx/dynamic';
import { XmHtmlComponent } from './xm-html';
import { XmHtml } from './html.model';

@Component({
    selector: 'xm-html-value',
    template: '<xm-html [config]="config"></xm-html>',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        XmHtmlComponent,
    ],
})
export class XmHtmlValueComponent implements XmDynamicPresentation<string, XmHtml>, OnChanges {
    @Input() public value: string = '';
    @Input() public config: XmHtml | null;

    public ngOnChanges(): void {
        this.config = {
            ...this.config,
            html: this.value,
        };
    }
}
