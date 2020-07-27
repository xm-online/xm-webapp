import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { ImageViewComponent } from './image-view.component';


@NgModule({
    declarations: [ImageViewComponent],
    exports: [ImageViewComponent],
    imports: [CommonModule],
})
export class XmImageViewModule {
    public entry: Type<ImageViewComponent> = ImageViewComponent;
}
