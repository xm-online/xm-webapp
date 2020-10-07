import { NgModule } from '@angular/core';
import { ConditionDirective } from './condition.directive';

@NgModule({
    exports: [ConditionDirective],
    declarations: [ConditionDirective],
})
export class ConditionModule {
}
