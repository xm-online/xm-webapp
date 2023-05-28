import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { TranslateService } from '@ngx-translate/core';
import { XmEventManager } from '@xm-ngx/core';
import { XmToasterService } from '@xm-ngx/toaster';
import { JhiDataUtils } from 'ng-jhipster';

import { Principal } from '@xm-ngx/core/user';
import { AttachmentSpec } from '@xm-ngx/core/entity';
import { Attachment } from '@xm-ngx/core/entity';
import { AttachmentService } from '@xm-ngx/core/entity';
import { XmEntity } from '@xm-ngx/core/entity';
import { finalize } from 'rxjs/operators';
import { FileTypeFallback } from './file-type-fallback';

const ATTACHMENT_EVENT = 'attachmentListModification';

@Component({
    selector: 'xm-attachment-detail-dialog',
    templateUrl: './attachment-detail-dialog.component.html',
    styleUrls: ['./attachment-detail-dialog.component.scss'],
})
export class AttachmentDetailDialogComponent implements OnInit {

    @Input() public xmEntity: XmEntity;
    @Input() public attachmentSpecs: AttachmentSpec[] = [];

    public attachment: Attachment = {};
    public showLoader: boolean;
    public readOnlyInputs: boolean;
    public wrongFileType: string;

    constructor(protected activeModal: MatDialogRef<AttachmentDetailDialogComponent>,
                protected attachmentService: AttachmentService,
                protected eventManager: XmEventManager,
                protected dataUtils: JhiDataUtils,
                protected toasterService: XmToasterService,
                protected translateService: TranslateService,
                protected principal: Principal) {
    }

    public get acceptedFileTypes(): string[] | '' {
        const attachmentSpec = this.attachmentSpecs.filter((att: any) => att.key === this.attachment.typeKey).shift();
        return (attachmentSpec && attachmentSpec.contentTypes)
            ? attachmentSpec.contentTypes : '';
    }

    public ngOnInit(): void {
        if (this.attachmentSpecs && this.attachmentSpecs.length) {
            this.attachment.typeKey = this.attachmentSpecs[0].key;
            this.attachment.name = this.attachmentSpecs[0].defaultFileName || '';
            this.readOnlyInputs = this.attachmentSpecs[0].isNameReadonly === true;
        }

        this.attachment.content = {};
    }


    public setFileData(event: any, nameCtrl: any): void {
        if (event.target.files && event.target.files[0]) {
            this.createAttachment(event.target.files, nameCtrl);
        }
    }

    public async dropFileData(files: any, nameCtrl: any): Promise<void> {
        if (files && files.length) {
            await this.createAttachment(files, nameCtrl);
        }
    }

    private async createAttachment(files: File[], nameCtrl: any): Promise<void> {
        const file = files[0];

        let type = file.type;

        // FIX: Windows 7z file empty type
        if (['', undefined].includes(type)) {
            const fallbackResponse = await FileTypeFallback.getFileType(file);

            if (fallbackResponse) {
                type = fallbackResponse.mime;
            }
        }

        // Content type validation
        const attachmentSpec = this.attachmentSpecs
            .filter((att: any) => att.key === this.attachment.typeKey).shift();

        if (attachmentSpec
            && attachmentSpec.contentTypes
            && attachmentSpec.contentTypes.filter((type: string) => type === type).length <= 0) {
            console.warn(`Not allowed content type ${type}`);
            this.wrongFileType = type;
            return;
        }

        this.wrongFileType = undefined;

        this.attachment.contentUrl = file.name;
        this.attachment.valueContentType = type;

        // Content assignment
        this.dataUtils.toBase64(file, (base64Data) => {
            this.attachment.content.value = base64Data;
        });

        // Default attachment name
        if (!this.attachmentSpecs[0]?.defaultFileName) {
            this.attachment.name = file.name;
            nameCtrl.classList.remove('is-empty');
        }
    }

    public byteSize(field: any, size: any): string {
        return !field ? `${size} ${this.translateService.instant('xm-entity.attachment-card.volume.bytes')}`
            : this.dataUtils.byteSize(field);
    }

    public onConfirmSave(): void {
        this.showLoader = true;
        this.attachment.xmEntity = {};
        this.attachment.xmEntity.id = this.xmEntity.id;
        this.attachment.xmEntity.typeKey = this.xmEntity.typeKey;
        this.attachment.startDate = new Date().toISOString();

        this.attachmentService.create(this.attachment)
            .pipe(
                finalize(() => this.showLoader = false),
            )
            .subscribe(() => this.onSaveSuccess(),
                (err) => console.warn(err));
    }

    public onCancel(): void {
        this.activeModal.close(false);
    }

    private onSaveSuccess(): void {
        // TODO: use constant for the broadcast and analyse listeners
        console.info('Fire %s', ATTACHMENT_EVENT);
        this.eventManager.broadcast({ name: ATTACHMENT_EVENT });
        this.activeModal.close(true);
        this.toasterService.success('xm-entity.attachment-detail-dialog.add.success');
    }

}
