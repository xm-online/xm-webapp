import { Component, Input, NgModule, OnInit, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { defaults } from 'lodash';

interface XmTimeStamp {
    type?: string;
}

@Component({
    selector: 'xm-unix-time-stamp-to-spent-time',
    template: `
        <span *ngIf="value && options?.type === 'SPENT-TIME'">{{ formatDate }}</span>

        <span *ngIf="value && options?.type === 'DATE'">{{ formatDate | date:"dd.MM.yyyy HH:mm" }}</span>
    `,
})
export class XmUnixTimeStampToSpentTimeFormatComponent implements OnInit {
    @Input() public value: number;

    protected _options: XmTimeStamp = {};

    @Input()
    public set options(value: XmTimeStamp) {
        this._options = defaults(value, {});
    }

    public get options(): XmTimeStamp {
        return this._options;
    }

    public formatDate = '';

    public ngOnInit(): void {
        if (this.options?.type === 'SPENT-TIME') {
            this.timeStampToHoursMinutes();
        }

        if (this.options?.type === 'DATE') {
            this.timeStampToHumanReadableDate();
        }
    }

    public timeStampToHoursMinutes(): void {
        const hours = Math.floor((this.value % (24*60*60*1000)) / (60*60*1000));
        const minutes = Math.floor((this.value % (60*60*1000)) / (60*1000));

        this.formatDate = `${ hours }h ${ minutes }m`;
    }

    public timeStampToHumanReadableDate(): void {
        this.formatDate = new Date(this.value).toISOString();
    }
}

@NgModule({
    exports: [XmUnixTimeStampToSpentTimeFormatComponent],
    declarations: [XmUnixTimeStampToSpentTimeFormatComponent],
    imports: [CommonModule],
})
export class XmUnixTimeStampToSpentTimeFormatModule {
    public entry: Type<XmUnixTimeStampToSpentTimeFormatComponent> = XmUnixTimeStampToSpentTimeFormatComponent;
}
