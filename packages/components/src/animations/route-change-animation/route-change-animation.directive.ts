import { animate, AnimationBuilder, AnimationMetadata, AnimationPlayer, style } from '@angular/animations';
import { Directive, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

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
            style({ opacity: 0 }),
            animate('300ms ease-out', style({ opacity: 1 })),
            style({}),
        ];
    }

    public ngOnInit(): void {
        this.router.events.pipe(
            takeUntilOnDestroy(this),
            filter(event => event instanceof NavigationEnd),
            map(() => this.getCurrentActiveRoute()),
            filter(route => route.outlet === 'primary'),
            map(route => route.snapshot.url.join('')),
            distinctUntilChanged(),
        ).subscribe(() => this.play());

        this.play();
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    private getCurrentActiveRoute(): ActivatedRoute {
        let route = this.router.routerState.root;
        while (route.firstChild) {
            route = route.firstChild;
        }
        return route;
    }

    private play(): void {
        if (!this.complete) {
            return;
        }

        if (this.player) {
            this.player.destroy();
            delete this.player;
        }

        const metadata = RouteChangeAnimationDirective.fadeIn();
        const factory = this.builder.build(metadata);
        const player = factory.create(this.el.nativeElement);
        player.play();
        this.complete = false;
        player.onDone(() => {
            this.complete = true;
            if (this.player) {
                this.player.destroy();
                delete this.player;
            }
        });
    }
}
