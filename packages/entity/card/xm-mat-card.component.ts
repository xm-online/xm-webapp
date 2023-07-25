import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {matExpansionAnimations} from '@angular/material/expansion';
import {
    EditWidgetButtonsEvent,
    EditWidgetButtonsEventType,
} from '@xm-ngx/components/edit-buttons';

import {IId, JavascriptCode} from '@xm-ngx/interfaces';
import {Translate} from '@xm-ngx/translation';
import {PageChangesStore, PageChangesStoreType} from '@xm-ngx/core/dashboard';

export interface XmMatCardOptions {
    cardClass?: string;
    contentClass?: string;
    actionClass?: string;
    editCondition: JavascriptCode;
    title: Translate;
    readonly: boolean;
    dataQa?: string;
    condition: JavascriptCode;
    permission?: string[];
    editPermission?: string[];
    collapsableContent?: boolean;
    contentHiddenByDefault?: boolean;
}

@Component({
    selector: 'xm-mat-card',
    templateUrl: './xm-mat-card.component.html',
    animations: [
        matExpansionAnimations.bodyExpansion,
        matExpansionAnimations.indicatorRotate,
    ],
})
export class XmMatCardComponent implements OnInit, OnChanges {

    @Input() public options: XmMatCardOptions;
    @Input() public entity: IId;
    @Input() public loading: boolean = false;
    @Input() public disableSubmit: boolean = false;
    @Output() public save: EventEmitter<void> = new EventEmitter<void>();
    @Output() public cancel: EventEmitter<void> = new EventEmitter<void>();
    @Output() public isEditChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Input() public isEdit: boolean = false;
    public contentHidden: boolean;

    constructor(
        protected pageState: PageChangesStore,
    ) {
    }

    public onEditChange(event: EditWidgetButtonsEvent): void {
        if (event.event === EditWidgetButtonsEventType.EDIT) {
            this.pageState.setState(PageChangesStoreType.EDIT);
            if (this.contentHidden) {
                this.contentHidden = false;
            }
        } else {
            this.pageState.setState(PageChangesStoreType.UPDATED);
        }
    }

    public ngOnInit(): void {
        this.contentHidden = this.options?.contentHiddenByDefault;
        this.updateEditStateByEntityId();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.entity) {
            this.updateEditStateByEntityId();
        }
    }

    public updateEditStateByEntityId(): void {
        this.isEdit = !this.entity?.id;
    }
}
