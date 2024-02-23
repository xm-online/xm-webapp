import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import {
    TranslationModalComponent
} from '@xm-ngx/administration/translations/translation-modal/translation-modal.component';
import { MatButtonModule } from '@angular/material/button';
import { XmTranslationModule } from '@xm-ngx/translation';

@Component({
    selector: 'xm-translation-add',
    standalone: true,
    imports: [CommonModule, MatButtonModule, XmTranslationModule],
    template: `
        <button mat-stroked-button color="primary" (click)="openAddTranslationModal()">
            {{ 'translate-management.modal.add' | translate }}
        </button>`,
    styleUrl: './translation-add.component.scss',
})
export class TranslationAddComponent {

    @Input() public config: ModalConfig;
    @Output() public createEvent: EventEmitter<string> = new EventEmitter<string>();

    constructor(public dialog: MatDialog) {
    }

    public openAddTranslationModal(): void {
        debugger
        const dialogRef = this.dialog.open(TranslationModalComponent, {
            width: '350px',
            data: this.config,
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.createEvent.next(result);
            }
        });
    }

}

interface ModalConfig {
    langs: string[]
}
