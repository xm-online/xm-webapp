import { HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';

import { DashboardWidget, WidgetService } from '@xm-ngx/dashboard';
import { TdTextEditorComponent } from '@covalent/text-editor';
import { ITranslate } from '@xm-ngx/translation';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';

export interface MdEditorOptions {
    autofocus?: boolean;
    status?: boolean;
    promptURLs?: boolean;
    spellChecker?: boolean;
    showIcons?: string[];
}

export interface MdWidgetConfig {
    contenct: string;
    content: string;
    isEditable: boolean;
}

@Component({
    selector: 'xm-md-widget',
    templateUrl: './md-widget.component.html',
    styleUrls: ['./md-widget.component.scss'],
})
export class MdWidgetComponent implements AfterViewInit, OnDestroy {

    public config: { id: number, name: string | ITranslate };
    public widgetConfig: MdWidgetConfig;
    public isEditMode: boolean;
    public editorOptions: MdEditorOptions = {
        autofocus: false,
        status: true,
        promptURLs: true,
        spellChecker: false,
        showIcons: ['code', 'table'],
    };
    @ViewChild('mdEditor', {static: false}) private _textEditor: TdTextEditorComponent;

    constructor(private widgetService: WidgetService) {
    }

    public ngAfterViewInit(): void {
        this.widgetService
            .find(this.config.id)
            .pipe(takeUntilOnDestroy(this))
            .subscribe((result: HttpResponse<DashboardWidget>) => {
                const w: DashboardWidget = result && result.body;
                this.widgetConfig = w.config || null;
                setTimeout(() => {
                    if (!this._textEditor.isPreviewActive()) {
                        this._textEditor.togglePreview();
                    }
                }, 0);
            });
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    public onEditMode(): void {
        this.isEditMode = !this.isEditMode;
        this._textEditor.togglePreview();
    }

    public onSave(): void {
        this.widgetService
            .find(this.config.id)
            .pipe(takeUntilOnDestroy(this))
            .subscribe((result: HttpResponse<DashboardWidget>) => {
                const widget: DashboardWidget = result.body;
                widget.config = widget.config || {};
                Object.assign(widget.config, {content: this._textEditor.value});
                Object.assign(widget, {dashboard: {id: Number(widget.dashboard)}}); // widget.dashboard must be an object
                this.widgetService.update(widget).pipe(takeUntilOnDestroy(this)).subscribe(() => {
                    this.isEditMode = false;
                    if (!this._textEditor.isPreviewActive()) {
                        this._textEditor.togglePreview();
                    }
                });
            });
    }

}
