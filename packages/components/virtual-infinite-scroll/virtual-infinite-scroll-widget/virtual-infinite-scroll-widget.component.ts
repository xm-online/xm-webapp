import { CdkFixedSizeVirtualScroll, CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    inject,
    Injector,
    input,
    InputSignal,
    OnDestroy,
    OnInit,
    signal,
    ViewChild, WritableSignal,
} from '@angular/core';
import { XmDynamicInstanceService, XmDynamicModule } from '@xm-ngx/dynamic';
import { ListRange } from '@angular/cdk/collections';
import { MatProgressBar } from '@angular/material/progress-bar';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { debounceTime, take } from 'rxjs/operators';
import {
    VirtualInfiniteScrollWidgetConfig, VirtualInfiniteScrollWidgetResponse,
} from '../xm-virtual-infinity-scroll.models';
import { XmVirtualInfiniteScrollController } from '@xm-ngx/components/virtual-infinite-scroll';

@Component({
    selector: 'xm-virtual-infinite-scroll-widget',
    standalone: true,
    imports: [
        CdkVirtualScrollViewport,
        CdkFixedSizeVirtualScroll,
        ScrollingModule,
        XmDynamicModule,
        MatProgressBar,
    ],
    templateUrl: './virtual-infinite-scroll-widget.component.html',
    styleUrl: './virtual-infinite-scroll-widget.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class XmVirtualInfiniteScrollWidget implements OnInit, AfterViewInit, OnDestroy {
    private readonly DEFAULT_DATA_CONTROLLER = 'virtual-infinite-scroll-controller';
    private readonly DEFAULT_DATA_CONTROLLER_METHOD = 'request';

    public config: InputSignal<VirtualInfiniteScrollWidgetConfig> = input<VirtualInfiniteScrollWidgetConfig>();

    private xmDynamicInstanceService: XmDynamicInstanceService = inject(XmDynamicInstanceService);
    private injector = inject(Injector);

    private controller: XmVirtualInfiniteScrollController<any[]> | any;
    private total: WritableSignal<number> = signal(0);

    public readonly window = window;
    public items: WritableSignal<any[]> = signal([]);
    public isLoading: WritableSignal<boolean> = signal(false);

    @ViewChild(CdkVirtualScrollViewport) public scrollViewport: CdkVirtualScrollViewport;

    public ngOnInit(): void {
        this.getControllerAndSetItems();
    }

    public ngAfterViewInit(): void {
        this.observeLoadMore();
    }

    private getControllerAndSetItems(): void {
        const {
            key = this.DEFAULT_DATA_CONTROLLER,
            method = this.DEFAULT_DATA_CONTROLLER_METHOD,
        } = this.config().controller || {};

       try {
           this.controller = this.xmDynamicInstanceService.getControllerByKey(key, this.injector);
           this.controller[method]()
               .pipe(take(1))
               .subscribe(({items, total}: VirtualInfiniteScrollWidgetResponse) => {
                   this.items.set(items);
                   this.total.set(total);
               });
       } catch (e) {
           console.error('Error while getting controller and setting items in xm-virtual-infinite-scroll-widget', e);
       }

    }

    public observeLoadMore(): void {
        try {
            this.scrollViewport.renderedRangeStream
                .pipe(
                    debounceTime(200),
                    takeUntilOnDestroy(this),
                )
                .subscribe((range: ListRange) => {
                    console.log('range: ', range);
                    if (range.end === this.scrollViewport.getDataLength() && range.end < this.total()) {
                        console.log('loading more data', JSON.parse(JSON.stringify(this.items)));
                        const {
                            method = this.DEFAULT_DATA_CONTROLLER_METHOD,
                        } = this.config().controller || {};
                        this.isLoading.set(true);
                        setTimeout(() => {
                            this.items.set([...this.items(), ...this.controller[method]().items]);
                            console.log('loaded more data', JSON.parse(JSON.stringify(this.items)));
                            this.isLoading.set(false);
                        }, 2000);
                    }
                });
        } catch (e) {
            console.error('Error while observing load more in xm-virtual-infinite-scroll-widget', e);
        }
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }
}
