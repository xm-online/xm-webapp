import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';
import { Subscription } from 'rxjs';
import { AttachmentDetailDialogComponent } from '../attachment-detail-dialog/attachment-detail-dialog.component';
import { CommentDetailDialogComponent } from '../comment-detail-dialog/comment-detail-dialog.component';
import { EntityDetailDialogComponent } from '../entity-detail-dialog/entity-detail-dialog.component';
import { LinkDetailDialogComponent } from '../link-detail-dialog/link-detail-dialog.component';
import { LocationDetailDialogComponent } from '../location-detail-dialog/location-detail-dialog.component';
import { Spec } from '../shared/spec.model';
import { XmEntitySpec } from '../shared/xm-entity-spec.model';
import { XmEntity } from '../shared/xm-entity.model';
import {Principal} from '../../shared';

@Component({
    selector: 'xm-entity-detail-fab',
    templateUrl: './entity-detail-fab.component.html',
    styleUrls: ['./entity-detail-fab.component.scss']
})
export class EntityDetailFabComponent implements OnInit, OnDestroy {

    private eventSubscriber: Subscription;

    @Input() xmEntity: XmEntity;
    @Input() xmEntitySpec: XmEntitySpec;
    @Input() spec: Spec;

    view = {
        attachment: false,
        location: false,
        links: false,
        comment: false,

        isEditable: false,

        isFabVisible: false,

        isSubMenuVisible(): boolean {
          return this.attachment || this.location || this.links || this.comment;
        },
        updateFabState(): void {
            const subMenus = this.isSubMenuVisible();
            this.isFabVisible = subMenus || this.isEditable;
        },
    };

    constructor(private eventManager: JhiEventManager,
                private modalService: NgbModal,
                private principal: Principal) {
        this.registerChangeInXmEntities();
    }

    private registerChangeInXmEntities() {
        this.eventSubscriber = this.eventManager.subscribe('xmEntityDetailModification',
            (response) => this.view.updateFabState());
    }

    /**
     * Using these assignments instead of xmPermitted directive in template,
     * because of the need to combine multiple conditions for some elements
     */
    ngOnInit() {
        this.view.attachment = this.principal.hasPrivilegesInline(['ATTACHMENT.CREATE']) && this.xmAttachmentContext()();
        this.view.links = this.principal.hasPrivilegesInline(['LINK.CREATE']) && this.xmLinksContext()();
        this.view.location = this.principal.hasPrivilegesInline(['LOCATION.CREATE']) && this.xmLocationContext()();
        this.view.comment = this.principal.hasPrivilegesInline(['COMMENT.CREATE']) && this.xmCommentContext()();

        this.view.isEditable = this.principal.hasPrivilegesInline(['ENTITY.UPDATE']) && this.xmEditContext()();

        this.view.updateFabState();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    xmEditContext(): Function  {
        return () => true;
            // let shouldHideEdit = false;
            /*if (this.xmEntitySpec.dataForm) {
                try {
                    const formSpec = interpolate(this.xmEntitySpec.dataForm);
                    shouldHideEdit = formSpec && formSpec.entity && formSpec.entity.hideNameAndDescription;
                } finally {
                }
            }*/
    }

    xmAttachmentContext(): Function  {
        return () => !!(this.xmEntitySpec.attachments && this.xmEntitySpec.attachments.length);
    }

    xmLinksContext(): Function {
        return () => !!(this.xmEntitySpec  && this.xmEntitySpec.links && this.xmEntitySpec.links.length);
    }

    xmLocationContext(): Function {
        return () => !!(this.xmEntitySpec.locations && this.xmEntitySpec.locations.length);
    }

    xmCommentContext(): Function  {
        return () => !!(this.xmEntitySpec.comments && this.xmEntitySpec.comments.length);
    }

    onRefresh() {
        this.eventManager.broadcast({name: 'xmEntityDetailModification', content: {entity: this.xmEntity}});
    }

    onAddAttachment() {
        return this.openDialog(AttachmentDetailDialogComponent, modalRef => {
            modalRef.componentInstance.attachmentSpecs = this.xmEntitySpec.attachments;
        });
    }

    onAddLink(linkSpec) {
        return this.openDialog(LinkDetailDialogComponent, modalRef => {
            modalRef.componentInstance.linkSpec = linkSpec;
            modalRef.componentInstance.sourceXmEntity = this.xmEntity;
            modalRef.componentInstance.spec = this.spec;
        });
    }

    onAddComment() {
        return this.openDialog(CommentDetailDialogComponent, modalRef => {
            modalRef.componentInstance.commentSpecs = this.xmEntitySpec.comments;
        });
    }

    onAddALocation() {
        return this.openDialog(LocationDetailDialogComponent, modalRef => {
            modalRef.componentInstance.locationSpecs = this.xmEntitySpec.locations;
        }, {size: 'lg', backdrop: 'static'});
    }

    onEdit() {
        return this.openDialog(EntityDetailDialogComponent, modalRef => {
            modalRef.componentInstance.xmEntity = Object.assign({}, this.xmEntity);
            modalRef.componentInstance.xmEntitySpec = this.xmEntitySpec;
        });
    }

    private openDialog(dialogClass, operation, options?) {
        const modalRef = this.modalService.open(dialogClass, options ? options : {backdrop: 'static'});
        modalRef.componentInstance.xmEntity = this.xmEntity;
        operation(modalRef);
        return modalRef;
    }

}
