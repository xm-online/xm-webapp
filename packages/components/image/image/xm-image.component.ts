import { Component, Input } from '@angular/core';
import { DataQa } from '@xm-ngx/shared/interfaces';
import { clone, defaults } from 'lodash';

export interface XmImageOptions extends DataQa {
    alt?: string;
    imageClass?: string;
    imageStyle?: string;
}

export const XM_IMAGE_OPTIONS_DEFAULT: XmImageOptions = {
    imageClass: 'img-fluid',
    imageStyle: 'max-height: 40px;',
    dataQa: 'image',
    alt: '',
};

@Component({
    selector: 'xm-image',
    templateUrl: './xm-image.component.html',
    styleUrls: ['./xm-image.component.scss'],
})
export class XmImageComponent {
    @Input() public value: string;

    private _options: XmImageOptions = clone(XM_IMAGE_OPTIONS_DEFAULT);

    public get options(): XmImageOptions {
        return this._options;
    }

    @Input()
    public set options(value: XmImageOptions) {
        this._options = defaults(value, XM_IMAGE_OPTIONS_DEFAULT);
    }
}
