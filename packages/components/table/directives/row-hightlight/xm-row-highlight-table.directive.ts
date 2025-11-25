import { Directive, inject } from '@angular/core';
import { XmRowHighlightRegistry } from './xm-row-highlight-registry.service';

@Directive({
    selector: '[xmRowHighlightTable]',
    standalone: true,
    providers: [XmRowHighlightRegistry],
})
export class XmRowHighlightTableDirective {
    public readonly registry: XmRowHighlightRegistry = inject(XmRowHighlightRegistry);
}
