import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { XmDynamicPresentation } from '@xm-ngx/dynamic';
import { Translate, XmTranslateService } from '@xm-ngx/translation';
import { clone } from 'lodash';


export interface XmCopyIconOptions {
    template: Translate;
    copiedMessage: Translate;
}

export const XM_COPY_ICON_OPTIONS: XmCopyIconOptions = {
    template: '{{value}}',
    copiedMessage: 'Copied.',
};

@Component({
    selector: 'xm-copy-icon',
    template: `
        <button mat-icon-button
                *ngIf="copyValue"
                [cdkCopyToClipboard]="copyValue"
                (cdkCopyToClipboardCopied)="OnCopied($event)"
                [cdkCopyToClipboardAttempts]="5">
            <mat-icon>content_copy</mat-icon>
        </button>
    `,
    imports: [
        MatIconModule,
        ClipboardModule,
        MatButtonModule,
        CommonModule,
    ],
    standalone: true,
})
export class XmCopyIconComponent implements XmDynamicPresentation<unknown, XmCopyIconOptions>, OnInit, OnChanges {
    @Input() public value: unknown;
    @Input() public config: XmCopyIconOptions = clone(XM_COPY_ICON_OPTIONS);

    public copyValue: string;

    constructor(
        private snackBar: MatSnackBar,
        private translate: XmTranslateService,
    ) {
    }

    public update(): void {
        this.copyValue = this.translate.translate(
            this.config?.template || XM_COPY_ICON_OPTIONS.template,
            { value: this.value },
        );
    }

    public ngOnChanges(): void {
        this.update();
    }

    public ngOnInit(): void {
        this.update();
    }

    public OnCopied(isCopied: boolean): void {
        if (isCopied && this.config?.copiedMessage) {
            this.snackBar.open(
                this.translate.translate(this.config.copiedMessage, { value: this.value }),
                null,
                { duration: 1400 });
        }
    }
}
