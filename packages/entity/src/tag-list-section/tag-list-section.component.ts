import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { XmEventManager } from '@xm-ngx/core';
// import { DEBUG_INFO_ENABLED } from 'src/app/xm.constants';
import { Tag, TagService, TagSpec, XmEntity, XmEntityService } from '@xm-ngx/core/entity';
import { XmToasterService } from '@xm-ngx/toaster';
import _ from 'lodash';
import { Subscription } from 'rxjs';
import { XM_ENTITY_EVENT_LIST } from '../constants';

@Component({
    selector: 'xm-tag-list-section',
    templateUrl: './tag-list-section.component.html',
    styleUrls: ['./tag-list-section.component.scss'],
    standalone: false,
})
export class TagListSectionComponent implements OnInit, OnChanges, OnDestroy {

    @Input() public xmEntityId: number;
    @Input() public tagSpecs: TagSpec[];
    public xmEntity: XmEntity;
    public tags: Record<string, Tag[]> = {};
    private eventSubscriber: Subscription;

    constructor(private eventManager: XmEventManager,
                private tagService: TagService,
                private xmEntityService: XmEntityService,
                private toasterService: XmToasterService) {
    }

    public ngOnInit(): void {
        this.eventSubscriber = this.eventManager
            .subscribe(XM_ENTITY_EVENT_LIST.XM_ENTITY_DETAIL_MODIFICATION, () => this.load());
    }

    public ngOnDestroy(): void {
        this.eventManager.destroy(this.eventSubscriber);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.xmEntityId && changes.xmEntityId.previousValue !== changes.xmEntityId.currentValue) {
            this.load();
        }
    }

    public onAdd(xmTag: Tag, typeKey: string): void {
        const tag: Tag = {
            typeKey: typeKey,
            name: xmTag.name.toUpperCase(),
            startDate: new Date().toJSON(),
            xmEntity: {id: this.xmEntity.id, typeKey: this.xmEntity.typeKey},
        };
        this.tagService.create(tag).subscribe(
            () => this.load(),
            (err) => {
                !err.handled && this.toasterService.error('xm-entity.tag-list-section.add-error');
                this.load();
            });
    }

    public onRemove(xmTag: Tag): void {
        this.tagService.delete(xmTag.id).subscribe(
            () => this.load(),
            (err) => {
                !err.handled && this.toasterService.error('xm-entity.tag-list-section.remove-error');
                this.load();
            });
    }

    private load(): void {
        if (!this.tagSpecs || !this.tagSpecs.length) {
            // if (DEBUG_INFO_ENABLED) {
            //     console.info('DBG: no spec no call');
            // }
            return;
        }
        this.xmEntityService.find(this.xmEntityId, {embed: 'tags'}).subscribe((xmEntity: HttpResponse<XmEntity>) => {
            this.xmEntity = xmEntity.body;
            if (xmEntity.body.tags) {
                this.tags = _.groupBy(xmEntity.body.tags, 'typeKey');
            }
        });
    }

}
