import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { XmAlertService } from '@xm-ngx/alert';
import { SKIP_ERROR_HANDLER_INTERCEPTOR_HEADERS, XmEventManager } from '@xm-ngx/core';

/**
 *
 * @privateRemarks
 * transferred from entity-detail-fab
 */
import { EntityDetailDisplayMode, EntityUiConfig } from '@xm-ngx/core/config';
import { XmEntityService } from '@xm-ngx/core/entity';
import { Principal, UserService } from '@xm-ngx/core/user';
import { JsfAttributes } from '@xm-ngx/json-schema-form';
import { JsfComponentRegistryService, nullSafe } from '@xm-ngx/json-schema-form/components';
import { XmToasterService } from '@xm-ngx/toaster';
import { of } from 'rxjs';
import { catchError, finalize, take } from 'rxjs/operators';
import { EntityCardComponent } from '../entity-card/entity-card.component';
import { EntityDetailDialogComponent } from '../entity-detail-dialog/entity-detail-dialog.component';
import { RatingListSectionComponent } from '../rating-list-section/rating-list-section.component';

@Component({
    selector: 'xm-entity-card-compact',
    templateUrl: './entity-card-compact.component.html',
    styleUrls: ['./entity-card-compact.component.scss'],
    standalone: false,
})
export class EntityCardCompactComponent extends EntityCardComponent implements OnInit, OnChanges {

    @ViewChild('rating', {static: false}) public rating: RatingListSectionComponent;

    @Input() public navBackEnabled?: boolean;
    @Input() public displayMode?: EntityDetailDisplayMode = 'BOTH';
    @Input() public preventDefaultUpdateError?: boolean;
    @Input() public entityUiConfig: EntityUiConfig;
    @Output() public saveError: EventEmitter<boolean> = new EventEmitter<boolean>();

    public jsfAttributes: JsfAttributes;
    public showLoader: boolean;
    public isDescFull: boolean;
    public updatedBy: string;
    public createdBy: string;

    // transferred from entity-detail-fab
    public showEditButton: boolean;
    public showEditOptions: boolean = false;
    public showEditSubOptions: boolean = false;

    constructor(
        protected modalService: MatDialog,
        protected principal: Principal,
        private alertService: XmAlertService,
        private toasterService: XmToasterService,
        protected eventManager: XmEventManager,
        protected translateService: TranslateService,
        protected xmEntityService: XmEntityService,
        protected widgetService: JsfComponentRegistryService,
        private location: Location,
        protected userService: UserService,
    ) {
        super(modalService, principal, eventManager);
    }

    public onBack(): void {
        this.location.back();
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.loadJsfAttr();
        this.getName(this.xmEntity?.updatedBy, this.entityUiConfig?.userInfoSource, 'updatedBy');
        this.getName(this.xmEntity?.createdBy, this.entityUiConfig?.userInfoSource, 'createdBy');
    }

    public getName(code: string, type: string, valueKey: string): void {
        if (!code) return;
        if (type === 'uaa') {
            this.userService.findPublic(code).pipe(
                catchError(() => of(null)),
            ).subscribe(res => this[valueKey] = `${res.firstName} ${res.lastName}`);
        } else if (type === 'profile') {
            this.xmEntityService.getById(code, null, SKIP_ERROR_HANDLER_INTERCEPTOR_HEADERS).pipe(
                catchError(() => of(null)),
            ).subscribe(res => this[valueKey] = res.name);
        }
    };

    /**
     *
     * @privateRemarks
     * transferred from entity-detail-fab
     */
    public ngOnChanges(changes: SimpleChanges): void {
        this.showEditButton = true;

        const currentKey = changes?.xmEntitySpec?.currentValue.key;
        const uiConfigKey = this.entityUiConfig && this.entityUiConfig.typeKey;

        if (currentKey && uiConfigKey && currentKey === uiConfigKey) {
            this.checkEntityEditPermission(this.entityUiConfig);
        }
    }

    /**
     *
     * @privateRemarks
     * transferred from entity-detail-fab
     */
    public onEdit(): void {
        this.openDialog(EntityDetailDialogComponent, (modalRef) => {
            modalRef.componentInstance.xmEntity = Object.assign({}, this.xmEntity);
            modalRef.componentInstance.xmEntitySpec = this.xmEntitySpec;
        });
    }

    /**
     *
     * @privateRemarks
     * transferred from entity-detail-fab
     */
    public xmEditContext(): () => boolean {
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
                    this.toasterService.success('xm-entity.entity-data-card.update-success');
                },
                (err) => {
                    if (!this.preventDefaultUpdateError) {
                        !err.handled && this.toasterService.error('xm-entity.entity-data-card.update-error');
                    } else {
                        this.saveError.emit(err);
                    }
                },
            );
    }

    public rebuildForm(): void {
        this.loadJsfAttr();
    }

    protected loadJsfAttr(): void {
        if (this.xmEntitySpec && this.xmEntitySpec.dataSpec) {
            this.jsfAttributes = this.widgetService.buildJsfAttributes(this.xmEntitySpec.dataSpec, this.xmEntitySpec.dataForm);
            this.jsfAttributes.data = Object.assign(nullSafe(this.jsfAttributes.data), nullSafe(this.xmEntity.data));
        }
    }

    protected alert(type: string, key: string): void {
        this.alertService.open({
            type,
            text: this.translateService.instant(key),
        }).pipe(take(1)).subscribe();
    }

    /**
     *
     * @privateRemarks
     * transferred from entity-detail-fab
     */
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

    /**
     *
     * @privateRemarks
     * transferred from entity-detail-fab
     */
    private openDialog(dialogClass: any, operation: any, options?: any): MatDialogRef<any> {
        const modalRef = this.modalService.open<any>(dialogClass, options ? options : {width: '500px'});
        modalRef.componentInstance.xmEntity = this.xmEntity;
        operation(modalRef);
        return modalRef;
    }

}
