import { AfterViewInit, Directive, ElementRef, input } from '@angular/core';

/**
 * A dynamic focus directive to focus input/textarea even when the control is not rendered yet.
 * Can be applied to the child component which includes input/textarea to find automatically the first or find by id.
 */
@Directive({ selector: '[xmDynamicFocus]' })
export class DynamicFocusDirective implements AfterViewInit {
    public focusTarget = input<string>();

    private readonly MAX_ATTEMPTS = 100;

    constructor(private readonly el: ElementRef<HTMLElement>) {
    }

    public ngAfterViewInit(): void {
        this.setFocusWhenReady(0);
    }

    private setFocusWhenReady(attempt: number) {
        if (attempt > this.MAX_ATTEMPTS) return;

        const element = this.el.nativeElement;

        if (!document.body.contains(element)) {
            requestAnimationFrame(() => this.setFocusWhenReady(attempt + 1));
            return;
        }

        const focusTargetId = this.focusTarget();
        let input: HTMLElement | null = null;

        if (focusTargetId) {
            input = element.querySelector<HTMLElement>(`#${focusTargetId}, ${focusTargetId}`);
        }

        if (!input) {
            input =
                element.tagName === 'INPUT' || element.tagName === 'TEXTAREA'
                    ? element
                    : element.querySelector('input, textarea');
        }

        if (!input) {
            requestAnimationFrame(() => this.setFocusWhenReady(attempt + 1));
            return;
        }

        requestAnimationFrame(() => input.focus());
    }
}
