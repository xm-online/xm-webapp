import { Component } from '@angular/core';

@Component({
    selector: 'xm-modal-close, modal-close',
    template: `
        <button class="mat-dialog-close" type="button" tabindex="-1" mat-icon-button>
          <mat-icon>close</mat-icon>
        </button>
    `,
})
export class ModalCloseComponent {}
