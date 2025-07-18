import { JsonSchemaFormService } from '@ajsf/core';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { LinkSpec, Spec, XmEntity } from '@xm-ngx/core/entity';

@Component({
    selector: 'xm-link-detail-dialog',
    templateUrl: './link-detail-dialog.component.html',
    providers: [JsonSchemaFormService],
    standalone: false,
})
export class LinkDetailDialogComponent implements OnInit {

    @Input() public linkSpec: LinkSpec;
    @Input() public sourceXmEntity: XmEntity;
    @Input() public spec: Spec;

    public xmEntity: XmEntity;
    public mode: string;

    constructor(private activeModal: MatDialogRef<LinkDetailDialogComponent>) {
    }

    public ngOnInit(): void {
        this.mode = this.linkSpec.builderType === 'NEW-OR-SEARCH' ? 'NEW' : this.linkSpec.builderType;
    }

    public onCancel(): void {
        this.activeModal.close(false);
    }
}
