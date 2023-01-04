import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { RouterModule } from '@angular/router';
import { XmTranslationModule } from '@xm-ngx/translation';
import { ImageLogoComponent } from './image-logo.component';


@NgModule({
    declarations: [
        ImageLogoComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        XmTranslationModule,
    ],
})
export class ImageLogoModule {
    public entry: Type<ImageLogoComponent> = ImageLogoComponent;
}
