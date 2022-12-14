import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { XmEventManager } from '@xm-ngx/core';
import { Subscription } from 'rxjs';

import { AttachmentDetailDialogComponent } from '../attachment-detail-dialog/attachment-detail-dialog.component';
import { CommentDetailDialogComponent } from '../comment-detail-dialog/comment-detail-dialog.component';
import { EntityDetailDialogComponent } from '../entity-detail-dialog/entity-detail-dialog.component';
import { LinkDetailDialogComponent } from '../link-detail-dialog/link-detail-dialog.component';
import { LocationDetailDialogComponent } from '../location-detail-dialog/location-detail-dialog.component';
import { Spec } from '../shared/spec.model';
import { XmEntitySpec } from '../shared/xm-entity-spec.model';
import { XmEntity } from '../shared/xm-entity.model';
import { EntityUiConfig } from 'src/app/shared/spec';
import { Principal } from '@xm-ngx/core/auth';

@Component({
    selector: 'xm-entity-detail-fab',
    templateUrl: './entity-detail-fab.component.html',
})
export class EntityDetailFabComponent implements OnInit, OnChanges, OnDestroy {

    @Input() public xmEntity: XmEntity;
    @Input() public xmEntitySpec: XmEntitySpec;
    @Input() public spec: Spec;
    @Input() public entityUiConfig: EntityUiConfig;

    public view: any = {attachment: false, location: false, link: false, comment: false};
    public showEditOptions: boolean = false;
    public showEditSubOptions: boolean = false;
    public showEditButton: boolean;
    private eventSubscriber: Subscription;

    constructor(private eventManager: XmEventManager,
                private modalService: MatDialog,
                private principal: Principal,
    ) {
        this.registerChangeInXmEntities();
    }

    public ngOnInit(): void {
        this.detectViewBtns();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        this.showEditButton = true;

        const currentKey = changes.xmEntitySpec.currentValue.key;
        const uiConfigKey = this.entityUiConfig && this.entityUiConfig.typeKey;

        if (changes.xmEntity && changes.xmEntity.previousValue !== changes.xmEntity.currentValue) {
            this.detectViewBtns();
        }

        if (currentKey && uiConfigKey && currentKey === uiConfigKey) {
            this.checkEntityEditPermission(this.entityUiConfig);
        }
    }

    private checkEntityEditPermission(config: EntityUiConfig): void {
        if (config.editButtonPermission) {
            this.showEditButton = false;
            this.principal.hasPrivileges([config.editButtonPermission]).then((result) => {
                if (result) {
                    this.showEditButton = true;
                }
            });
        }
    }

    public ngOnDestroy(): void {
        this.eventManager.destroy(this.eventSubscriber);
    }

    public xmEditContext(): () => any {
        return () => {
            // this flag turns off
            this.showEditOptions = true;
            return this.showEditOptions;
        };
    }

    public xmAttachmentContext(): () => any {
        return () => this.view.attachment;
    }

    public xmLinksContext(): () => any {
        return () => this.view.link;
    }

    public xmLocationContext(): () => any {
        return () => this.view.location;
    }

    public xmCommentContext(): () => any {
        return () => this.view.comment;
    }

    public onRefresh(): void {
        this.eventManager.broadcast({name: 'xmEntityDetailModification', content: {entity: this.xmEntity}});
    }

    public onAddAttachment(): void {
        this.openDialog(AttachmentDetailDialogComponent, (modalRef) => {
            modalRef.componentInstance.attachmentSpecs = this.xmEntitySpec.attachments;
        });
    }

    public onAddLink(linkSpec: any): void {
        this.openDialog(LinkDetailDialogComponent, (modalRef) => {
            modalRef.componentInstance.linkSpec = linkSpec;
            modalRef.componentInstance.sourceXmEntity = this.xmEntity;
            modalRef.componentInstance.spec = this.spec;
        });
    }

    public onAddComment(): void {
        this.openDialog(CommentDetailDialogComponent, (modalRef) => {
            modalRef.componentInstance.commentSpecs = this.xmEntitySpec.comments;
        });
    }

    public onAddALocation(): void {
        this.openDialog(LocationDetailDialogComponent, (modalRef) => {
            modalRef.componentInstance.locationSpecs = this.xmEntitySpec.locations;
        }, {size: 'lg', backdrop: 'static'});
    }

    public onEdit(): void {
        this.openDialog(EntityDetailDialogComponent, (modalRef) => {
            modalRef.componentInstance.xmEntity = Object.assign({}, this.xmEntity);
            modalRef.componentInstance.xmEntitySpec = this.xmEntitySpec;
        });
    }

    private registerChangeInXmEntities(): void {
        this.eventSubscriber = this.eventManager.subscribe('xmEntityDetailModification', () => this.detectViewBtns());
    }

    private detectViewBtns(): void {
        this.view.attachment = !!(this.xmEntitySpec.attachments && this.xmEntitySpec.attachments.length);
        this.view.location = !!(this.xmEntitySpec.locations && this.xmEntitySpec.locations.length);
        this.view.link = !!(this.xmEntitySpec.links && this.xmEntitySpec.links.length);
        this.view.comment = !!(this.xmEntitySpec.comments);
        this.showEditSubOptions = this.view.attachment || this.view.location || this.view.link || this.view.comment ||
            (this.xmEntitySpec && this.xmEntitySpec.links && this.xmEntitySpec.links.length > 0);
    }

    private openDialog(dialogClass: any, operation: any, options?: any): MatDialogRef<any> {
        const modalRef = this.modalService.open<any>(dialogClass, options ? options : {width: '500px'});
        modalRef.componentInstance.xmEntity = this.xmEntity;
        operation(modalRef);
        return modalRef;
    }
}
