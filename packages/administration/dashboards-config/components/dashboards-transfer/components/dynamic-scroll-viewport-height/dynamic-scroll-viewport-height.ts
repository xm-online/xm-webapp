import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ChangeDetectorRef } from '@angular/core';

export abstract class DynamicScrollViewportHeight {
    public abstract cdkVirtualScrollViewport: CdkVirtualScrollViewport;
    public abstract cdr: ChangeDetectorRef;

    public viewportItemHeight: number = 56;
    public viewportHeight: number = this.viewportItemHeight;
    public MAX_VIEWPORT_HEIGHT: number = 560;

    public changeViewportHeight(items: unknown[]): void {
        this.viewportHeight = items.length >= 10 ? this.MAX_VIEWPORT_HEIGHT : items.length * this.viewportItemHeight;
        this.cdr.detectChanges();

        if (this.cdkVirtualScrollViewport) {
            this.cdkVirtualScrollViewport.checkViewportSize();
        }
    }
}
