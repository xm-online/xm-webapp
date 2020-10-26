import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';

import { XmEntitySpecWrapperService } from '../../xm-entity/shared/xm-entity-spec-wrapper.service';
import { Principal } from '../../shared/auth/principal.service';
import { CalendarSpec } from '../shared/calendar-spec.model';
import { Calendar } from '../shared/calendar.model';
import { CalendarService } from '../shared/calendar.service';
import { Event } from '../shared/event.model';
import { EventService } from '../shared/event.service';
import { XmEntity } from '../shared/xm-entity.model';
import { buildJsfAttributes, nullSafe } from '../../shared/jsf-extention';
import { UUID } from 'angular2-uuid';
import * as moment from 'moment';

declare let swal: any;

@Component({
    selector: 'xm-calendar-event-dialog',
    templateUrl: './calendar-event-dialog.component.html',
    styleUrls: ['./calendar-event-dialog.component.scss'],
})
export class CalendarEventDialogComponent implements OnInit {

    @Input() public xmEntity: XmEntity;
    @Input() public event: Event;
    @Input() public calendar: Calendar;
    @Input() public calendarSpec: CalendarSpec;
    @Input() public startDate: any;
    @Input() public endDate: any;
    @Input() public onAddEvent: (arg: Event, isEdit?: boolean) => void;
    @Input() public onRemoveEvent: (arg: Event, calendarTypeKey: string, callback: () => void) => void;

    public showLoader: boolean;
    public jsfAttributes: any;
    private eventSpec: any;

    constructor(private xmEntitySpecWrapperService: XmEntitySpecWrapperService,
                private activeModal: NgbActiveModal,
                private eventService: EventService,
                private calendarService: CalendarService,
                private translateService: TranslateService,
                public principal: Principal) {
    }

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

        setTimeout(() => {
            Object.assign(this.event, { startDate: this.startDate, endDate: this.endDate });
        });
    }

    onChangeSchemaForm(data: any) {
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
            this.processCalendarEvent(this.calendar, this.processEventBeforeSave(this.event));
        } else {
            this.calendarService.create(this.calendar).pipe(finalize(() => this.showLoader = false))
                .subscribe(
                    (calendarResp: HttpResponse<Calendar>) => {
                        const newCalendar = calendarResp.body;
                        this.processCalendarEvent(newCalendar, this.processEventBeforeSave(this.event));
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
            this.eventService[event.id ? 'update' : 'create'](event)
                .pipe(finalize(() => this.showLoader = false))
                .subscribe(
                    (eventResp: HttpResponse<Event>) => this.onSaveSuccess(calendarId, eventResp.body, !!event.id),
                    (err) => console.info(err),
                    () => this.showLoader = false);
        }
    }

    public onCancel(): void {
        this.activeModal.dismiss('cancel');
    }

    public onRemove(): void {
        this.onRemoveEvent(this.event, this.calendar.typeKey, () => this.onCancel());
    }

    private onSaveSuccess(calendarId: number, event: Event, isEdit?: boolean): void {
        this.activeModal.dismiss(true);
        this.alert('success', 'xm-entity.calendar-event-dialog.add.success');
        this.calendar.id = calendarId;
        this.onAddEvent(event, isEdit);
    }

    private alert(type: string, key: string): void {
        swal({
            type,
            text: this.translateService.instant(key),
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-primary',
        });
    }

    private processEventBeforeSave(event: Event): Event {
        return {
            ...event,
            startDate: moment(event.startDate).format(),
            endDate: moment(event.endDate).format(),
        };
    }
}
