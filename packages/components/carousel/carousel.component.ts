import { AsyncPipe, NgFor, NgIf, NgStyle } from '@angular/common';
import { AfterViewInit, Component, ContentChild, ContentChildren, ElementRef, inject, Input, NgZone, OnDestroy, QueryList, ViewChild } from '@angular/core';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { defaults, sortBy } from 'lodash';
import { combineLatestWith, last, fromEvent, map, Observable, merge, startWith, Subject, switchMap, takeUntil, tap, withLatestFrom, BehaviorSubject, share, scan } from 'rxjs';
import { XmCarouselContentDirective, XmCarouselNextButtonDirective, XmCarouselPrevButtonDirective, XmCarouselSwitchButtonDirective } from './carousel.directive';
import { XmCarouselAdaptiveSettings, XmCarouselConfig, XmCarouselContainerMeasure, XmCarouselGesture, XmCarouselGestureEvent, XmCarouselHandleButton } from './carousel.interface';

export const XM_CAROUSEL_DEFAULTS = {
    swipeThreshold: 50,
    breakpoints: [
        { max: 576, slidesCount: 1 },  
        { max: 768, slidesCount: 2 },
        { max: 992, slidesCount: 3 },
        { max: 1200, slidesCount: 4 },
        { max: 1400, slidesCount: 6 },
        { max: 1920, slidesCount: 8 }, 
    ],
    duration: 300,
    gap: 12,
};

const isTouchDevice = ('ontouchstart' in window || navigator.maxTouchPoints);

@Component({
    standalone: true,
    imports: [
        NgFor,
        NgIf,
        NgStyle,
        AsyncPipe,
    ],
    selector: 'xm-carousel',
    template: `
        <div class="carousel">
            <ng-content select="[before]"></ng-content>

            <div #list class="carousel__list">
                <div class="carousel__track"
                    [ngStyle]="{
                        'gap': config.gap + 'px',
                        'flex-wrap': asRows ? 'wrap' : 'nowrap',
                        'transition-duration': asRows ? '0ms' : config.duration + 'ms',
                        'transform': asRows ? null : 'translateX(-' + offsetX + 'px)'
                    }">
                    <ng-content select="[track]"></ng-content>
                </div>
            </div>

            <ng-content select="[after]"></ng-content>
        </div>
    `,
    styles: [`
        .carousel {
            width: 100%;
            display: flex;
            flex-direction: column;
        }
        .carousel__list {
            flex-grow: 1;
            overflow: hidden;
        }
        .carousel__track {
            display: flex;
            flex-direction: row;
            transition-property: transform;
            min-height: 50px;
        }
     `],
})
export class XmCarouselComponent implements OnDestroy, AfterViewInit {
    private ngZone = inject(NgZone);

    @ViewChild('list', { read: ElementRef }) public listRef: ElementRef<HTMLElement>;
    @ContentChild(XmCarouselSwitchButtonDirective) public switchButton: XmCarouselSwitchButtonDirective;
    @ContentChild(XmCarouselNextButtonDirective) public nextButton: XmCarouselNextButtonDirective;
    @ContentChild(XmCarouselPrevButtonDirective) public prevButton: XmCarouselPrevButtonDirective;

    @ContentChildren(XmCarouselContentDirective) public contents: QueryList<XmCarouselContentDirective>;

    private readonly listElementEvent = new BehaviorSubject<XmCarouselContainerMeasure>(null);
    private readonly offsetCountEvent = new BehaviorSubject<number>(0);
    private readonly switchAsRowsEvent = new BehaviorSubject<boolean>(false);

    private readonly previous = new Subject<void>();
    private readonly next = new Subject<void>();

    public get listElement(): HTMLElement {
        return this.listRef.nativeElement;
    }

    private _config: XmCarouselConfig = XM_CAROUSEL_DEFAULTS;

    @Input() set config(value: XmCarouselConfig) {
        this._config = defaults<XmCarouselConfig, XmCarouselConfig>(value ?? {}, XM_CAROUSEL_DEFAULTS);
    }

    get config(): XmCarouselConfig {
        return this._config;
    }

    public offsetX = 0;
    public asRows = false;
    
    public ngAfterViewInit(): void {
        this.handlePrevious().pipe(
            takeUntilOnDestroy(this),
        ).subscribe();

        this.handleNext().pipe(
            takeUntilOnDestroy(this),
        ).subscribe();

        merge(
            this.setupButtonsEvents(),
            this.setupGestureEvents(),
            this.setupWheelEvents(),
        ).pipe(
            takeUntilOnDestroy(this),
        ).subscribe();

        this.offsetCountEvent.pipe(
            combineLatestWith(this.breakpointChanges()),
            tap(([offsetCount, { adaptive: { slideWidth, slidesCount }, contents, switched }]) => {
                const slidesMoreThanContents = slidesCount > contents.length;
                const noNextSlides = (offsetCount + slidesCount) >= (contents.length);
                const noPrevSlides = offsetCount <= 0;

                this.asRows = switched;
                this.switchButton.switched = switched;
                this.switchButton.disabled = noPrevSlides && noNextSlides;

                this.prevButton.disabled = switched ? true : noPrevSlides;
                this.nextButton.disabled = switched ? true : noNextSlides;

                if (slidesMoreThanContents) {
                    this.offsetX = 0;
                } else {
                    this.offsetX = offsetCount * slideWidth;
                }
            }),
            takeUntilOnDestroy(this),
        ).subscribe();

        this.contentChanges().pipe(
            tap(() => {
                this.listElementEvent.next({
                    offsetWidth: this.listElement.offsetWidth,
                    scrollWidth: this.listElement.scrollWidth,
                });
            }),
            takeUntilOnDestroy(this),
        ).subscribe();
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    private setupButtonsEvents(): Observable<PointerEvent> {
        return merge(
            fromEvent<PointerEvent>(this.switchButton.element, 'click').pipe(
                tap(() => this.toSwitch()),
            ),
            fromEvent<PointerEvent>(this.nextButton.element, 'click').pipe(
                tap(() => this.toNext()),
            ),
            fromEvent<PointerEvent>(this.prevButton.element, 'click').pipe(
                tap(() => this.toPrevious()),
            ),
        );
    }

    private setupWheelEvents(): Observable<WheelEvent> {
        return fromEvent<WheelEvent>(this.listElement, 'wheel').pipe(
            tap((event) => {
                const deltaX = event.deltaX;

                if (deltaX === null) {
                    return;
                }

                if (deltaX > this.config.swipeThreshold) {
                    this.toNext();
                } else if (deltaX < -this.config.swipeThreshold) {
                    this.toPrevious();
                }
            }),
        );
    }

    private setupGestureEvents(): Observable<number> {
        const startEventName = isTouchDevice ? 'touchstart' : 'pointerdown';
        const moveEventName = isTouchDevice ? 'touchmove' : 'pointermove';
        const endEventName = isTouchDevice ? 'touchend' : 'pointerup';
    
        const handleEvents = (event: XmCarouselGesture): XmCarouselGestureEvent => {
            const clientX = isTouchDevice
                ? (event as TouchEvent).touches[0].clientX
                : (event as PointerEvent).clientX;

            return { event, clientX };
        };

        const { startEvent, moveEvent, endEvent } = {
            startEvent: fromEvent<XmCarouselGesture>(this.listElement, startEventName).pipe(map((e) => handleEvents(e))),
            moveEvent: fromEvent<XmCarouselGesture>(this.listElement, moveEventName).pipe(map((e) => handleEvents(e))),
            endEvent: merge(
                fromEvent<XmCarouselGesture>(this.listElement, endEventName),
                fromEvent<XmCarouselGesture>(document, 'mouseup'),
            ),
        };

        return startEvent.pipe(
            switchMap(({ clientX: startClientX }) => {
                return moveEvent.pipe(
                    map(({ clientX: moveClientX, event }) => ({
                        event,
                        clientX: moveClientX,
                        deltaX: moveClientX - startClientX,
                    })),
                    tap(({ event }) => {
                        if (event.cancelable) {
                            event.preventDefault();
                        }
                    }),
                    map(({ deltaX }) => deltaX),
                    takeUntil(endEvent),
                    last(() => true, null),
                );
            }),
            tap((deltaX) => {
                if (deltaX === null) {
                    return;
                }

                if (deltaX > this.config.swipeThreshold) {
                    this.toPrevious();
                } else if (deltaX < -this.config.swipeThreshold) {
                    this.toNext();
                }
            }),
        );
    }

    private toSwitch(): void {
        this.switchAsRowsEvent.next(!this.switchAsRowsEvent.value);
    }

    private toPrevious(): void {
        this.previous.next();
    }
    
    private toNext(): void {
        this.next.next();
    }

    private clampByContentLength(count: number, max = this.contents.length): number {
        return Math.min(Math.max(count, 0), max);
    }

    private handlePrevious(): Observable<XmCarouselHandleButton> {
        return this.previous.pipe( 
            withLatestFrom(
                this.breakpointChanges(),
                this.offsetCountEvent, 
                (__, { adaptive: { slidesCount }, contents }, offsetCount) => ({ slidesCount, offsetCount, contents }),
            ),
            tap(({ contents, offsetCount, slidesCount }) => {
                const prevOffsetCount = this.clampByContentLength(offsetCount - slidesCount) % contents.length;

                this.offsetCountEvent.next(prevOffsetCount);
            }),
        );
    }

    private handleNext(): Observable<XmCarouselHandleButton> {
        return this.next.pipe(
            withLatestFrom(
                this.breakpointChanges(),
                this.offsetCountEvent, 
                (__, { adaptive: { slidesCount }, contents }, offsetCount) => ({ slidesCount, offsetCount, contents }),
            ),
            tap(({ contents, offsetCount, slidesCount }) => {
                const nextOffsetCount = this.clampByContentLength(offsetCount + slidesCount) % contents.length;

                if (nextOffsetCount === 0) {
                    return;
                }

                this.offsetCountEvent.next(nextOffsetCount);
            }),
            takeUntilOnDestroy(this),
        );
    }

    private contentChanges(): Observable<XmCarouselContentDirective[]> {
        return this.contents.changes.pipe(
            startWith(this.contents.toArray()),
            share(),
        );
    }

    private breakpointChanges(): Observable<{ adaptive, contents, switched }> {
        return this.resizeChanges().pipe(
            combineLatestWith(
                this.contentChanges(),
                this.switchAsRowsEvent,
            ),
            map(([adaptive, contents, switched]) => ({ adaptive, contents, switched })),
            tap(({ adaptive, contents }) => {
                const { slideWidth } = adaptive;

                contents.forEach((content) => {
                    content.width = (slideWidth - this.config.gap);
                });
            }),
            share(),
        );
    }

    private resizeChanges(): Observable<XmCarouselAdaptiveSettings> {
        return this.ngZone.runOutsideAngular(() => {
            return this.listElementEvent.pipe(
                switchMap((start) => {
                    return fromEvent(window, 'resize').pipe(
                        startWith(start),
                        map(() => {
                            return {
                                offsetWidth: this.listElement.offsetWidth,
                                scrollWidth: this.listElement.scrollWidth,
                            };
                        }),
                    );
                }),
                scan((acc, curr) => {
                    return {
                        prev: acc.curr || curr,
                        curr: curr,
                    };
                }, {} as { curr: XmCarouselContainerMeasure, prev: XmCarouselContainerMeasure }),
                map(({ prev, curr }) => this.elementMeasure(prev, curr)),
            );
        });
    }

    private elementMeasure(
        prev: XmCarouselContainerMeasure, 
        curr: XmCarouselContainerMeasure,
    ): XmCarouselAdaptiveSettings {
        const { 
            scrollWidth: containerScroll,
            offsetWidth: containerWidth,
        } = curr;

        const direction = containerWidth <= prev.offsetWidth ? 'prev' : 'next';
        const overflow = containerWidth < containerScroll;
        const breakpoints = sortBy(this.config.breakpoints, 'max');
        
        for (const breakpoint of breakpoints) {
            if (containerWidth <= breakpoint.max) {
                return {
                    slidesCount: breakpoint.slidesCount,
                    containerScroll,
                    containerWidth,
                    slideWidth: containerWidth / breakpoint.slidesCount,
                    direction,
                    overflow,
                };
            }
        }

        return {
            slidesCount: 1,
            containerScroll,
            containerWidth,
            slideWidth: containerWidth / 1,
            direction,
            overflow,
        };
    }
}