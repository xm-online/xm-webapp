import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NavbarGuestBackgroundDirective } from './navbar-guest-background.directive';

@NgModule({
    declarations: [NavbarGuestBackgroundDirective],
    exports: [NavbarGuestBackgroundDirective],
    imports: [CommonModule],
})
export class NavbarGuestBackgroundModule {
}
