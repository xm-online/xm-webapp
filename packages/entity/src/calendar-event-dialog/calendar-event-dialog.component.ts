import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';
import * as moment from 'moment';

import { XmEntitySpecWrapperService } from '@xm-ngx/entity/shared';
import { Principal } from '@xm-ngx/core/user';
import { CalendarSpec } from '@xm-ngx/entity/shared';
import { Calendar } from '@xm-ngx/entity/shared';
import { CalendarService } from '@xm-ngx/entity/shared';
import { Event } from '@xm-ngx/entity/shared';
import { EventService } from '@xm-ngx/entity/shared';
import { XmEntity } from '@xm-ngx/entity/shared';
import { buildJsfAttributes, nullSafe } from '@xm-ngx/json-scheme-form';
import { UUID } from 'angular2-uuid';
import { MatDialogRef } from '@angular/material/dialog';

declare let swal: any;

@Component({
    selector: 'xm-calendar-event-dialog',
    templateUrl: './calendar-event-dialog.component.html',
    styleUrls: ['./calendar-event-dialog.component.scss'],
})
export class CalendarEventDialogComponent implements OnInit {

    @Input() public xmEntity: XmEntity;
    @Input() public event: Event;
    @Input() public timezone: string;
    @Input() public calendar: Calendar;
    @Input() public calendarSpec: CalendarSpec;
    @Input() public onAddEvent: () => void;
    @Input() public onRemoveEvent: (event: Event, callback: () => void) => void;

    public showLoader: boolean;
    public jsfAttributes: any;
    private eventSpec: any;

    constructor(
        private xmEntitySpecWrapperService: XmEntitySpecWrapperService,
        private dialogRef: MatDialogRef<CalendarEventDialogComponent>,
        private eventService: EventService,
        private calendarService: CalendarService,
        private translateService: TranslateService,
        public principal: Principal,
    ) {}

    public ngOnInit(): void {
        const event: any = (this.calendarSpec.events.length && this.calendarSpec.events[0]) || {};
        event.dataTypeKey && this.xmEntitySpecWrapperService
            .xmSpecByKey(event.dataTypeKey)
            .subscribe((spec) => {
                if (spec) {
                    this.eventSpec = spec;
                    this.loadJSFAttributes();
                }
            });
    }

    public onChangeSchemaForm(data: any): void {
        this.event.eventDataRef = this.event.eventDataRef || {
            typeKey: this.eventSpec.key,
            key: UUID.UUID(),
            name: 'Event eventDataRef',
        } as XmEntity;
        Object.assign(this.event.eventDataRef, { data });
    }

    public onConfirmSave(): void {
        this.showLoader = true;
        if (this.calendar.id) {
            this.processCalendarEvent(this.calendar, this.event);
        } else {
            this.calendarService.create(this.calendar).pipe(finalize(() => this.showLoader = false))
                .subscribe(
                    (calendarResp: HttpResponse<Calendar>) => {
                        const newCalendar = calendarResp.body;
                        this.processCalendarEvent(newCalendar, this.event);
                    },
                    (err) => console.info(err),
                    () => this.showLoader = false);
        }
    }

    private loadJSFAttributes(): void {
        if (this.eventSpec && this.eventSpec.dataSpec) {
            this.jsfAttributes = buildJsfAttributes(this.eventSpec.dataSpec, this.eventSpec.dataForm);
            this.jsfAttributes.data = Object.assign(
                nullSafe(this.jsfAttributes.data),
                nullSafe((this.event.eventDataRef && this.event.eventDataRef.data) || {}),
            );
        }
    }

    private processCalendarEvent(calendar: Calendar, event: Event): void {
        if (calendar && event) {
            const calendarId = calendar.id;
            event.calendar = calendarId;
            this.eventService[event.id ? 'update' : 'create'](event, this.timezone)
                .pipe(finalize(() => this.showLoader = false))
                .subscribe(
                    () => this.onSaveSuccess(calendarId),
                    (err) => console.info(err),
                    () => this.showLoader = false);
        }
    }

    public onCancel(): void {
        this.dialogRef.close('cancel');
    }

    public onRemove(): void {
        this.onRemoveEvent(this.event, () => this.onCancel());
    }

    public eventEndDateChange(event: { value: string }): void {
        this.event.endDate = moment(event.value).format('YYYY-MM-DDTHH:mm:ss');
    }

    public eventStartDateChange(event: { value: string }): void {
        this.event.startDate = moment(event.value).format('YYYY-MM-DDTHH:mm:ss');
    }

    private onSaveSuccess(calendarId: number): void {
        this.dialogRef.close(true);
        this.alert('success', 'xm-entity.calendar-event-dialog.add.success');
        this.calendar.id = calendarId;
        this.onAddEvent();
    }

    private alert(type: string, key: string): void {
        swal({
            type,
            text: this.translateService.instant(key),
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-primary',
        });
    }
}
