import { Component, Input } from '@angular/core';

export interface ImageOptions {
    alt?: string;
    class?: string;
    style?: string;
}

@Component({
    selector: 'xm-image-view',
    templateUrl: './image-view.component.html',
    styleUrls: ['./image-view.component.scss'],
})
export class ImageViewComponent {
    @Input() public value: string;
    @Input() public options: ImageOptions;
}
