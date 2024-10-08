import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
    XM_EXTERNAL_LINK_DEFAULTS,
    XmExternalLinkConfig,
} from './xm-external-link-button.model';
import { XmTranslatePipe } from '@xm-ngx/translation';
import { Defaults } from '@xm-ngx/operators';

/**
 * Use this component to create a button that opens a link in a new tab.
 *
 * ## Usage
 * | Property | Key |
 * |---|---|
 * | selector | \@xm-ngx/components/xm-external-link-button |
 * | config | XmExternalLinkConfig |
 *
 *
 * ## Configuration `XmExternalLinkConfig`
 * | Key | Description | Type | Default Value |
 * |-----------------------------------------------|-------------|------|---------------|
 * | `link` | The URL to open when the button is clicked. This can be a translatable string. | `Translate` | `null` |
 * | `title` | The text to display on the button. This can be a translatable string. | `ITranslate` | `null` |
 * | `icon` (optional) | The name of the Material icon to display on the button. | `string` | `'open_in_new'` |
 * | `colorScheme` (optional) | The color scheme of the button. | `'primary' | 'accent' | 'warn'` | `'primary'` |
 * | `target` (optional) | Specifies where to open the linked document. | `'_blank' | '_self'` | `'_blank'` |
 * | `dataQa` (optional) | Specifies data-qa attribute for the element. | `'string'` | `'xm-external-link-button'` |
 *
 */
@Component({
    selector: 'xm-external-link-button',
    standalone: true,
    imports: [
        MatButtonModule,
        MatIconModule,
        XmTranslatePipe,
    ],
    templateUrl: './xm-external-link-button.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class XmExternalLinkButtonComponent {
    @Defaults(XM_EXTERNAL_LINK_DEFAULTS)
    @Input() public config: XmExternalLinkConfig;
}
