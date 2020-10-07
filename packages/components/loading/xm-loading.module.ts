import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoadingDirective } from './loading.directive';


@NgModule({
    exports: [LoadingDirective],
    declarations: [LoadingDirective],
    imports: [CommonModule],
})
export class XmLoadingModule {
}
