import { Component } from '@angular/core';
import { AttachmentListBaseComponent } from './attachment-list-base.component';

@Component({
    selector: 'xm-attachment-list',
    template: `
        <div class="row">
            <div class="col-xl-2 col-lg-3 col-md-4" *ngFor="let attachment of attachments">
                <xm-attachment-card [attachment]="attachment" [attachmentSpec]="getAttachmentSpec(attachment)">
                </xm-attachment-card>
            </div>
        </div>
    `,
    styleUrls: ['./attachment-list.component.scss'],
})
export class AttachmentListComponent extends AttachmentListBaseComponent {

}
