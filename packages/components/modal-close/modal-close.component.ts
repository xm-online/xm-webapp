import { Component } from '@angular/core';

@Component({
    selector: 'xm-modal-close, modal-close',
    template: `
        <button class="mat-dialog-close"
                type="button"
                tabindex="-1"
                mat-icon-button>
            <mat-icon>close</mat-icon>
        </button>
    `,
    styles: [
        `
          :host {
            position: absolute;
            display: block;
            top: 0.5rem;
            right: 0.5rem;
          }
        `,
    ],
    standalone: false,
})
export class ModalCloseComponent {
}
