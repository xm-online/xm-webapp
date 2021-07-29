import { AfterContentInit, Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { XmPermissionService } from '../xm-permission.service';
import { take } from 'rxjs/operators';

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

    constructor(private permissionService: XmPermissionService,
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
        this._xmPermitted = typeof value === 'string' ? [value] : (value || []);
        this.updateView();
    }

    public get permitted(): string[] {
        return this.xmPermitted;
    }

    @Input()
    public set permitted(value: string[]) {
        this.xmPermitted = value;
    }

    @Input() public xmPermittedContext: () => boolean = () => true;

    public ngOnInit(): void {
        this.privilegeSubscription = this.permissionService.permissions$()
            .subscribe(() => this.updateView());
    }

    public ngOnDestroy(): void {
        this.privilegeSubscription?.unsubscribe();
    }

    public ngAfterContentInit(): void {
        this.updateView();
    }

    private updateView(): void {
        if (this._xmPermitted.length === 0) {
            this.viewContainerRef.clear();
            return;
        }
        void this.permissionService.hasPrivileges(this._xmPermitted).pipe(
            take(1),
        ).subscribe((result) => {
            this.viewContainerRef.clear();
            if (result && this.xmPermittedContext()) {
                this.viewContainerRef.createEmbeddedView(this.templateRef);
            }
        });
    }

}
