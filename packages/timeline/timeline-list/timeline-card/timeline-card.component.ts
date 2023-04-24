import { Component, Input, OnInit } from '@angular/core';

export type TimelineItemData = {
    data?: any;
    messageData?: string,
    startDate?: string,
    login?: string,
    userKey?: string,
}

@Component({
    selector: 'xm-timeline-card',
    templateUrl: './timeline-card.component.html',
    styleUrls: ['./timeline-card.component.scss'],
})
export class TimelineCardComponent implements OnInit {
    public login: string = 'System';
    @Input() public item: TimelineItemData;

    public ngOnInit(): void {
        if (this.item.data && (this.item.data.firstName || this.item.data.lastName)) {
            this.login = `${this.item.data.firstName ? this.item.data.firstName + ' ' : ''}${this.item.data.lastName || ''}`;
        } else if (this.item?.data?.login) {
            this.login = this.item.data.login;
        } else if (this.item.login) {
            this.login = this.item.login;
        }
    }
}
