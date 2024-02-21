import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import {
    TranslationModalComponent
} from '@xm-ngx/administration/translations/translation-modal/translation-modal.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'xm-translation-add',
    standalone: true,
    imports: [CommonModule, MatButtonModule],
    template: `
        <button mat-stroked-button color="primary" (click)="openAddTranslationModal()">Add Translation</button>`,
    styleUrl: './translation-add.component.scss',
})
export class TranslationAddComponent {
    @Input() public config: any;
    @Output() public createEvent: EventEmitter<string> = new EventEmitter<string>();

    constructor(public dialog: MatDialog) {
    }

    public openAddTranslationModal(): void {
        const dialogRef = this.dialog.open(TranslationModalComponent, {
            width: '350px',
            data: this.config,
        });

        dialogRef.afterClosed().subscribe(result => {
            if(result) {
                this.createEvent.next(result);
            }
        });
    }

}
