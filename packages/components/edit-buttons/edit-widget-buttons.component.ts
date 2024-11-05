import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {
    EDIT_ACTION,
    EDIT_EVENT,
    EDIT_STATE,
    EditStateStoreService
} from '@xm-ngx/controllers/features/edit-state-store';
import { XmEventManager } from '@xm-ngx/core';
import { injectByKey, XM_DYNAMIC_COMPONENT_CONFIG } from '@xm-ngx/dynamic';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { EditWidgetButtonsConfig } from './edit-widget-buttons.model';

export const XM_EDIT_WIDGET_BUTTONS_CHANGE_EVENT = 'XM_EDIT_WIDGET_BUTTONS_CHANGE_EVENT';

export enum EditWidgetButtonsEventType {
    EDIT = 1,
    SAVE,
    CANCEL,
}

export interface EditWidgetButtonsEvent {
    event?: EditWidgetButtonsEventType;
    isEdit?: boolean;
}

@Component({
    selector: 'xm-edit-widget-buttons',
    templateUrl: './edit-widget-buttons.component.html',
})
export class EditWidgetButtonsComponent implements OnInit, OnDestroy {
    public config = inject<EditWidgetButtonsConfig>(XM_DYNAMIC_COMPONENT_CONFIG, { optional: true });

    private editStateStore = injectByKey<EditStateStoreService>('edit-state-store', { optional: true });

    public isHidden: boolean = false;
    @Input() public isEdit: boolean = false;
    @Input() public disableSubmit: boolean = false;
    @Input() public disabled: boolean = false;

    @Output() public isEditChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() public edit: EventEmitter<void> = new EventEmitter<void>();
    @Output() public save: EventEmitter<void> = new EventEmitter<void>();
    // eslint-disable-next-line @angular-eslint/no-output-native
    @Output() public cancel: EventEmitter<void> = new EventEmitter<void>();
    @Output() public changeEvent: EventEmitter<EditWidgetButtonsEvent> = new EventEmitter<EditWidgetButtonsEvent>();

    constructor(
        private eventManager: XmEventManager,
    ) {
    }

    public ngOnInit(): void {
        if (this.editStateStore) {
            this.editStateStore.change(this.isEdit ? EDIT_STATE.EDIT : EDIT_STATE.VIEW);
        }
        this.eventManager.listenTo<EditWidgetButtonsEvent>(XM_EDIT_WIDGET_BUTTONS_CHANGE_EVENT)
            .pipe(takeUntilOnDestroy(this))
            .subscribe((e) => {
                this.isHidden = !this.isEdit && e.payload.isEdit;
            });
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    public onEdit(event: any): void {
        event.stopPropagation();
        this.changeIsEdit(EditWidgetButtonsEventType.EDIT);
        this.edit.emit();
    }

    public onSave(event: any): void {
        event.stopPropagation();
        if (this.editStateStore) {
            this.editStateStore.emitEvent(EDIT_EVENT.SAVE);
        }
        this.changeIsEdit(EditWidgetButtonsEventType.SAVE);
        this.save.emit();
    }

    public onCancel(event: any): void {
        event.stopPropagation();
        if (this.editStateStore) {
            this.editStateStore.emitEvent(EDIT_EVENT.CANCEL);
        }
        this.changeIsEdit(EditWidgetButtonsEventType.CANCEL);
        this.cancel.emit();
    }

    private changeIsEdit(event: EditWidgetButtonsEventType): void {
        if (this.editStateStore) {
            this.editStateStore.change(event === EditWidgetButtonsEventType.EDIT ? EDIT_STATE.EDIT : EDIT_STATE.VIEW);
        }
        this.isEdit = !this.isEdit;
        this.isEditChange.emit(this.isEdit);
        const payload = {
            isEdit: this.isEdit,
            event,
        };
        this.changeEvent.emit(payload);
        this.eventManager.broadcast<EditWidgetButtonsEvent>({
            name: XM_EDIT_WIDGET_BUTTONS_CHANGE_EVENT,
            payload,
        });
    }

    public isSaveDisabled(): boolean {
        if (this.editStateStore) {
            return this.disabled || this.editStateStore.isDisabled(EDIT_ACTION.SAVE);
        }
        return this.disabled;
    }

    public isEditDisabled(): boolean {
        if (this.editStateStore) {
            return this.disabled || this.editStateStore.isDisabled(EDIT_ACTION.EDIT);
        }
        return this.disabled;
    }

    public isCancelDisabled(): boolean {
        if (this.editStateStore) {
            return this.disabled || this.editStateStore.isDisabled(EDIT_ACTION.CANCEL);
        }
        return this.disabled;
    }
}
