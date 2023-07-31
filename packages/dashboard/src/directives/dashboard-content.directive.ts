import { Directive, HostListener, Input, inject } from '@angular/core';
import { DynamicContentService } from '../stores/dynamic-content/dynamic-content.service';

@Directive({
    standalone: true,
    selector: '[dashboardContent]',
})
export class DashboardContentDirective {
    private dynamicContentService = inject(DynamicContentService);

    @Input() public dashboardContent: unknown;
    
    @HostListener('click', ['$event']) public setContent(evt: PointerEvent): void {
        this.dynamicContentService.loadContent(this.dashboardContent);
    }
}