import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { XmAlertService } from '@xm-ngx/alert';
import { XmEventManager } from '@xm-ngx/core';
import { XmToasterService } from '@xm-ngx/toaster';

import { getFieldValue } from '../../entity-list-helper';
import { FieldOptions } from '../entity-list-card/entity-list-card-options.model';
import { FullLinkSpec } from '@xm-ngx/core/entity';
import { Link } from '@xm-ngx/core/entity';
import { LinkService } from '@xm-ngx/core/entity';
import { XmEntity } from '@xm-ngx/core/entity';
import { Principal } from '@xm-ngx/core/user';

const LINK_DELETE_PERMISSION = 'LINK.DELETE';

@Component({
    selector: 'xm-link-list-card',
    templateUrl: './link-list-card.component.html',
    styleUrls: ['./link-list-card.component.scss'],
})
export class LinkListCardComponent implements OnInit, OnChanges {

    @Input() public xmEntity: XmEntity;
    @Input() public links: Link[];
    @Input() public linkSpec: FullLinkSpec;
    @Input() public modes: string[] = ['list'];
    @Input() public isBackLink: boolean = false;

    public isCardVisible: boolean = false;

    public mode: string = 'list';
    public treeRootLinks: Link[];
    public columnsToDisplay: string[] = ['avatar', 'name', 'description', 'delete'];
    public fields: FieldOptions[] = [
        {
            title: {trKey: 'xm-entity.common.fields.name'},
            field: 'name',
        },
        {
            title: {trKey: 'xm-entity.common.fields.description'},
            field: 'description',
        },
    ];
    public deletePermission: string = LINK_DELETE_PERMISSION;

    constructor(private linkService: LinkService,
                private eventManager: XmEventManager,
                private toasterService: XmToasterService,
                private alertService: XmAlertService,
                public principal: Principal,
                private translateService: TranslateService) {
        this.principal.identity().then(identity => {
            if (identity.privileges.filter(it => it.startsWith(`${LINK_DELETE_PERMISSION}.`)).length > 0) {
                this.deletePermission = `${LINK_DELETE_PERMISSION}.${this.linkSpec.model.key}`;
            }
        });
    }

    public ngOnInit(): void {

        const itemsPresent = Boolean(this.links.length);
        const hideEmptyCard = Boolean(this.linkSpec.interface) && Boolean(this.linkSpec.interface.hideIfEmpty);
        //Hide card only if (hideIfEmpty = true and no elements present in list)
        this.isCardVisible = itemsPresent || (!itemsPresent && !hideEmptyCard);

        if (this.linkSpec.interface && this.linkSpec.interface.fields) {
            this.fields = this.linkSpec.interface.fields;
            this.columnsToDisplay = this.fields.map(field => field.field);
        }

        if (this.isBackLink) {
            this.columnsToDisplay = this.columnsToDisplay.filter((c) => c !== 'delete');
        }
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.links
            && this.valueToLength(changes.links.previousValue) !== this.valueToLength(changes.links.currentValue)) {
            const link: Link = {};
            link.target = this.xmEntity;
            this.treeRootLinks = [link];
        }
    }

    public onRemove(link: Link): void {
        this.alertService.open({
            title: this.translateService.instant('xm-entity.link-list-card.delete.title'),
            showCancelButton: true,
            confirmButtonText: this.translateService.instant('xm-entity.link-list-card.delete.button'),
        }).subscribe((result) => {
            if (result.value) {
                this.linkService.delete(link.id).subscribe(
                    () => this.toasterService.success('xm-entity.link-list-card.delete.remove-success'),
                    () => this.toasterService.error('xm-entity.link-list-card.delete.remove-error'),
                    () => this.eventManager.broadcast({
                        name: 'linkListModification',
                    }),
                );
            }
        });
    }

    public getFieldValue(xmEntity: any = {}, field: FieldOptions): any {
        return getFieldValue(xmEntity, field);
    }

    private valueToLength(value: any[]): any {
        return value ? value.length : 0;
    }
}
