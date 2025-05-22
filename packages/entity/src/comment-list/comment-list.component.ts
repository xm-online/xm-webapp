import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { XmEventManager } from '@xm-ngx/core';

import { Comment, CommentSpec, XmEntity, XmEntityService } from '@xm-ngx/core/entity';
import { Subscription } from 'rxjs';

@Component({
    selector: 'xm-comment-list',
    templateUrl: './comment-list.component.html',
    standalone: false,
})
export class CommentListComponent implements OnInit, OnChanges, OnDestroy {

    @Input() public xmEntityId: number;
    @Input() public commentSpecs: CommentSpec[];
    public xmEntity: XmEntity;
    public comments: Comment[] = [];
    private modificationSubscription: Subscription;

    constructor(private xmEntityService: XmEntityService,
                private eventManager: XmEventManager) {
    }

    public ngOnInit(): void {
        this.registerListModify();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.xmEntityId && changes.xmEntityId.previousValue !== changes.xmEntityId.currentValue) {
            this.load();
        }
    }

    public ngOnDestroy(): void {
        this.eventManager.destroy(this.modificationSubscription);
    }

    private registerListModify(): void {
        this.modificationSubscription = this.eventManager
            .subscribe('commentListModification', () => this.load());
    }

    private load(): void {
        this.xmEntityService.find(this.xmEntityId, {embed: 'comments'})
            .subscribe((xmEntity: HttpResponse<XmEntity>) => {
                this.xmEntity = xmEntity.body;
                if (xmEntity.body.comments) {
                    this.comments = [...xmEntity.body.comments];
                }
            });
    }

}
