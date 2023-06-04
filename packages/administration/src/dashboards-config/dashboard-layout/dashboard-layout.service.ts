import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";
import { uuid } from "@xm-ngx/shared/operators";
import { uniq } from "lodash";
import { map } from "rxjs/operators";
import { DOCUMENT } from "@angular/common";
import { CdkDragMove, CdkDragRelease } from "@angular/cdk/drag-drop";

@Injectable({
    providedIn: 'root'
})
export class DashboardEditorService {
    private dndList: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
    currentHoverDropListId?: string;

    constructor(@Inject(DOCUMENT) private document: Document) {
    }

    public generateListId(): string {
        return uuid();
    }

    public registerListId(id: string): void {
        this.dndList.next(uniq([...this.dndList.value, id]))
    }

    public watchListExceptOf(id: string): Observable<string[]> {
        return this.dndList.asObservable().pipe(
            map(list => list.filter(v => v !== id))
        )
    }

    dragMoved(event: CdkDragMove<any>) {
        let elementFromPoint = this.document.elementFromPoint(
            event.pointerPosition.x,
            event.pointerPosition.y
        );

        if (!elementFromPoint) {
            this.currentHoverDropListId = undefined;
            return;
        }

        let dropList = elementFromPoint.classList.contains('cdk-drop-list')
            ? elementFromPoint
            : elementFromPoint.closest('.cdk-drop-list');

        if (!dropList) {
            this.currentHoverDropListId = undefined;
            return;
        }

        this.currentHoverDropListId = dropList.id;
    }

    dragReleased(event: CdkDragRelease) {
        this.currentHoverDropListId = undefined;
    }
}
