import { CdkFixedSizeVirtualScroll, CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Injector, input, InputSignal } from '@angular/core';
import { XmDynamicInstanceService, XmDynamicModule } from '@xm-ngx/dynamic';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

@Component({
    selector: 'xm-virtual-infinite-scrol-widget',
    standalone: true,
    imports: [
        CdkVirtualScrollViewport,
        InfiniteScrollDirective,
        CdkFixedSizeVirtualScroll,
        ScrollingModule,
        XmDynamicModule,
        NgTemplateOutlet,
    ],
    templateUrl: './virtual-infinite-scroll-widget.component.html',
    styleUrl: './virtual-infinite-scroll-widget.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class XmVirtualInfiniteScrollWidget {
    public layouts = [];
    private dataController: any;
    private xmDynamicInstanceService: XmDynamicInstanceService = inject(XmDynamicInstanceService);
    public config: InputSignal<any> = input();
    public injector = inject(Injector);

    public ngOnInit(): void {
        this.dataController = this.xmDynamicInstanceService.getControllerByKey(this.config().dataController.key, this.injector);
        this.layouts = this.dataController.getData();
    }
}
