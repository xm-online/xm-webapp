import { NgModule } from '@angular/core';
import { HintComponent } from './hint.component';

@NgModule({
    imports: [
        HintComponent,
    ],
    exports: [HintComponent],
})
export class HintModule {}
