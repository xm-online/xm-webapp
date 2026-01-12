import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { Principal } from '@xm-ngx/core/user';

/**
 * 1. Conditionally includes an HTML element if current user has any
 * of the authorities passed as the `expression`.
 *
 * @example
 * ```
 *     <some-element *jhiHasAnyAuthority="'ROLE_ADMIN'">...</some-element>
 *
 *     <some-element *jhiHasAnyAuthority="['ROLE_ADMIN', 'ROLE_USER']">...</some-element>
 * ```
 *
 * 2. Conditionally includes an HTML element if current user does not have any
 * of the authorities passed as the `expression`.
 *
 * @example
 * ```
 *  <some-element *jhiHasAnyAuthority="'ROLE_USER'; opposite: true">
 *      This element is not visible for the role 'ROLE_USER'
 *  </some-element>
 * ```
 */
@Directive({
    selector: '[xmJhiHasAnyAuthority], [jhiHasAnyAuthority]',
    standalone: true,
})
export class HasAnyAuthorityDirective {

    private authorities: string[];
    private opposite = false;

    constructor(private principal: Principal,
                private templateRef: TemplateRef<any>,
                private viewContainerRef: ViewContainerRef) {
    }

    @Input()
    set jhiHasAnyAuthorityOpposite(value: boolean) {
        this.opposite = !!value;
        this.updateView();
    }

    @Input()
    set jhiHasAnyAuthority(value: string | string[]) {
        this.authorities = typeof value === 'string' ? [value] : value;
        this.updateView();
        // Get notified each time authentication state changes.
        this.principal.getAuthenticationState().subscribe((identity) => this.updateView());
    }

    private updateView(): void {
        this.principal.hasAnyAuthority(this.authorities).then((result) => {
            const shouldShow = this.opposite ? !result : result;

            this.viewContainerRef.clear();
            if (shouldShow) {
                this.viewContainerRef.createEmbeddedView(this.templateRef);
            }
        });
    }
}
