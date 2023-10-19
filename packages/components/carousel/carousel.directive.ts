import { Directive, ElementRef, inject, Input, NgZone } from '@angular/core';

@Directive({
    standalone: true,
    selector: '[xmCarouselContent]',
    host: {
        '[style.width.px]': 'width',
        '[style.min-width.px]': 'width',
    },
})
export class XmCarouselContentDirective {
    private ngZone = inject(NgZone);
    private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

    public width = 230;

    public get element(): HTMLElement {
        return this.elementRef.nativeElement;
    }

    public getRect(): DOMRect {
        return this.ngZone.runOutsideAngular(() => {
            return this.element.getBoundingClientRect();
        });
    }
}

@Directive({
    host: {
        '[attr.disabled]': 'disabled || null',
    },
})
export class XmCarouselButtonDirective {
    private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

    @Input() public disabled = false;

    get element(): HTMLElement {
        return this.elementRef.nativeElement;
    }
}

@Directive({
    standalone: true,
    selector: '[xmCarouselPrevButton]',
})
export class XmCarouselPrevButtonDirective extends XmCarouselButtonDirective {}

@Directive({
    standalone: true,
    selector: '[xmCarouselNextButton]',
})
export class XmCarouselNextButtonDirective extends XmCarouselButtonDirective {}

@Directive({
    standalone: true,
    exportAs: 'switchButton',
    selector: '[xmCarouselSwitchButton]',
})
export class XmCarouselSwitchButtonDirective extends XmCarouselButtonDirective {
    public switched = false;
}