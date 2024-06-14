import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { XmDynamicPresentation } from '@xm-ngx/dynamic';
import { XmSanitizedHtml } from '@xm-ngx/components/html/html.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'xm-sanitized-html',
    template: `<div [innerHTML]="sanitizedHtml"
                    [class]="config?.class"
                    [style]="config?.style"
               ></div>`,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class XmSanitizedHtmlComponent implements XmDynamicPresentation<string, XmSanitizedHtml>, OnInit {
    @Input() public value: string = '';
    @Input() public config: XmSanitizedHtml | null;

    public sanitizedHtml: SafeHtml;
    private domSanitizer: DomSanitizer = inject(DomSanitizer);

    public ngOnInit(): void {
        this.sanitizeHtml();
    }

    private sanitizeHtml(): void {
        this.sanitizedHtml = this.domSanitizer.bypassSecurityTrustHtml(this.value);
    }
}
