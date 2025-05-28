import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { XmEventManager } from '@xm-ngx/core';
import { Comment, CommentService, CommentSpec, XmEntity } from '@xm-ngx/core/entity';

import { Principal } from '@xm-ngx/core/user';

import { XmToasterService } from '@xm-ngx/toaster';


@Component({
    selector: 'xm-comment-detail-dialog',
    templateUrl: './comment-detail-dialog.component.html',
    standalone: false,
})
export class CommentDetailDialogComponent implements OnInit {

    @Input() public xmEntity: XmEntity;
    @Input() public commentSpecs: CommentSpec[];

    public comment: Comment = {};
    public showLoader: boolean;

    constructor(private activeModal: MatDialogRef<CommentDetailDialogComponent>,
                private commentService: CommentService,
                private eventManager: XmEventManager,
                private toasterService: XmToasterService,
                private principal: Principal) {
    }

    public ngOnInit(): void {
        if (this.commentSpecs && this.commentSpecs.length > 0) {
            this.comment.typeKey = this.commentSpecs[0].key;
        }
    }

    public onConfirmSave(): void {
        this.showLoader = true;
        this.comment.xmEntity = this.xmEntity;
        this.comment.entryDate = new Date().toISOString();
        this.comment.userKey = this.principal.getUserKey();
        this.commentService.create(this.comment)
            .subscribe(() => this.onSaveSuccess(),
                (err) => this.onError(err),
                () => this.showLoader = false);
    }

    public onCancel(): void {
        this.activeModal.close(false);
    }

    private onError(e: any): void {
        console.warn(e);
        this.showLoader = false;
    }

    private onSaveSuccess(): void {
        // TODO: use constant for the broadcast and analyse listeners
        this.eventManager.broadcast({name: 'commentListModification'});
        this.activeModal.close(true);
        this.toasterService.success('xm-entity.comment-detail-dialog.add.success');
    }

}
