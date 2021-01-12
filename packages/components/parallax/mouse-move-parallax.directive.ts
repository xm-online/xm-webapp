import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[xmMouseMoveParallax]',
})
export class MouseMoveParallaxDirective {

    constructor(private el: ElementRef<HTMLImageElement>) {
    }

    @HostListener('document:mousemove', ['$event'])
    public onDocumentMouseMove(e: MouseEvent): void {
        const elem = this.el.nativeElement;
        const w = window.innerWidth / 2;
        const h = window.innerHeight / 2;
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const depth1 = `${50 - (mouseX - w) * 0.005}% ${50 - (mouseY - h) * 0.005}%`;
        elem.style.backgroundPosition = depth1;
    }

}


