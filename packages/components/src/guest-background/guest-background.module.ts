import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GuestBackgroundDirective } from './guest-background.directive';

@NgModule({
    exports: [GuestBackgroundDirective],
    declarations: [GuestBackgroundDirective],
    imports: [CommonModule],
})
export class GuestBackgroundModule {
}
