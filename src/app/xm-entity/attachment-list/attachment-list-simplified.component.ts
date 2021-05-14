import { Component, OnInit } from '@angular/core';
import { AttachmentListBaseComponent } from './attachment-list-base.component';

@Component({
    selector: 'xm-attachment-list-simplified',
    template: `
        <div class="card">
            <div class="card-header card-header-icon card-header-primary">
                <div class="card-icon">
                    <mat-icon>{{'attach_file'}}</mat-icon>
                </div>
                <h4 class="card-title">{{'xm-entity.attachment-card.title'|translate}}</h4>
            </div>

            <div class="card-body">
                <div class="dropdown xm-entity-attachment-actions">
                    <button mat-icon-button [matMenuTriggerFor]="entityListActions">
                        <mat-icon>more_vert</mat-icon>
                    </button>

                    <mat-menu #entityListActions="matMenu">
                        <button mat-menu-item class="btn-sm" (click)="onRefresh()">
                            {{'xm-entity.entity-list-card.refresh' | translate}}
                        </button>
                        <button mat-menu-item class="btn-sm" (click)="onAddAttachment()"
                                *xmPermitted="['ATTACHMENT.CREATE']; context: xmAttachmentContext()">
                            {{'xm-entity.common.add' | translate}}
                        </button>
                    </mat-menu>
                </div>
                <ng-container *ngIf="attachments?.length; then listTemplate; else emptyTemplate">
                </ng-container>
                <ng-template #listTemplate>
                    <div class="table-responsive sm-overflow">
                        <table class="table table-striped">
                            <thead>
                            <tr>
                                <th></th>
                                <th><span>{{'xm-entity.common.fields.name'|translate}}</span></th>
                                <th><span>{{'xm-entity.common.fields.description'|translate}}</span></th>
                                <th></th>
                                <th></th>
                            </tr>
                            </thead>

                            <tbody>
                            <tr *ngFor="let attachment of attachments">
                                <td>
                                    <div class="xm-avatar-img-container">
                                        <img src="./assets/img/placeholder.png">
                                        <mat-icon class="xm-avatar-icon">attach_file</mat-icon>
                                    </div>
                                </td>
                                <td>{{attachment.name}}</td>
                                <td>{{getAttachmentSpec(attachment)?.name | translate}}</td>
                                <td>{{getFileSize(attachment, 2)}} ({{attachment.valueContentType}})</td>
                                <td>
                                    <a href="javascript: void(0);"
                                       (click)="onDownload(attachment)"
                                       *xmPermitted="['ATTACHMENT.GET_LIST.ITEM']">
                                        <mat-icon>cloud_download</mat-icon>
                                    </a>
                                    &nbsp;
                                    <a href="javascript: void(0);"
                                       (click)="onRemove(attachment)"
                                       *xmPermitted="['ATTACHMENT.DELETE']">
                                        <mat-icon>delete</mat-icon>
                                    </a>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </ng-template>
                <ng-template #emptyTemplate>
                    <no-data [hideImage]="true" [show]="true" [text]="noDataText"></no-data>
                </ng-template>
            </div>
        </div>`,
    styleUrls: ['./attachment-list.component.scss'],
})
export class AttachmentListSimplifiedComponent extends AttachmentListBaseComponent implements OnInit {

    public noDataText: any;

    public ngOnInit(): void {
        super.ngOnInit();
        if (this.entityUiConfig.attachments && this.entityUiConfig.attachments.noData) {
            this.noDataText = this.entityUiConfig.attachments.noData;
        }
    }
}
