import { EmbeddedViewRef, TemplateRef, ViewContainerRef } from '@angular/core';
import { ReplaySubject, Subscription } from 'rxjs';

export interface IfElseThenBaseContext {
    allow: boolean;
}

export abstract class IfElseThenBaseDirective<T extends IfElseThenBaseContext> {

    protected viewContainer: ViewContainerRef;

    protected context: T | null = null;

    protected thenTemplateRef: TemplateRef<T> | null = null;
    protected elseTemplateRef: TemplateRef<T> | null = null;
    protected thenViewRef: EmbeddedViewRef<T> | null = null;
    protected elseViewRef: EmbeddedViewRef<T> | null = null;

    protected update$: ReplaySubject<void> = new ReplaySubject(1);

    protected subscription: Subscription;

    public ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    protected setThenTemplateRef(templateRef: TemplateRef<T> | null): void {
        if (!templateRef || !(templateRef instanceof TemplateRef)) {
            throw new Error('Must be a TemplateRef');
        }
        this.thenTemplateRef = templateRef;
        this.thenViewRef = null;
        this.validate();
    }

    protected setElseTemplateRef(templateRef: TemplateRef<T> | null): void {
        if (!templateRef || !(templateRef instanceof TemplateRef)) {
            throw new Error('Must be a TemplateRef');
        }
        this.elseTemplateRef = templateRef;
        this.elseViewRef = null;
        this.validate();
    }

    protected validate(): void {
        this.update$.next();
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
