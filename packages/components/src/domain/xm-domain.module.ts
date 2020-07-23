import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DomainDirective } from './domain.directive';


@NgModule({
    declarations: [DomainDirective],
    exports: [DomainDirective],
    imports: [CommonModule],
})
export class XmDomainModule {
}
