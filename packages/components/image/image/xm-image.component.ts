import { Component, Input } from '@angular/core';
import { DataQa } from '@xm-ngx/interfaces';
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
    standalone: false,
})
export class XmImageComponent {
    @Input() public value: string;

    private _config: XmImageOptions = clone(XM_IMAGE_OPTIONS_DEFAULT);

    public get config(): XmImageOptions {
        return this._config;
    }

    @Input()
    public set config(value: XmImageOptions) {
        this._config = defaults(value, XM_IMAGE_OPTIONS_DEFAULT);
    }
}
