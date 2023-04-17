import { Component, Input, OnInit } from '@angular/core';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { UserService } from '@xm-ngx/core/user';

export type TimelineItemData = {
    messageData?: string,
    startDate?: string,
    login?: string,
    userKey?: string,
}

@Component({
    selector: 'xm-common-timeline-card',
    templateUrl: './timeline-card.component.html',
    styleUrls: ['./timeline-card.component.scss'],
})
export class TimelineCardComponent implements OnInit {
    public login: string = 'System';
    @Input() public item: TimelineItemData;

    constructor(private userService: UserService) {
    }

    public ngOnInit(): void {
        if (this.item.login) {
            this.login = this.item.login;
        }
        if (this.item.userKey) {
            this.userService.find(this.item.userKey).pipe(takeUntilOnDestroy(this)).subscribe(user => {
                if (user.firstName || user.lastName) {
                    this.login = `${user.firstName ? user.firstName + ' ' : ''}${user.lastName || ''}`;
                } else if (user.logins.map(v => v.typeKey).includes(v => v === 'LOGIN.NICKNAME')) {
                    this.login = user.logins.find(v => v === 'LOGIN.NICKNAME').login;
                } else {
                    this.login = this.item.userKey;
                }
            });
        }
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }
}
