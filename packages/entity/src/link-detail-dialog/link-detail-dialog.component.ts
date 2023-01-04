import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { LinkSpec } from '../shared/link-spec.model';
import { Spec } from '../shared/spec.model';
import { XmEntity } from '../shared/xm-entity.model';
import { JsonSchemaFormService } from '@ajsf/core';

@Component({
    selector: 'xm-link-detail-dialog',
    templateUrl: './link-detail-dialog.component.html',
    providers: [JsonSchemaFormService],
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
