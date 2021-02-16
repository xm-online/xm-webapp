import { Component } from '@angular/core';
import { XmLinkViewCopyOptions, XmLinkViewOptions } from '@xm-ngx/components/link';
import { XmLinkOptions } from '@xm-ngx/components/link/xm-link';

@Component({
    selector: 'xm-link-example',
    templateUrl: './xm-link-example.component.html',
})
export class XmLinkExampleComponent {
    public linkValue: unknown = {
        id: 'unique-id',
        key: 'special-key',
        name: 'name',
    };
    public linkOptions: XmLinkOptions = {
        valueField: 'id',
        valueIcon: 'history',
        valueTitle: 'ID Title. ',
        routerLink: '/dashboard/example page',
        queryParamsFromEntityFields: { key: 'key' },
    };

    public linkViewOptions: XmLinkViewOptions = {
        ...this.linkOptions,
        title: 'Link title',
        styleInline: false,
        icon: 'smile',
    };

    public linkViewCopyOptions: XmLinkViewCopyOptions = {
        ...this.linkViewOptions,
        copy: {
            template: '{{value.id}}',
            copiedMessage: 'Copied the value: "{{value.id}}"!',
        },
    };

}
