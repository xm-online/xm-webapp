import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Page, PageService } from "@xm-ngx/dashboard";
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from "@xm-ngx/shared/operators";
import {
    CdkDrag,
    CdkDragDrop, CdkDragMove,
    CdkDragPlaceholder, CdkDragRelease,
    CdkDropList,
    moveItemInArray,
    transferArrayItem,
} from '@angular/cdk/drag-drop';
import { CommonModule, NgFor } from '@angular/common';
import {
    DashboardEditorService
} from "@xm-ngx/administration/dashboards-config/dashboard-layout/dashboard-layout.service";
import { Observable } from "rxjs";

@Component({
    selector: 'xm-dashboard-dnd',
    template: `
        <div cdkDropList
             [id]="listId"
             [cdkDropListData]="layout"
             [cdkDropListConnectedTo]="dndList$ | async"
             [cdkDropListEnterPredicate]="allowDropPredicate"
             class="row container-border example-list g-0"
             (cdkDropListDropped)="drop($event)">
            <!--                <div class="example-box" *ngFor="let item of done" cdkDrag>{{item}}</div>-->
            <div *ngFor="let layer of layout"
                 class="g-0"
                 [ngClass]="layer.class">
                <div *ngIf="layer.widgetName; else nested"
                     cdkDrag
                     class="example-box"
                     style="border: 1px solid black; padding: 10px; text-align: center"
                     (cdkDragMoved)="dragMoved($event)"
                     (cdkDragReleased)="dragReleased($event)">
                    <div class="widget-placeholder" *cdkDragPlaceholder></div>
                    {{layer.widgetName}}
                </div>
                <ng-template #nested>
                    <div cdkDrag
                         style="margin: 10px 0">
                        <div class="widget-placeholder" *cdkDragPlaceholder></div>
                        <xm-dashboard-dnd [layout]="layer.content"></xm-dashboard-dnd>
                    </div>
                </ng-template>
            </div>
        </div>
    `,
    styleUrls: ['./dashboard-dnd.component.scss'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CdkDropList, NgFor, CdkDrag, CommonModule, CdkDragPlaceholder],
})
export class DashboardDndComponent implements OnInit, OnDestroy {
    @Input() public layout: any;
    public dndList$: Observable<string[]>;

    todo = [];

    done = [];

    drop(event: CdkDragDrop<string[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex,
            );
        }
    }

    public page: Page;
    public listId: string;

    constructor(
        private pageService: PageService,
        private dashboardEditorService: DashboardEditorService,
    ) {
    }

    public ngOnInit() {
        this.listId = this.dashboardEditorService.generateListId()
        this.dashboardEditorService.registerListId(this.listId);

        this.dndList$ = this.dashboardEditorService.watchListExceptOf(this.listId);

        this.pageService.active$()
            .pipe(takeUntilOnDestroy(this))
            .subscribe((page) => {
                this.page = page;
            })
    }

    public ngOnDestroy() {
        takeUntilOnDestroyDestroy(this)
    }

    dragMoved(event: CdkDragMove<any>) {
        this.dashboardEditorService.dragMoved(event);
    }

    dragReleased(event: CdkDragRelease) {
        this.dashboardEditorService.dragReleased(event);
    }

    isDropAllowed(drag: CdkDrag, drop: CdkDropList) {
        if (this.dashboardEditorService.currentHoverDropListId == null) {
            return true;
        }

        return drop.id === this.dashboardEditorService.currentHoverDropListId;
    }


    allowDropPredicate = (drag: CdkDrag, drop: CdkDropList) => {
        return this.isDropAllowed(drag, drop);
    };
}
