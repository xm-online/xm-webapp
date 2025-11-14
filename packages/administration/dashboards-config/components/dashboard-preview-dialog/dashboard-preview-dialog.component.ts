import { Component, effect, inject, Injector, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { XmTranslatePipe, XmTranslationModule } from '@xm-ngx/translation';
import { Dashboard } from '@xm-ngx/core/dashboard';
import { DASHBOARDS_TRANSLATES } from '../../const';
import { DashboardPreviewService } from '../../services/dashboard-preview.service';
import { XmEntitySpecWrapperService } from '@xm-ngx/entity';
import { XmDynamicControllerInjectorFactoryService, XmDynamicModule } from '@xm-ngx/dynamic';
import { LoaderModule } from '@xm-ngx/components/loader';
import { NoDataModule } from '@xm-ngx/components/no-data';
import { XmNotEmptyPipe } from '@xm-ngx/pipes';

export interface DashboardPreviewDialogData {
    dashboard: Dashboard;
}

@Component({
    selector: 'xm-dashboard-preview-dialog',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        XmTranslationModule,
        XmTranslatePipe,
        LoaderModule,
        XmNotEmptyPipe,
        XmDynamicModule,
        NoDataModule,
    ],
    templateUrl: './dashboard-preview-dialog.component.html',
    styleUrls: ['./dashboard-preview-dialog.component.scss'],
})
export class DashboardPreviewDialogComponent implements OnInit, OnDestroy {
    public TRS: typeof DASHBOARDS_TRANSLATES = DASHBOARDS_TRANSLATES;

    public dashboard = signal<Dashboard | null>(null);
    public injector = signal<Injector | null>(null);
    public showLoader = signal<boolean>(true);

    protected dynamicControllerInjectorFactory = inject(XmDynamicControllerInjectorFactoryService);
    private componentInjector = inject(Injector);
    private dialogRef = inject(MatDialogRef<DashboardPreviewDialogComponent>);
    private data = inject<DashboardPreviewDialogData>(MAT_DIALOG_DATA);
    private previewService = inject(DashboardPreviewService);
    private xmEntitySpecWrapperService = inject(XmEntitySpecWrapperService);

    constructor() {
        effect(async () => {
            const dashboard = this.previewService.dashboard();

            if (dashboard) {
                if (dashboard?.config?.controllers?.length > 0) {
                    const injector = await this.dynamicControllerInjectorFactory.defineProviders(
                        dashboard.config.controllers,
                        [],
                        this.componentInjector
                    );
                    this.injector.set(injector);
                } else {
                    this.injector.set(this.componentInjector);
                }

                this.dashboard.set(dashboard);
                this.showLoader.set(false);
            }
        });
    }

    public async ngOnInit(): Promise<void> {
        await this.xmEntitySpecWrapperService.spec();
        this.previewService.setPreviewDashboard(this.data.dashboard);
    }

    public ngOnDestroy(): void {
        this.previewService.clearPreview();
    }

    public onClose(): void {
        this.dialogRef.close();
    }

    public isCustomElement(layout: { widget: unknown }): boolean {
        return Boolean(layout.widget);
    }

    public resolveCustomParams(layout: { widget: { module: string; selector: string; config: unknown } }): unknown {
        return {
            selector: layout.widget.selector,
            config: layout.widget.config,
        };
    }
}