import { AfterContentInit, Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { Principal } from '@xm-ngx/core/auth';
import { environment } from '@xm-ngx/core/environment';

/**
 * Conditionally includes an HTML element if current user has any
 * of xmPermitted AND if xmPermittedContext (optional) evaluated as True.
 *
 * xmPermittedContext is a call back function that evaluates state of component and provides true/false answer.
 *
 * @example
 * ```
 *     <some-element *xmPermitted="['COMMENTS.DELETE']">...</some-element>
 *     <some-element *xmPermitted="['COMMENTS.DELETE', 'COMMENTS.CREATE']">...</some-element>
 *     <some-element *xmPermitted="['COMMENTS.DELETE', 'COMMENTS.CREATE']; context: contextResolver()"></some-element>
 * ```
 * where contextResolver is a function that returns a function from component controller
 * ```
 * contextResolver(): Function {
 *   return () => {return true/false}
 * }
 * ```
 */
@Directive({
    selector: '[xmPermitted], [permitted]',
})
export class XmPermittedDirective implements OnInit, OnDestroy, AfterContentInit {
    private privilegeSubscription: Subscription;

    constructor(private principal: Principal,
                private templateRef: TemplateRef<unknown>,
                private viewContainerRef: ViewContainerRef,
    ) {
    }

    private _xmPermitted: string[] = [];

    public get xmPermitted(): string[] {
        return this._xmPermitted;
    }

    @Input()
    public set xmPermitted(value: string[]) {

        if (!environment.production) {
            // eslint-disable-next-line no-console
            console.log('[DBG] XM %o', value);
        }

        this._xmPermitted = typeof value === 'string' ? [value] : value;
        this.updateView();
    }

    public get permitted(): string[] {
        return this.xmPermitted;
    }

    @Input()
    public set permitted(value: string[]) {
        if (!environment.production) {
            // eslint-disable-next-line no-console
            console.log('[DBG] XM %o', value);
        }
        this.xmPermitted = value;
    }

    @Input() public xmPermittedContext: () => boolean = () => true;

    public ngOnInit(): void {
        this.privilegeSubscription = this.principal.getAuthenticationState()
            .subscribe(() => this.updateView());
    }

    public ngOnDestroy(): void {
        this.privilegeSubscription?.unsubscribe();
    }

    public ngAfterContentInit(): void {
        this.updateView();
    }

    private updateView(): void {
        void this.principal.hasPrivileges(this._xmPermitted).then((result) => {
            this.viewContainerRef.clear();
            if (result && this.xmPermittedContext()) {
                this.viewContainerRef.createEmbeddedView(this.templateRef);
            }
        });
    }

}
