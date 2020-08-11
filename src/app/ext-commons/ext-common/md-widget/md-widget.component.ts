import { HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, ViewChild } from '@angular/core';

import { Widget, WidgetService } from '@xm-ngx/dashboard';
import { TdTextEditorComponent } from '@covalent/text-editor';

@Component({
    selector: 'xm-md-widget',
    templateUrl: './md-widget.component.html',
    styleUrls: ['./md-widget.component.scss'],
})
export class MdWidgetComponent implements AfterViewInit {

    public config: any;
    public widgetConfig: any;
    public isEditMode: boolean;
    public editorOptions: any = {
        autofocus: true,
        status: true,
        promptURLs: true,
        spellChecker: false,
        showIcons: ['code', 'table'],
    };
    @ViewChild('mdEditor', {static: false}) private _textEditor: TdTextEditorComponent;

    constructor(private widgetService: WidgetService) {
    }

    public ngAfterViewInit(): void {
        this.widgetService.find(this.config.id).subscribe((result: HttpResponse<Widget>) => {
            const w: Widget = result && result.body;
            this.widgetConfig = w.config || null;
            setTimeout(() => {
                if (!this._textEditor.isPreviewActive()) {
                    this._textEditor.togglePreview();
                }
            }, 0);
        });
    }

    public onEditMode(): void {
        this.isEditMode = !this.isEditMode;
        this._textEditor.togglePreview();
    }

    public onSave(): void {
        this.widgetService.find(this.config.id).subscribe((result: HttpResponse<Widget>) => {
            const widget: Widget = result.body;
            widget.config = widget.config || {};
            Object.assign(widget.config, {content: this._textEditor.value});
            Object.assign(widget, {dashboard: {id: Number(widget.dashboard)}}); // widget.dashboard must be an object
            this.widgetService.update(widget).subscribe(() => {
                this.isEditMode = false;
                this.widgetConfig = {...widget.config};
                if (!this._textEditor.isPreviewActive()) {
                    this._textEditor.togglePreview();
                }
            });
        });
    }

}
