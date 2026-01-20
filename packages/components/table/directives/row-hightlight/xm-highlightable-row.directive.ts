import { Directive, ElementRef, HostListener, inject, input, InputSignal, OnDestroy, OnInit } from '@angular/core';
import { HighlightableRow, XmRowHighlightRegistry } from './xm-row-highlight-registry.service';

type Action = 'add' | 'remove';

const HIGHLIGHTED_CSS_CLASS = 'xm-table-highlighted-row';

@Directive({
    selector: '[xmHighlightableRow]',
    standalone: true,
})
export class XmHighlightableRowDirective implements OnInit, OnDestroy, HighlightableRow {
    public registry: XmRowHighlightRegistry = inject(XmRowHighlightRegistry, { optional: true });
    private elementRef: ElementRef<HTMLElement> = inject<ElementRef<HTMLElement>>(ElementRef);

    public enabled: InputSignal<boolean> = input<boolean>(false, { alias: 'xmHighlightableRow' });
    public xmHighlightableRowIndex: InputSignal<number> = input.required<number>();

    public highlighted: boolean = false;

    @HostListener('click') public handleClick(): void {
        if (!this.enabled()) {
            return;
        }

        if (!this.registry) {
            this.highlighted = !this.highlighted;
            return;
        }

        this.highlighted
            ? this.registry.clear(this)
            : this.registry.select(this, this.xmHighlightableRowIndex());
    }

    public ngOnInit(): void {
        if (this.registry) {
            this.registry.register(this);
        }
    }

    public ngOnDestroy(): void {
        if (this.registry) {
            this.registry.unregister(this);
        }
    }

    public setHighlighted(highlighted: boolean): void {
        this.highlighted = highlighted;

        const method: Action = highlighted ? 'add' : 'remove';
        this.elementRef.nativeElement.classList[method](HIGHLIGHTED_CSS_CLASS);

    }
}
