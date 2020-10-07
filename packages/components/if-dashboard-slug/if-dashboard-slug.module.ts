import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IfDashboardSlugDirective } from './if-dashboard-slug.directive';


@NgModule({
    declarations: [IfDashboardSlugDirective],
    exports: [IfDashboardSlugDirective],
    imports: [
        CommonModule,
    ],
})
export class IfDashboardSlugModule {
}
