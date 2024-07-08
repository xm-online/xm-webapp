import {
    Directive,
    HostListener, inject,
    Input,
} from '@angular/core';
import * as _ from 'lodash';
import {
    ClipboardOperations,
    CopyPasteDialogDialog
} from './copy-paste-dialog/copy-paste-dialog.model';
import { take } from 'rxjs/operators';
import { copyToClipboard } from '@xm-ngx/operators';
import { CopyPasteDialogService } from './copy-paste-dialog/copy-paste-dialog.service';
import { CopyPasteBtnOptions } from './copy-paste.model';

@Directive({
    standalone: true,
    selector: '[xmCopy]',
})
export class CopyDirective<T> {
    @Input('xmCopy') public options: CopyPasteBtnOptions<T>;

    private copyPasteService: CopyPasteDialogService = inject(CopyPasteDialogService);

    @HostListener('click', ['$event.target'])
    public onClick(): void {
        this.onCopyToClipboard();
    }

    public onCopyToClipboard(): void {
        const data = _.cloneDeep(this.options.data || {});

        const enrichedData = {
            config: data,
        };

        const text = JSON.stringify(enrichedData);

        this.copyPasteService.getClipboardDialog({
            value: text,
            operation: ClipboardOperations.COPY
        })
            .pipe(
                take(1),
            )
            .subscribe(async (res: CopyPasteDialogDialog) => {
                await copyToClipboard(res?.value, {insecurePrompt: false});
            });
    }
}
