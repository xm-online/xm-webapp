import { TemplateRef, ViewContainerRef } from '@angular/core';
import { ConditionDirective } from './condition.directive';

describe('ConditionDirective', () => {
    it('should create an instance', () => {
        const v: ViewContainerRef = {} as ViewContainerRef;
        const t = {} as TemplateRef<undefined>;
        const directive = new ConditionDirective(v, t);
        expect(directive).toBeTruthy();
    });
});
