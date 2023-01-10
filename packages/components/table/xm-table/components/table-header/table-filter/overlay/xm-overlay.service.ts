import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { Injectable, Injector, TemplateRef, Type } from '@angular/core';
import { CustomOverlayRef } from '@xm-ngx/components/table/xm-table/components/table-header/table-filter/overlay/custom-overlay-ref';
import { XmOverlayComponent } from '@xm-ngx/components/table/xm-table/components/table-header/table-filter/overlay/xm-overlay-component/xm-overlay.component';

@Injectable({ providedIn: 'any' })
export class XmOverlayService {
    private overlayConfig: OverlayConfig = new OverlayConfig({
        hasBackdrop: true,
        positionStrategy: this.overlay.position()
            .global()
            .centerHorizontally()
            .centerVertically(),
        backdropClass: 'cdk-overlay-transparent-backdrop',
    });

    constructor(private overlay: Overlay,
                private injector: Injector) {
    }

    public setOverlayConfig(config: OverlayConfig): void {
        this.overlayConfig = config;
    }

    public open<R = unknown, T = unknown>(
        content: string | TemplateRef<unknown> | Type<unknown>,
        data: T,
    ): CustomOverlayRef<R, T> {
        const overlayRef = this.overlay.create(this.overlayConfig);
        const myOverlayRef = new CustomOverlayRef<R, T>(overlayRef, content, data);
        const injector = XmOverlayService.createInjector(myOverlayRef, this.injector);
        overlayRef.attach(new ComponentPortal(XmOverlayComponent, null, injector));

        return myOverlayRef;
    }

    private static createInjector(ref, inj: Injector) {
        const injectorTokens = new WeakMap();
        injectorTokens.set(CustomOverlayRef, ref);
        return new PortalInjector(inj, injectorTokens);
    }
}
