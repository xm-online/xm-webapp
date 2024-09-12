import { NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { DynamicLayoutConfig, TemplateListLayoutConfig } from './template-list-layout.model';
import { DashboardStore } from '@xm-ngx/core/dashboard';
import { XM_DYNAMIC_COMPONENT_CONFIG, XmDynamicModule } from '@xm-ngx/dynamic';
import { cloneDeep, set } from 'lodash';

@Component({
    standalone: true,
    selector: 'xm-template-list-layout',
    templateUrl: './template-list-layout.component.html',
    styleUrls: ['./template-list-layout.component.scss'],
    imports: [MatCardModule, XmDynamicModule, NgIf, NgForOf],
    providers: [DashboardStore],
    changeDetection: ChangeDetectionStrategy.Default, // keep OnPush
})
export class TemplateListLayoutComponent {
    public config = inject<TemplateListLayoutConfig>(XM_DYNAMIC_COMPONENT_CONFIG);

    public templates: { layout: DynamicLayoutConfig; value: unknown }[] = [];
    @Input() public value: any[];

    public ngOnChanges(): void {
        this.templates = (this.value || []).map((item, index) => {
            const layout = cloneDeep(this.config.layout);
            if (!layout.controllers) layout.controllers = [];
            layout.controllers.push(
                ...(this.config.controllers || []).map(controllerTemplate => {
                    const controller = cloneDeep(controllerTemplate);
                    set(controller, 'config.arrayItemIndex', index);
                    return controller;
                }),
            );
            return { layout, value: item };
        });
    }
}
