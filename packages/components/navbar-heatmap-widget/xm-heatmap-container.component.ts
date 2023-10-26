import { Component } from '@angular/core';

@Component({
    selector: 'xm-heatmap-container',
    template: `
        <div class="hidden-heatmap" id="heatmapContainer">
            <ng-content></ng-content>
        </div>
    `,
    host: { class: 'heatmap-container-wrapper' },
    styleUrls: ['./heatmap-container.scss'],
    standalone: true,
})
export class XmHeatmapContainerComponent {
}
