import { Component, Input } from '@angular/core';

export type TimelineItemData = {
    messageData?: string,
    startDate?: string,
    login?: string,
}

@Component({
    selector: 'xm-common-timeline-card',
    templateUrl: './timeline-card.component.html',
    styleUrls: ['./timeline-card.component.scss'],
})
export class TimelineCardComponent {
    @Input() public item: TimelineItemData;
}
