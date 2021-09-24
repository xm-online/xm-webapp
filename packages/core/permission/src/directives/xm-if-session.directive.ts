import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { IfElseThenBaseContext, IfElseThenBaseDirective } from './if-else-then-base.directive';
import { XmSessionService } from '@xm-ngx/core';
import { PermissionContext } from './permission.directive';
import { switchMap } from 'rxjs/operators';

@Directive({
    selector: '[xmIfSession]',
})
export class XmIfSessionDirective extends IfElseThenBaseDirective<IfElseThenBaseContext> implements OnInit, OnDestroy {

    constructor(
        private sessionService: XmSessionService,
        viewContainer: ViewContainerRef,
        templateRef: TemplateRef<PermissionContext>,
    ) {
        super();
        this.thenTemplateRef = templateRef;
        this.viewContainer = viewContainer;
        this.context = { allow: false };
    }

    @Input()
    public set xmIfSession(value: boolean) {
        this.context.allow = value;
        this.validate();
    }

    public ngOnInit(): void {
        this.subscription = this.update$.pipe(
            switchMap(() => this.sessionService.isActive()),
        ).subscribe((allow: boolean) => {
            this.context.allow = allow;
            this.updateView();
        });
    }

}
