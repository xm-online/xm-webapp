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

@Component({
    selector: 'xm-entity-detail-fab',
    templateUrl: './entity-detail-fab.component.html',
    styleUrls: ['./entity-detail-fab.component.scss']
})
export class EntityDetailFabComponent implements OnInit, AfterViewInit, OnDestroy {

    private eventSubscriber: Subscription;

    @Input() xmEntity: XmEntity;
    @Input() xmEntitySpec: XmEntitySpec;
    @Input() spec: Spec;

    view = {
        loaded: false,
        attachment: false,
        location: false,
        links: false,
        comment: false,
        isEditable: false,

        isFabVisible: false,
        isReadOnlyMode: false,

        isSubMenuVisible(): boolean {
          return this.attachment || this.location || this.links || this.comment;
        },
        updateFabState(): void {
            const subMenus = this.isSubMenuVisible();
            this.isFabVisible = subMenus || this.isEditable || !this.loaded;
            this.isReadOnlyMode = subMenus && !this.isEditable;
        },
    };

    constructor(private eventManager: JhiEventManager,
                private modalService: NgbModal) {
        this.registerChangeInXmEntities();
    }

    private registerChangeInXmEntities() {
        this.eventSubscriber = this.eventManager.subscribe('xmEntityDetailModification',
            (response) => this.view.updateFabState());
    }

    /**
     * Triggers updateFabState with !loaded to process permissions
     */
    ngOnInit() {
        this.view.updateFabState();
    }

    /**
     * Sets loaded to true, to remove fab button if all conditions is false. updateFabState is called to re-evaluate *ngIf.
     */
    ngAfterViewInit() {
        this.view.loaded = true;
        this.view.updateFabState();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    xmEditContext(): Function  {
        return () => {
            // let shouldHideEdit = false;
            /*if (this.xmEntitySpec.dataForm) {
                try {
                    const formSpec = interpolate(this.xmEntitySpec.dataForm);
                    shouldHideEdit = formSpec && formSpec.entity && formSpec.entity.hideNameAndDescription;
                } finally {
                }
            }*/
            this.view.isEditable = true;
            this.view.updateFabState();
            console.log(`isEditable=${this.view.isEditable}`);
            return this.view.isEditable;
        };
    }

    xmAttachmentContext(): Function  {
        return () => {
            this.view.attachment = !!(this.xmEntitySpec.attachments && this.xmEntitySpec.attachments.length);
            this.view.updateFabState();
            console.log(`xmAttachmentContext=${this.view.attachment}`);
            return this.view.attachment
        };
    }

    xmLinksContext(): Function {
        return  () => {
            this.view.links = !!(this.xmEntitySpec  && this.xmEntitySpec.links && this.xmEntitySpec.links.length);
            this.view.updateFabState();
            console.log(`xmLocationContext=${this.view.links}`);
            return this.view.links
        };
    }

    xmLocationContext(): Function {
        return () => {
            this.view.location = !!(this.xmEntitySpec.locations && this.xmEntitySpec.locations.length);
            this.view.updateFabState();
            console.log(`xmLocationContext=${this.view.location}`);
            return this.view.location;
        }
    }

    xmCommentContext(): Function  {
        return () => {
            this.view.comment = !!(this.xmEntitySpec.comments && this.xmEntitySpec.comments.length);
            this.view.updateFabState();
            console.log(`xmCommentContext=${this.view.location}`);
            return this.view.comment;
        }
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
