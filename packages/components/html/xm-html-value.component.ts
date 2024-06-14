import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { XmDynamicPresentation } from '@xm-ngx/dynamic';
import { XmHtmlComponent } from './xm-html';
import { XmHtml } from './html.model';

/**
 * ## HtmlValue
 *
 * Use it in cases when you want to show HTML that you will receive from API response.
 *
 * ### Selector
 * `@xm-ngx/components/html-value`
 *
 * ### Widget configuration example
 * ```json
 * {
 *   "field": "path.to.your.value.in.stored.value",
 *   "selector": "@xm-ngx/components/html-value",
 *   "config": { // config is optional
 *     "class": "mb-3 d-flex",
 *     "style": "color: red;"
 *   }
 * }
 * ```
 */
@Component({
    selector: 'xm-html-value',
    template: '<xm-html [config]="config"></xm-html>',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        XmHtmlComponent,
    ],
})
export class XmHtmlValueComponent implements XmDynamicPresentation<string, XmHtml>, OnInit {
    @Input() public value: string = '';
    @Input() public config: XmHtml | null;

    public ngOnInit(): void {
        this.config = {
            ...this.config,
            html: this.value,
        };
    }
}
