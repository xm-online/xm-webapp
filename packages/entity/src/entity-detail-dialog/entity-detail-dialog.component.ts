import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, Input, NgModule, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { LanguageModule } from '@xm-ngx/translation';
import { LoaderModule } from '@xm-ngx/components/loader';
import { ModalCloseModule } from '@xm-ngx/components/modal-close';
import { XmEventManager } from '@xm-ngx/core';
import { JsfAttributes } from '@xm-ngx/json-schema-form';
import { XmJsonSchemaFormModule } from '@xm-ngx/json-schema-form';
import { XmTranslationModule } from '@xm-ngx/translation';

import { UUID } from 'angular2-uuid';
import { finalize } from 'rxjs/operators';
import { JsfComponentRegistryService } from '@xm-ngx/json-schema-form/components';
import * as formatString from 'string-template';

import { nullSafe } from '@xm-ngx/json-schema-form/components';
import { Spec } from '@xm-ngx/core/entity';
import { XmEntitySpec } from '@xm-ngx/core/entity';
import { XmEntity } from '@xm-ngx/core/entity';
import { XmEntityService } from '@xm-ngx/core/entity';
import { XM_ENTITY_EVENT_LIST } from '../constants';

@Component({
    selector: 'xm-entity-detail-dialog',
    templateUrl: './entity-detail-dialog.component.html',
})
export class EntityDetailDialogComponent implements OnInit, AfterViewInit {

    @Input() public xmEntity: XmEntity = {};
    @Input() public xmEntitySpec: XmEntitySpec;
    @Input() public spec: Spec;
    @Input() public onSuccess: any;

    public availableSpecs: XmEntitySpec[];
    public selectedXmEntitySpec: XmEntitySpec;
    public jsfAttributes: JsfAttributes;
    public name: string;
    public isEdit: boolean;
    public showLoader: boolean;
    public nameValidPattern: string;
    public isJsonFormValid: boolean = true;
    public smartDescription: any;

    constructor(private activeModal: MatDialogRef<EntityDetailDialogComponent>,
                private changeDetector: ChangeDetectorRef,
                private xmEntityService: XmEntityService,
                private eventManager: XmEventManager,
                protected widgetService: JsfComponentRegistryService
    ) {
        this.nameValidPattern = null;
        this.smartDescription = {
            active: false,
            value: '',
            template: '',
        };

    }

    public ngOnInit(): void {
        this.isEdit = !!(this.xmEntity && this.xmEntity.id);
        this.smartDescription.active = true;
        if (this.isEdit) {
            this.name = this.xmEntity.name;
            this.smartDescription.value = this.xmEntity.description;
            this.onChangeEntityType(this.xmEntitySpec);
        } else {
            if (this.spec && this.spec.types) {
                this.availableSpecs = this.spec.types
                    .filter((t) => this.filterSpecs(t));
                this.xmEntity.key = UUID.UUID();
                this.xmEntity.typeKey = this.availableSpecs[0].key;
                this.onChangeEntityType(null, this.xmEntity.typeKey);
            }
        }
    }

    public ngAfterViewInit(): void {
        this.changeDetector.detectChanges();
    }

    public onChangeEntityType(xmEntitySpec?: XmEntitySpec, typeKey?: string): void {
        if (!xmEntitySpec) {
            xmEntitySpec = this.availableSpecs.filter((s) => s.key === typeKey).shift();
        }
        this.xmEntity.typeKey = xmEntitySpec.key;
        this.selectedXmEntitySpec = xmEntitySpec;
        if (xmEntitySpec.dataSpec) {
            this.jsfAttributes = this.widgetService.buildJsfAttributes(xmEntitySpec.dataSpec, xmEntitySpec.dataForm);
            this.jsfAttributes.data = Object.assign(nullSafe(this.jsfAttributes.data), nullSafe(this.xmEntity.data));
        }
        this.nameValidPattern = xmEntitySpec.nameValidationPattern ? xmEntitySpec.nameValidationPattern : null;
        this.smartDescription.template = xmEntitySpec.descriptionPattern ? xmEntitySpec.descriptionPattern : null;

        if (this.jsfAttributes
            && this.jsfAttributes.entity
            && this.jsfAttributes.entity.hideNameAndDescription
            && !this.xmEntity.name) {
            this.xmEntity.name = '###';
        } else if (this.xmEntity.name === '###') {
            this.xmEntity.name = '';
        }
    }

    public onConfirmSave(): void {
        this.showLoader = true;
        this.xmEntity.description = this.smartDescription.value;
        if (this.xmEntity.id !== undefined) {
            this.xmEntityService.update(this.xmEntity).pipe(finalize(() => this.showLoader = false))
                .subscribe((resp) => this.onSaveSuccess(resp.body),
                    // TODO: error processing
                    (err) => this.onConfirmError(err));
        } else {
            this.xmEntity.stateKey = this.selectedXmEntitySpec.states && this.selectedXmEntitySpec.states.length ?
                Object.assign([], this.selectedXmEntitySpec.states).shift().key : null;
            this.xmEntityService.create(this.xmEntity).pipe(finalize(() => this.showLoader = false))
                .subscribe((resp) => this.onSaveSuccess(resp.body),
                    // TODO: error processing
                    (err) => this.onConfirmError(err));
        }
    }

    public onCancel(): void {
        this.activeModal.close(false);
    }

    public onChangeForm(data: any): void {
        this.xmEntity.data = data;
        this.formatSmartDescription(data);
    }

    private onConfirmError(err: any): void {
        console.info(err);
        // disable form spinner
        this.showLoader = false;
    }

    private onSaveSuccess(entity: XmEntity): void {
        // TODO: analyse listeners
        this.eventManager.broadcast({
            name: this.isEdit ? XM_ENTITY_EVENT_LIST.XM_ENTITY_DETAIL_MODIFICATION : XM_ENTITY_EVENT_LIST.XM_ENTITY_LIST_MODIFICATION,
            entityId: entity.id,
            entityType: entity.typeKey,
        });
        this.activeModal.close(true);
        if (this.onSuccess) {
            this.onSuccess();
        }
    }

    private formatSmartDescription(data: any): void {
        if (this.smartDescription.active && this.smartDescription.template) {
            this.smartDescription.value = formatString(this.smartDescription.template, data);
        }
    }

    private filterSpecs(t: XmEntitySpec): boolean {
        const matches = t.key.split(this.xmEntitySpec.key);
        const matchNext = matches && (matches.length > 1) && matches[1];
        return !t.isAbstract && ((matchNext && matchNext.startsWith('.')) || t.key === this.xmEntitySpec.key);
    }
}

@NgModule({
    imports: [
        LoaderModule,
        MatDialogModule,
        FormsModule,
        MatFormFieldModule,
        MatSelectModule,
        CommonModule,
        XmJsonSchemaFormModule,
        MatButtonModule,
        LanguageModule,
        MatInputModule,
        XmTranslationModule,
        MatIconModule,
        ModalCloseModule,
    ],
    exports: [EntityDetailDialogComponent],
    declarations: [EntityDetailDialogComponent],
    providers: [],
})
export class EntityDetailDialogModule {
}
