import { Component, Input } from '@angular/core';
import { FlexLayoutRootComponent } from '@ajsf/material';
import { CdkDrag, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { XmJsonSchemaFormService } from '@xm-ngx/json-schema-form/core';

export function isNodeDraggable(node: Record<string, any>): boolean {
    return node?.arrayItem && node?.type !== '$ref' && node?.arrayItemType === 'list' && node?.options?.orderable !== false;
}

@Component({
    selector: 'xm-flex-layout-root-widget',
    template: `
        <!-- We add specific fxLayout because fxFlex add random styles to parent  -->
        <div [fxLayout]="parentOptions?.fxLayout"
             [fxLayoutGap]="parentOptions?.fxLayoutGap"
             [fxLayoutAlign]="parentOptions?.fxLayoutAlign"
             fxFlex="auto"

             cdkDropList
             (cdkDropListDropped)="drop($event)"
             [cdkDropListSortPredicate]="sortPredicate.bind(this)">

            <div cdkDrag
                 [cdkDragData]="layoutNode"
                 [cdkDragDisabled]="!isDraggable(layoutNode)"
                 *ngFor="let layoutNode of layout; let i = index"
                 [class.form-flex-item]="isFlexItem"
                 [style.flex-grow]="getFlexAttribute(layoutNode, 'flex-grow')"
                 [style.flex-shrink]="getFlexAttribute(layoutNode, 'flex-shrink')"
                 [style.flex-basis]="getFlexAttribute(layoutNode, 'flex-basis')"
                 [style.align-self]="(layoutNode?.options || {})['align-self']"
                 [style.order]="layoutNode?.options?.order"
                 [fxFlex]="layoutNode?.options?.fxFlex"
                 [fxFlexOrder]="layoutNode?.options?.fxFlexOrder"
                 [fxFlexOffset]="layoutNode?.options?.fxFlexOffset"
                 [fxFlexAlign]="layoutNode?.options?.fxFlexAlign">

                <div class="drag-handle" cdkDragHandle *ngIf="isDraggable(layoutNode)">
                    <mat-icon>drag_handle</mat-icon>
                </div>

                <select-framework-widget *ngIf="showWidget(layoutNode)"
                                         [dataIndex]="layoutNode?.arrayItem ? (dataIndex || []).concat(i) : (dataIndex || [])"
                                         [layoutIndex]="(layoutIndex || []).concat(i)"
                                         [layoutNode]="layoutNode"></select-framework-widget>
            </div>
        </div>
    `,
    styles: [`
        .cdk-drop-list {
            /*width: 100%;*/
        }

        .cdk-drop-list-dragging:not(.cdk-drag-placeholder) {
            transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
        }

        .cdk-drag {
            background: var(--surface);
        }

        .cdk-drag-preview {
            box-sizing: border-box;
            border-radius: 4px;
            box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
            0 8px 10px 1px rgba(0, 0, 0, 0.14),
            0 3px 14px 2px rgba(0, 0, 0, 0.12);
        }

        .cdk-drag-placeholder {
            opacity: 0;
        }

        .cdk-drag-animating {
            transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
        }

        .cdk-drag-handle {
            background: #f2f2f2;
            justify-content: center;
            display: flex;
            padding: 4px 8px;
            border: 1px dashed #ccc;
            border-radius: 4px;
            cursor: move;
            color: var(--gray);
        }
    `],
})
export class XmFlexLayoutRootComponent extends FlexLayoutRootComponent {
    @Input() public flexLayout: string;

    @Input() public parentOptions?: Record<string, string>;

    constructor(
        private schemaFormService: XmJsonSchemaFormService,
    ) {
        super(schemaFormService);
    }

    public drop(event: CdkDragDrop<any[]>): void {
        const moved = this.schemaFormService.moveArrayItemAndUpdateIndex({
            layoutIndex: this.layoutIndex,
            dataIndex: this.dataIndex,
            layout: this.layout,
        }, event.previousIndex, event.currentIndex);

        if (moved) {
            moveItemInArray(this.layout, event.previousIndex, event.currentIndex);
        }
    }

    public isDraggable(node: any): boolean {
        return isNodeDraggable(node);
    }

    public sortPredicate(index: number, item: CdkDrag<any>): boolean {
        return isNodeDraggable(this.layout[index]) && isNodeDraggable(item.data);
    }

}
