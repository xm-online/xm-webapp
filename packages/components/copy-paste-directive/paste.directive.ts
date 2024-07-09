import {
    Directive,
    EventEmitter, HostListener, inject,
    Input,
    Output,
} from '@angular/core';
import * as _ from 'lodash';
import { take } from 'rxjs/operators';
import { readFromClipboard } from '@xm-ngx/operators';
import { CopyPasteDialogService } from './copy-paste-dialog/copy-paste-dialog.service';
import {
    ClipboardOperations,
    CopyPasteDialogDialog
} from './copy-paste-dialog/copy-paste-dialog.model';
import { CopyPasteBtnOptions } from './copy-paste.model';

@Directive({
    standalone: true,
    selector: '[xmPaste]',
})
export class PasteDirective<T> {
    @Input('xmPaste') public options: CopyPasteBtnOptions<T>;
    @Output() public eventValue: EventEmitter<T> = new EventEmitter();

    private copyPasteService: CopyPasteDialogService = inject(CopyPasteDialogService);

    @HostListener('click', ['$event.target'])
    public async onClick(): Promise<void> {
        await this.onPasteFromClipboard();
    }

    public async onPasteFromClipboard(): Promise<void> {
        const text = await readFromClipboard();

        this.copyPasteService.getClipboardDialog({
            value: text as string,
            operation: ClipboardOperations.PASTE
        })
            .pipe(
                take(1),
            )
            .subscribe((res: CopyPasteDialogDialog) => {
                const value = _.merge(this.options.data, this.getCopiedObjectConfig(res.value));
                this.eventValue.emit(value);
            });
    }

    private getCopiedObjectConfig(text: string): T {
        let copiedObject;

        if (_.isString(text)) {
            try {
                copiedObject = JSON.parse(text);
            } catch (e) {
                console.warn(e);
                return null;
            }
        } else if (_.isObject(text)) {
            copiedObject = text;
        }

        return copiedObject.config as T;
    }
}
