import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { Calendar as ICalendar } from '../../shared/calendar.model';
import { PluginDef } from '@fullcalendar/core/plugin-system';

import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import momentTimezonePlugin from '@fullcalendar/moment-timezone';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../modules/xm-translation/language.service';
import { IFullCalendarOptions } from './calendar-view.model';
import { EntityCalendarUiConfig } from '../../../shared/spec/xm-ui-config-model';
import { CALENDAR_VIEW, DEFAULT_CALENDAR_VIEW } from '../../../xm.constants';
import { CalendarSpec } from '../../shared/calendar-spec.model';
import { DEFAULT_CALENDAR_EVENT_FETCH_SIZE } from '../calendar-card.component';
import { CalendarService } from '../../shared/calendar.service';
import { Event } from '../../shared/event.model';
import { I18nNamePipe, Principal } from '../../../shared';
import { CalendarEventDialogComponent } from '../../calendar-event-dialog/calendar-event-dialog.component';
import { EventService } from '../../shared/event.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { XmEntity } from '../../shared/xm-entity.model';
import * as moment from 'moment-timezone';
import swal, { SweetAlertType } from 'sweetalert2';

@Component({
    selector: 'xm-calendar-view',
    templateUrl: './calendar-view.component.html',
    styleUrls: ['./calendar-view.component.scss'],
})
export class CalendarViewComponent implements OnChanges {

    public calendarPlugins: PluginDef[] = [
        dayGridPlugin,
        listPlugin,
        timeGridPlugin,
        momentTimezonePlugin,
        interactionPlugin,
    ];
    public calendarOptions: IFullCalendarOptions;

    @Input() public calendar: ICalendar;
    @Input() public config: EntityCalendarUiConfig;
    @Input() public spec: CalendarSpec;
    @Input() public xmEntity: XmEntity;
    @ViewChild('calendar', { static: false }) calendarComponent: FullCalendarComponent;

    constructor(
        private translateService: TranslateService,
        private languageService: LanguageService,
        private calendarService: CalendarService,
        public principal: Principal,
        private i18nNamePipe: I18nNamePipe,
        private eventService: EventService,
        private modalService: NgbModal,
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.calendar.currentValue) {
            this.initCalendar();
        }
    }

    private initCalendar(): void {
        this.calendarOptions = {
            header: {
                left: 'title',
                center: 'month,agendaWeek,agendaDay,listDay,listWeek',
                right: 'prev,next,today',
            },
            buttonIcons: {
                prev: 'left-single-arrow',
                next: 'right-single-arrow',
            },
            defaultView: this.config.view ? CALENDAR_VIEW[this.config.view] : DEFAULT_CALENDAR_VIEW,
            views: {
                month: {
                    type: 'dayGridMonth',
                    titleFormat: { year: 'numeric', month: 'long' },
                    buttonText: 'month',
                    eventTimeFormat: { hour: 'numeric', minute: '2-digit' },
                    displayEventEnd: true,
                },
                agendaWeek: {
                    type: 'timeGridWeek',
                    titleFormat: { year: 'numeric', month: 'long', day: 'numeric' },
                    buttonText: 'week',
                },
                agendaDay: {
                    type: 'timeGridDay',
                    titleFormat: { year: 'numeric', month: 'short', day: 'numeric' },
                    buttonText: 'day',
                },
                listDay: {
                    type: 'listDay',
                    buttonText: this.translateService.instant('xm-entity.calendar-card.calendar.btn-list-day'),
                },
                listWeek: {
                    type: 'listWeek',
                    buttonText: this.translateService.instant('xm-entity.calendar-card.calendar.btn-list-week'),
                },
            },
            events: ({ start, end }, callback): void => {
                this.calendarService.getEvents(this.calendar.id, {
                    'endDate.greaterThanOrEqual':
                        `${moment(start).subtract(1, 'd').format('YYYY-MM-DD')}T${moment(start).format('HH:mm:ss')}Z`,
                    'startDate.lessThanOrEqual':
                        `${moment(end).add(1, 'd').format('YYYY-MM-DD')}T${moment(end).format('HH:mm:ss')}Z`,
                    size: this.config.queryPageSize ? this.config.queryPageSize : DEFAULT_CALENDAR_EVENT_FETCH_SIZE,
                })
                    .subscribe(
                        res => callback((res || []).map((e) => this.mapEvent(this.spec, e))),
                        () => callback([]),
                    );
            },
            select: ({ start, end }): void => {
                this.onShowEventDialog(start, end, this.calendar, {} as Event);
            },
            eventClick: ({ event }): void => {
                this.onShowEventDialog(event.start, event.end, this.calendar, event.extendedProps.originEvent);
            },
            locale: this.languageService.getUserLocale(),
            defaultDate: new Date(),
            selectable: true,
            editable: false,
            eventLimit: true,
            timezone: this.getCalendarTimezone(),
        };
    }

    private getCalendarTimezone(): string {
        if (this.spec.timeZoneStrategy && this.spec.timeZoneStrategy.toLowerCase() === 'subject') {
            this.xmEntity.data = this.xmEntity.data || {};
            return this.xmEntity.data[this.spec.timeZoneDataRef] || 'UTC';
        } else {
            return 'local';
        }
    }

    private mapEvent(calendarSpec: CalendarSpec, event: Event): any {
        const eventSpec = calendarSpec.events.filter((e) => e.key === event.typeKey).shift();
        return {
            id: event.id,
            title: `${event.title}\n (${this.i18nNamePipe.transform(eventSpec.name, this.principal)})`,
            start: event.startDate,
            end: event.endDate,
            description: event.description,
            color: eventSpec.color,
            originEvent: event,
        };
    }

    private formatEventDates(event: Event, startDate: Date, endDate: Date): Event {
        const format = 'YYYY-MM-DDTHH:mm:ss';
        const timezone = this.getCalendarTimezone();
        event.startDate = moment(startDate).tz(timezone).format(format);
        event.endDate = moment(endDate).tz(timezone).format(format);
        return event;
    }

    private onShowEventDialog(start: any, end: any, calendar: ICalendar, event: Event): void {
        const calendarApi = this.calendarComponent.getApi();
        const modifiedEvent = this.formatEventDates(event, start, end);
        const modalRef = this.modalService.open(CalendarEventDialogComponent, { backdrop: 'static' });
        modalRef.componentInstance.xmEntity = this.xmEntity;
        modalRef.componentInstance.timezone = this.getCalendarTimezone();
        modalRef.componentInstance.event = modifiedEvent;
        modalRef.componentInstance.calendar = calendar;
        modalRef.componentInstance.calendarSpec = this.spec;
        modalRef.componentInstance.onAddEvent = (): void => {
            calendarApi.refetchEvents();
        };
        modalRef.componentInstance.onRemoveEvent = (event: Event, callback?: () => void): void => {
            this.onRemove(event, callback);
        }
    }

    private onRemove(event: Event, callback?: () => void): void {
        const calendarApi = this.calendarComponent.getApi();

        swal({
            title: this.translateService.instant('xm-entity.calendar-card.delete.title'),
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonClass: 'btn mat-raised-button btn-primary',
            cancelButtonClass: 'btn mat-raised-button',
            confirmButtonText: this.translateService.instant('xm-entity.calendar-card.delete.button'),
            cancelButtonText: this.translateService.instant('xm-entity.calendar-card.delete.button-cancel'),
        }).then((result) => {
            if (!result.value) {
                return;
            }

            this.eventService.delete(event.id).subscribe(
                () => {
                    if (typeof callback === 'function') {
                        callback();
                    }

                    this.alert('success', 'xm-entity.calendar-card.delete.remove-success');
                    calendarApi.refetchEvents();
                },
                () => this.alert('error', 'xm-entity.calendar-card.delete.remove-error'),
            );
        });
    }

    private alert(type: SweetAlertType, key: string): void {
        swal({
            type,
            text: this.translateService.instant(key),
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-primary',
        });
    }
}
