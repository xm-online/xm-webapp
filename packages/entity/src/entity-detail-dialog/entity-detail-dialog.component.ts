import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, Input, NgModule, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { LoaderModule } from '@xm-ngx/components/loader';
import { ModalCloseModule } from '@xm-ngx/components/modal-close';
import { XmEventManager } from '@xm-ngx/core';
import { Spec, XmEntity, XmEntityService, XmEntitySpec } from '@xm-ngx/core/entity';
import { JsfAttributes, XmJsonSchemaFormModule } from '@xm-ngx/json-schema-form';
import { JsfComponentRegistryService, nullSafe } from '@xm-ngx/json-schema-form/components';
import { stringSubstitute } from '@xm-ngx/operators';
import { LanguageModule, XmTranslationModule } from '@xm-ngx/translation';

import { UUID } from 'angular2-uuid';
import { finalize } from 'rxjs/operators';
import { XM_ENTITY_EVENT_LIST } from '../constants';

@Component({
    selector: 'xm-entity-detail-dialog',
    templateUrl: './entity-detail-dialog.component.html',
    standalone: false,
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

    constructor(private activeModal: MatDialogRef<EntityDetailDialogComponent>,
                private changeDetector: ChangeDetectorRef,
                private xmEntityService: XmEntityService,
                private eventManager: XmEventManager,
                protected widgetService: JsfComponentRegistryService,
    ) {
        this.nameValidPattern = null;
    }

    public ngOnInit(): void {
        this.isEdit = !!(this.xmEntity && this.xmEntity.id);
        if (this.isEdit) {
            this.name = this.xmEntity.name;
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

        if ((this.jsfAttributes?.entity?.hideNameAndDescription || this.selectedXmEntitySpec.namePattern) && !this.xmEntity.name) {
            this.xmEntity.name = '###';
        } else if (this.xmEntity.name === '###') {
            this.xmEntity.name = '';
        }
    }

    public onConfirmSave(): void {
        this.showLoader = true;

        const applyPatterns = (e: XmEntity) => {
            if (this.selectedXmEntitySpec?.namePattern) {
                e.name = stringSubstitute(this.selectedXmEntitySpec.namePattern, e);
            }
            if (this.selectedXmEntitySpec?.descriptionPattern) {
                e.description = stringSubstitute(this.selectedXmEntitySpec.descriptionPattern, e);
            }
        };

        if (this.xmEntity.id != null) {
            applyPatterns(this.xmEntity);
            this.xmEntityService.update(this.xmEntity)
                .pipe(finalize(() => this.showLoader = false))
                .subscribe(r => this.onSaveSuccess(r.body), e => this.onConfirmError(e));
            return;
        }

        this.xmEntity.stateKey = this.selectedXmEntitySpec.states?.length
            ? this.selectedXmEntitySpec.states[0].key
            : null;

        this.xmEntityService.create(this.xmEntity)
            .subscribe({
                next: (resp) => {
                    const created = resp.body as XmEntity;

                    applyPatterns(created);

                    this.xmEntityService.update(created)
                        .pipe(finalize(() => this.showLoader = false))
                        .subscribe(r => this.onSaveSuccess(r.body), e => this.onConfirmError(e));
                },
                error: (e) => this.onConfirmError(e),
            });
    }
    
    public onCancel(): void {
        this.activeModal.close(false);
    }

    public onChangeForm(data: any): void {
        this.xmEntity.data = data;
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
