import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouteChangeAnimationDirective } from './route-change-animation.directive';

@NgModule({
    declarations: [RouteChangeAnimationDirective],
    exports: [RouteChangeAnimationDirective],
    imports: [
        CommonModule,
    ],
})
export class RouteChangeAnimationModule {
}
