import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, Type } from '@angular/core';
import { CustomOverlayRef } from '@xm-ngx/components/table/xm-table/components/table-header/table-filter/overlay/custom-overlay-ref';
import { MatModule } from '../../../../../../../../../src/app/mat.module';

@Component({
    selector: 'xm-overlay',
    templateUrl: './overlay.component.html',
    standalone: true,
    imports: [
        CommonModule,
        MatModule,
    ],
})
export class OverlayComponent implements OnInit {

    public contentType: 'template' | 'string' | 'component';
    public content: string | TemplateRef<unknown> | Type<unknown>;
    public context;

    constructor(private ref: CustomOverlayRef<unknown, unknown>) {
    }

    public close(): void {
        this.ref.close(null);
    }

    public ngOnInit(): void {
        this.content = this.ref.content;

        if (typeof this.content === 'string') {
            this.contentType = 'string';
        } else if (this.content instanceof TemplateRef) {
            this.contentType = 'template';
            this.context = {
                close: this.ref.close.bind(this.ref),
            };
        } else {
            this.contentType = 'component';
        }
    }

}
