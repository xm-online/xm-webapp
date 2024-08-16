import { ChangeDetectionStrategy, Component, inject, Input, OnChanges } from '@angular/core';
import { XmTranslateService } from '@xm-ngx/translation';
import { XmHtml } from './html.model';
import { XmSafePipe } from '@xm-ngx/pipes';

@Component({
    selector: 'xm-html',
    template: `
        <div [innerHTML]="html | xmSafe: 'html'"
             [class]="config?.class"
             [style]="config?.style"
        ></div>`,
    standalone: true,
    imports: [
        XmSafePipe,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class XmHtmlComponent implements OnChanges {
    public html: string;
    private translationService: XmTranslateService = inject(XmTranslateService);

    @Input() public config: XmHtml;

    public ngOnChanges(): void {
        this.translateTemplate();
    }

    public translateTemplate(): void {
        this.html = this.translationService.translate(this.config?.html);
    }
}
