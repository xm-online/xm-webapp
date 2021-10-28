import { Directive, EmbeddedViewRef, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { ReplaySubject, Subscription } from 'rxjs';
import { ArgumentException } from '@xm-ngx/shared/exceptions';

export interface IfElseThenBaseContext {
    allow: boolean;
}

@Directive()
export abstract class IfElseThenBaseDirective<T extends IfElseThenBaseContext> implements OnDestroy {

    protected viewContainer: ViewContainerRef;

    protected context: T | null = null;

    protected thenTemplateRef: TemplateRef<T> | null = null;
    protected elseTemplateRef: TemplateRef<T> | null = null;
    protected thenViewRef: EmbeddedViewRef<T> | null = null;
    protected elseViewRef: EmbeddedViewRef<T> | null = null;

    protected update: ReplaySubject<void> = new ReplaySubject(1);

    protected subscription: Subscription;

    public ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.update.complete();
    }

    protected setThenTemplateRef(templateRef: TemplateRef<T> | null): void {
        if (!templateRef || !(templateRef instanceof TemplateRef)) {
            throw new ArgumentException('TemplateRef is undefined!');
        }
        this.thenTemplateRef = templateRef;
        this.thenViewRef = null;
        this.update.next();
    }

    protected setElseTemplateRef(templateRef: TemplateRef<T> | null): void {
        if (!templateRef || !(templateRef instanceof TemplateRef)) {
            throw new ArgumentException('TemplateRef is undefined!');
        }
        this.elseTemplateRef = templateRef;
        this.elseViewRef = null;
        this.update.next();
    }

    protected updateView(): void {
        if (this.context.allow) {
            if (!this.thenViewRef) {
                this.viewContainer.clear();
                this.elseViewRef = null;
                if (this.thenTemplateRef) {
                    this.thenViewRef = this.viewContainer.createEmbeddedView(this.thenTemplateRef, this.context);
                }
            }
        } else {
            if (!this.elseViewRef) {
                this.viewContainer.clear();
                this.thenViewRef = null;
                if (this.elseTemplateRef) {
                    this.elseViewRef = this.viewContainer.createEmbeddedView(this.elseTemplateRef, this.context);
                }
            }
        }
    }
}
