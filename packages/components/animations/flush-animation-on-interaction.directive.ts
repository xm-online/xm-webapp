import { ApplicationRef, Directive, ElementRef, inject, Input, NgZone, OnDestroy, OnInit } from '@angular/core';

/**
 * Forces an extra change detection flush shortly after a user interaction so that
 * Angular animations triggered by that interaction render immediately.
 *
 * Works around a production-only Safari issue where a single change detection pass
 * after an event does not flush pending animations until the next unrelated event
 * (e.g. a mouse move). In development mode the additional dev-only change detection
 * pass masks the problem, so it reproduces only on production builds (enableProdMode).
 *
 * Usage:
 *   <button xmFlushAnimationOnInteraction (click)="expanded = !expanded">...</button>
 *   <div [xmFlushAnimationOnInteraction]="['click', 'keydown']">...</div>
 */
@Directive({
    selector: '[xmFlushAnimationOnInteraction]',
    standalone: true,
})
export class FlushAnimationOnInteractionDirective implements OnInit, OnDestroy {
    /** Interaction events after which an extra change detection flush is scheduled. Defaults to `click`. */
    @Input('xmFlushAnimationOnInteraction') public events: string | string[] = 'click';

    private readonly el: ElementRef<HTMLElement> = inject(ElementRef);
    private readonly ngZone: NgZone = inject(NgZone);
    private readonly appRef: ApplicationRef = inject(ApplicationRef);

    private removeListeners: Array<() => void> = [];

    public ngOnInit(): void {
        const requested = Array.isArray(this.events) ? this.events : [this.events];
        const eventNames = requested.filter(Boolean);
        const events = eventNames.length ? eventNames : ['click'];

        this.ngZone.runOutsideAngular(() => {
            events.forEach((eventName) => {
                const handler = (): void => this.scheduleFlush();
                this.el.nativeElement.addEventListener(eventName, handler, true);
                this.removeListeners.push(() => this.el.nativeElement.removeEventListener(eventName, handler, true));
            });
        });
    }

    private scheduleFlush(): void {
        requestAnimationFrame(() => {
            try {
                this.appRef.tick();
            } catch {
                // tick() throws only when called re-entrantly during an ongoing CD pass; safe to ignore.
            }
        });
    }

    public ngOnDestroy(): void {
        this.removeListeners.forEach((remove) => remove());
        this.removeListeners = [];
    }
}
