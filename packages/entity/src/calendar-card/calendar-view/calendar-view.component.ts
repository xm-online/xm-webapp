import {
    Component,
    Input,
    OnChanges, OnDestroy,
    OnInit,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import {
    Calendar,
    CalendarService,
    CalendarSpec, EventService,
    XmEntity,
} from '@xm-ngx/core/entity';
import { EntityCalendarUiConfig } from '@xm-ngx/core/config';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { I18nNamePipe } from '@xm-ngx/translation';
import { LanguageService } from '@xm-ngx/translation';
import { TranslateService } from '@ngx-translate/core';
import { Principal } from '@xm-ngx/core/user';
// import {
//     CALENDAR_VIEW,
//     DEFAULT_CALENDAR_VIEW,
// } from 'src/app/xm.constants';
import { DEFAULT_CALENDAR_EVENT_FETCH_SIZE } from '../calendar-card.component';
import moment from 'moment-timezone';
import { Event } from '@xm-ngx/core/entity';
import { CalendarEventDialogComponent } from '../../calendar-event-dialog/calendar-event-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CalendarOptions } from '@fullcalendar/core';
import { CalendarChangeService } from '../../calendar-card/calendar-view/calendar-change.service';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import momentTimezonePlugin from '@fullcalendar/moment-timezone';
import interactionPlugin from '@fullcalendar/interaction';
import { XmAlertService } from '@xm-ngx/alert';
// import { XM_CALENDAR_VIEW } from '../../../../../src/app/xm.constants';

export const DEFAULT_DAY_MAX_EVENT_ROWS = 300;

export const XM_CALENDAR_VIEW = {
    MONTH: 'month',
    WEEK: 'week',
    DAY: 'day',
};

export const DEFAULT_CALENDAR_VIEW = 'month';
export const CALENDAR_VIEW = {
    [XM_CALENDAR_VIEW.MONTH]: DEFAULT_CALENDAR_VIEW,
    [XM_CALENDAR_VIEW.WEEK]: 'agendaWeek',
    [XM_CALENDAR_VIEW.DAY]: 'agendaDay',
};

@Component({
    selector: 'xm-calendar-view',
    templateUrl: './calendar-view.component.html',
    styleUrls: ['./calendar-view.component.scss'],
})
export class CalendarViewComponent implements OnChanges, OnInit, OnDestroy {
    public calendarOptions: CalendarOptions;

    @Input() public calendar: Calendar;
    @Input() public config: EntityCalendarUiConfig;
    @Input() public spec: CalendarSpec;
    @Input() public xmEntity: XmEntity;
    @ViewChild('calendar', {static: false}) public calendarComponent: FullCalendarComponent;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private translateService: TranslateService,
        private languageService: LanguageService,
        private calendarService: CalendarService,
        public principal: Principal,
        private i18nNamePipe: I18nNamePipe,
        private eventService: EventService,
        private modalService: MatDialog,
        private calendarChangeService: CalendarChangeService,
        private alertService: XmAlertService,
    ) {
    }

    public ngOnInit(): void {
        this.calendarChangeService.calendarChanged$
            .pipe(takeUntil(this.destroyed$))
            .subscribe(() => {
                this.initCalendar();
            });
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.calendar && changes.calendar.currentValue) {
            requestAnimationFrame(() => {
                this.initCalendar();
            });
        }
    }

    private initCalendar(): void {
        this.calendarOptions = {
            contentHeight: 700,
            headerToolbar: {
                left: 'title',
                center: 'month,agendaWeek,agendaDay,listDay,listWeek',
                right: 'prev,next,today',
            },
            plugins:[
                dayGridPlugin,
                listPlugin,
                timeGridPlugin,
                momentTimezonePlugin,
                interactionPlugin,
            ],
            buttonIcons: {
                prev: 'left-single-arrow',
                next: 'right-single-arrow',
            },
            initialView: this.config.view ? CALENDAR_VIEW[this.config.view] : DEFAULT_CALENDAR_VIEW,
            views: {
                month: {
                    type: 'dayGridMonth',
                    titleFormat: {year: 'numeric', month: 'long'},
                    buttonText: 'month',
                    eventTimeFormat: {hour: 'numeric', minute: '2-digit'},
                    displayEventEnd: true,
                },
                agendaWeek: {
                    type: 'timeGridWeek',
                    titleFormat: {year: 'numeric', month: 'long', day: 'numeric'},
                    buttonText: 'week',
                },
                agendaDay: {
                    type: 'timeGridDay',
                    titleFormat: {year: 'numeric', month: 'short', day: 'numeric'},
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
            events: ({start, end}, callback): void => {
                this.calendar.id && this.calendarService.getEvents(this.calendar.id, {
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
            select: ({start, end}): void => {
                this.onShowEventDialog(start, end, this.calendar, {} as Event);
            },
            eventClick: ({event}): void => {
                this.onShowEventDialog(event.start, event.end, this.calendar, event.extendedProps.originEvent);
            },
            locale: this.languageService.getUserLocale(),
            initialDate: new Date(),
            selectable: !(this.calendar.readonly),
            editable: false,
            dayMaxEventRows: DEFAULT_DAY_MAX_EVENT_ROWS,
            timeZone: this.getCalendarTimezone(),
        };
    }

    private getCalendarTimezone(): string {
        if (this.spec && this.spec.timeZoneStrategy && this.spec.timeZoneStrategy.toLowerCase() === 'subject') {
            this.xmEntity.data = this.xmEntity.data || {};
            return this.xmEntity.data[this.spec.timeZoneDataRef] || 'UTC';
        }
        return 'local';
    }

    private mapEvent(calendarSpec: CalendarSpec, event: Event | any): any {
        const eventSpec = calendarSpec.events.filter((e) => e.key === event.typeKey).shift();
        return {
            id: event.id,
            title: `${event.title}\n (${this.i18nNamePipe.transform(eventSpec.name, this.principal)})`,
            start: event.startDate,
            end: event.endDate,
            description: event.description,
            color: event.color || eventSpec.color,
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

    private onShowEventDialog(start: any, end: any, calendar: Calendar, event: Event): void {
        if (!this.calendar.readonly) {
            const calendarApi = this.calendarComponent.getApi();
            const modifiedEvent = this.formatEventDates(event, start, end);
            const modalRef = this.modalService.open(CalendarEventDialogComponent, {
                autoFocus: false,
            });
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
            };
        }
    }

    private onRemove(event: Event, callback?: () => void): void {
        const calendarApi = this.calendarComponent.getApi();
        this.alertService.open({
            title: this.translateService.instant('xm-entity.calendar-card.delete.title'),
            confirmButtonText: this.translateService.instant('xm-entity.calendar-card.delete.button'),
            cancelButtonText: this.translateService.instant('xm-entity.calendar-card.delete.button-cancel'),
        }).subscribe((result) => {
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

    // TODO: SweetAlert icon type XmAlertIcon
    private alert(icon: any, key: string): void {
        this.alertService.open({
            icon,
            text: this.translateService.instant(key),
        });
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
