import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { PermissionCheckStrategy, XmPermissionService } from '../xm-permission.service';
import { IfElseThenBaseDirective } from './if-else-then-base.directive';

export interface PermissionContext {
    $implicit: string[];
    permissions: string[];
    allow: boolean;
}

function permissionContextFactory(): PermissionContext {
    return {
        $implicit: null,
        permissions: null,
        allow: null,
    };
}

/**
 *
 * @example
 * ```
 * <div *xmPermission="undefined"> Show template </div>
 * <div *xmPermission="null"> Show template </div>
 * <div *xmPermission="''"> Show template </div>
 * <div *xmPermission="[]"> Show template </div>
 * <div *xmPermission=""> Show template </div>
 *
 * <div *xmPermission="true"> Show template </div>
 * <div *xmPermission="false"> Hide template </div>
 *
 * <div *xmPermission="'RIGHT_PERMISSION'" Show template </div>
 * <div *xmPermission="['RIGHT_PERMISSION']" Show template </div>
 * <div *xmPermission="['WRONG_PERMISSION']" Hide template </div>
 * <div *xmPermission="['RIGHT_PERMISSION', 'WRONG_PERMISSION']" Hide template </div>
 *
 *  <ng-template #permittedRef> Show template </ng-template>
 *  <ng-template #noPermittedRef> Hide template </ng-template>
 *
 *  <!-- Result: Hide template -->
 *  <ng-template [xmPermission]="['WRONG_PERMISSION']"
 *               [xmPermissionThen]="permittedRef"
 *               [xmPermissionElse]="noPermittedRef">Remove xmPermissionThen to show</ng-template>
 *
 *  <!-- Result: Shows template -->
 *  <div *xmPermission="['RIGHT_PERMISSION']; else noPermittedRef"> Shows template </div>
 * ```
 */
@Directive({
    selector: '[xmPermission]',
})
export class PermissionDirective
    extends IfElseThenBaseDirective<PermissionContext>
    implements OnInit, OnDestroy {

    @Input() public strategy: PermissionCheckStrategy = PermissionCheckStrategy.ALL;
    protected context: PermissionContext | null = permissionContextFactory();

    constructor(
        private permissionService: XmPermissionService,
        viewContainer: ViewContainerRef,
        templateRef: TemplateRef<PermissionContext>,
    ) {
        super();
        this.thenTemplateRef = templateRef;
        this.viewContainer = viewContainer;
    }

    @Input()
    public set xmPermission(value: string | boolean | string[]) {
        if (!value || value === true || value.length === 0) {
            // Show by default
            this.context.$implicit = [];
            this.context.allow = value !== false;
            this.updateView();
            return;
        }

        this.context.$implicit = this.context.permissions = Array.isArray(value) ? value : [value];
        this.update.next();
    }

    @Input()
    set xmPermissionThen(templateRef: TemplateRef<PermissionContext> | null) {
        this.setThenTemplateRef(templateRef);
    }

    @Input()
    set xmPermissionElse(templateRef: TemplateRef<PermissionContext> | null) {
        this.setElseTemplateRef(templateRef);
    }

    public ngOnInit(): void {
        this.subscription = this.update.pipe(
            switchMap(() => this.permissionService.hasPrivilegesBy(this.context.$implicit, this.strategy)),
        ).subscribe((allow: boolean) => {
            this.context.allow = allow;
            this.updateView();
        });
    }

}
