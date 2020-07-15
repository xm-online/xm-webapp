import { animate, AnimationBuilder, AnimationMetadata, AnimationPlayer, query, style } from '@angular/animations';
import { Directive, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';

@Directive({
    selector: '[xmRouteChangeAnimation]',
})
export class RouteChangeAnimationDirective implements OnInit, OnDestroy {

    private player: AnimationPlayer;
    private complete: boolean = true;

    constructor(
        private builder: AnimationBuilder,
        private el: ElementRef,
        private router: Router,
    ) {
    }

    private static fadeIn(): AnimationMetadata[] {
        return [
            style({ overflow: 'hidden' }),
            query(':scope > *', [
                style({ opacity: 0, transform: 'translateY(1rem)' }),
                animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
            ]),
            animate('300ms ease-out', style({  })),
        ];
    }

    public ngOnInit(): void {
        this.router.events.pipe(takeUntilOnDestroy(this)).subscribe((event) => {
            switch (true) {
                case event instanceof NavigationStart: {
                    break;
                }
                case event instanceof NavigationEnd:
                case event instanceof NavigationCancel:
                case event instanceof NavigationError:
                default: {
                    this.play();
                }
            }
        });
        this.play();
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    private play(): void {
        if (!this.complete) {
            return;
        }

        if (this.player) {
            this.player.destroy();
        }

        const metadata = RouteChangeAnimationDirective.fadeIn();
        const factory = this.builder.build(metadata);
        const player = factory.create(this.el.nativeElement);
        player.play();
        this.complete = false;
        player.onDone(() => this.complete = true);
    }
}
