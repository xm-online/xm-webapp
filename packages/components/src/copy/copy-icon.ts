import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, OnChanges, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IComponent } from '@xm-ngx/dynamic';
import { Translate, TranslatePipe } from '@xm-ngx/translation';
import * as _ from 'lodash';
import { clone } from 'lodash';


export interface CopyIconOptions {
    template: string;
    copiedMessage: Translate;
}

export const COPY_ICON_OPTIONS: CopyIconOptions = {
    template: '${value}',
    copiedMessage: 'Copied.',
};

@Component({
    selector: 'copy-icon',
    template: `
        <button mat-icon-button
                *ngIf="copyValue"
                [cdkCopyToClipboard]="copyValue"
                (cdkCopyToClipboardCopied)="OnCopied($event)"
                [cdkCopyToClipboardAttempts]="5">
            <mat-icon>content_copy</mat-icon>
        </button>
    `,
})

export class CopyIconComponent implements IComponent<unknown, CopyIconOptions>, OnInit, OnChanges {
    @Input() public value: unknown;
    @Input() public options: CopyIconOptions = clone(COPY_ICON_OPTIONS);

    public copyValue: string;

    constructor(
        private snackBar: MatSnackBar,
        private translatePipe: TranslatePipe,
    ) {
    }

    public update(): void {
        this.copyValue = _.template(this.options?.template || COPY_ICON_OPTIONS.template)({ value: this.value });
    }

    public ngOnChanges(): void {
        this.update();
    }

    public ngOnInit(): void {
        this.update();
    }

    public OnCopied(isCopied: boolean): void {
        if (isCopied && this.options?.copiedMessage) {
            this.snackBar.open(this.translatePipe.transform(this.options.copiedMessage), null, { duration: 1400 });
        }
    }
}

@NgModule({
    imports: [
        MatIconModule,
        ClipboardModule,
        MatButtonModule,
        CommonModule,
    ],
    exports: [CopyIconComponent],
    declarations: [CopyIconComponent],
})
export class CopyIconModule {
}
