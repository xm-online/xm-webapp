import { Component, EventEmitter, Input, OnInit, OnChanges, Output, ViewChild, SimpleChanges } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { JhiEventManager } from 'ng-jhipster';
import { finalize } from 'rxjs/operators';
import { Principal } from '../../shared/auth/principal.service';
import { buildJsfAttributes, nullSafe } from '../../shared/jsf-extention/jsf-attributes-helper';
import { EntityCardComponent } from '../entity-card/entity-card.component';
import { RatingListSectionComponent } from '../rating-list-section/rating-list-section.component';
import { XmEntityService } from '../shared/xm-entity.service';

// transferred from entity-detail-fab
import { EntityUiConfig } from '../../shared/spec/xm-ui-config-model';
import { EntityDetailDialogComponent } from '../entity-detail-dialog/entity-detail-dialog.component';

declare let swal: any;

@Component({
    selector: 'xm-entity-card-compact',
    templateUrl: './entity-card-compact.component.html',
    styleUrls: ['./entity-card-compact.component.scss'],
})
export class EntityCardCompactComponent extends EntityCardComponent implements OnInit, OnChanges {

    @ViewChild('rating', {static: false}) public rating: RatingListSectionComponent;

    @Input() public preventDefaultUpdateError?: boolean;
    @Input() public entityUiConfig: EntityUiConfig;
    @Output() public onSaveError: EventEmitter<boolean> = new EventEmitter<boolean>();

    public jsfAttributes: any;
    public showLoader: boolean;
    public isDescFull: boolean;

    // transferred from entity-detail-fab
    public showEditButton: boolean;
    public showEditOptions: boolean = false;
    public showEditSubOptions: boolean = false;

    constructor(
        protected modalService: NgbModal,
        public principal: Principal,
        protected eventManager: JhiEventManager,
        protected translateService: TranslateService,
        protected xmEntityService: XmEntityService,
    ) {
        super(modalService, principal, eventManager);
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.loadJsfAttr();
    }

// transferred from entity-detail-fab
    public ngOnChanges(changes: SimpleChanges): void {
        this.showEditButton = true;

        const currentKey = changes.xmEntitySpec.currentValue.key;
        const uiConfigKey = this.entityUiConfig && this.entityUiConfig.typeKey;

        if (currentKey && uiConfigKey && currentKey === uiConfigKey) {
            this.checkEntityEditPermission(this.entityUiConfig);
        }
    }

// transferred from entity-detail-fab
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

// transferred from entity-detail-fab
    public onEdit(): void {
        this.openDialog(EntityDetailDialogComponent, (modalRef) => {
            modalRef.componentInstance.xmEntity = Object.assign({}, this.xmEntity);
            modalRef.componentInstance.xmEntitySpec = this.xmEntitySpec;
        });
    }

// transferred from entity-detail-fab
    private openDialog(dialogClass: any, operation: any, options?: any): NgbModalRef {
        const modalRef = this.modalService.open(dialogClass, options ? options : {backdrop: 'static'});
        modalRef.componentInstance.xmEntity = this.xmEntity;
        operation(modalRef);
        return modalRef;
    }

// transferred from entity-detail-fab
    public xmEditContext(): () => any {
        return () => {
            // this flag turns off
            this.showEditOptions = true;
            return this.showEditOptions;
        };
    }


    public onSubmitForm(data: any): void {
        this.showLoader = true;
        this.xmEntity.data = Object.assign({}, data);
        this.xmEntityService.update(this.xmEntity).pipe(finalize(() => this.showLoader = false))
            .subscribe(
                (res) => {
                    this.eventManager.broadcast({name: 'xmEntityDetailModification', content: {entity: res.body}});
                    this.xmEntity = Object.assign(this.xmEntity, res.body);
                    this.alert('success', 'xm-entity.entity-data-card.update-success');
                },
                (err) => {
                    if (!this.preventDefaultUpdateError) {
                        this.alert('error', 'xm-entity.entity-data-card.update-error');
                    } else {
                        this.onSaveError.emit(err);
                    }
                },
            );
    }

    protected loadJsfAttr(): void {
        if (this.xmEntitySpec && this.xmEntitySpec.dataSpec) {
            this.jsfAttributes = buildJsfAttributes(this.xmEntitySpec.dataSpec, this.xmEntitySpec.dataForm);
            this.jsfAttributes.data = Object.assign(nullSafe(this.jsfAttributes.data), nullSafe(this.xmEntity.data));
        }
    }

    protected alert(type: string, key: string): void {
        swal({
            type,
            text: this.translateService.instant(key),
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-primary',
        });
    }

}
