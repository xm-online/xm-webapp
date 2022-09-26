import {
    Component,
    Input,
    OnChanges,
    SimpleChanges,
} from '@angular/core';
import {
    Calendar,
    CalendarSpec,
    XmEntity,
    XmEntityService,
} from '@xm-ngx/entity';
import { EntityCalendarUiConfig, EntityUiConfig } from '../../shared/spec';
import { DEBUG_INFO_ENABLED } from '../../xm.constants';
import { HttpResponse } from '@angular/common/http';
import { UUID } from 'angular2-uuid';
import { I18nNamePipe } from '@xm-ngx/components/language';
import { Principal, XmConfigService } from '../../shared';
import { switchMap, tap } from 'rxjs/operators';
import { CalendarChangeService } from '@xm-ngx/entity/calendar-card/calendar-view/calendar-change.service';

export const DEFAULT_CALENDAR_EVENT_FETCH_SIZE = 2500;

@Component({
    selector: 'xm-calendar-card',
    templateUrl: './calendar-card.component.html',
    styleUrls: ['./calendar-card.component.scss'],
})
export class CalendarCardComponent implements OnChanges {

    @Input() public xmEntityId: number;
    @Input() public calendarSpecs: CalendarSpec[];

    public xmEntity: XmEntity;
    public currentCalendar: Calendar;
    public calendars: Calendar[] = [];
    public calendarConfig: EntityCalendarUiConfig[] = [];

    constructor(private xmEntityService: XmEntityService,
                private xmConfigService: XmConfigService,
                private i18nNamePipe: I18nNamePipe,
                public principal: Principal,
                private calendarChangeService: CalendarChangeService,
    ) {
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.xmEntityId && changes.xmEntityId.previousValue !== changes.xmEntityId.currentValue) {
            this.load();
        }
    }


    public onCalendarChange(): void {
        this.calendarChangeService.changeCalendar();
    }

    private load(): void {
        if (!this.calendarSpecs || !this.calendarSpecs.length) {
            if (DEBUG_INFO_ENABLED) {
                console.info('DBG: no spec no call');
            }
            return;
        }

        this.xmEntityService.find(this.xmEntityId, {embed: 'calendars'})
            .pipe(
                switchMap((xmEntity: HttpResponse<XmEntity>) => {
                    this.xmEntity = xmEntity.body;
                    return this.xmConfigService.getUiConfig();
                }),
                tap((res) => {
                    const entity: EntityUiConfig = (res?.applications?.config?.entities || [])
                        .find((el => el?.typeKey === this.xmEntity.typeKey)) || {};
                    this.calendarConfig = (entity?.calendars && entity?.calendars?.items) || [];
                }),
            )
            .subscribe(() => {
                if (this.xmEntity.calendars) {
                    this.calendars = [
                        ...this.xmEntity.calendars.map((c: Calendar) => ({
                            ...c,
                            uuid: UUID.UUID(),
                            readonly: this.getReadonly(c, this.calendarSpecs),
                        })),
                    ];
                }

                this.calendars = this.calendars.filter((c) =>
                    this.calendarSpecs.findIndex((cs) => c.typeKey === cs.key) >= 0);

                const notIncludedSpecs = this.calendarSpecs
                    .filter((cs) => this.calendars.findIndex((c) => c.typeKey === cs.key) < 0);

                notIncludedSpecs.forEach((calendarSpec) => {
                    const calendar: Calendar = {};
                    calendar.name = this.i18nNamePipe.transform(calendarSpec.name, this.principal);
                    calendar.typeKey = calendarSpec.key;
                    calendar.readonly = calendarSpec.readonly;
                    calendar.startDate = new Date().toISOString();
                    calendar.uuid = UUID.UUID();
                    calendar.xmEntity = {};
                    calendar.xmEntity.id = this.xmEntity.id;
                    calendar.xmEntity.typeKey = this.xmEntity.typeKey;
                    calendar.events = [];
                    this.calendars.push(calendar);
                });
                this.currentCalendar = this.calendars[0];
            });
    }

    public getCalendarConfig(calendar: Calendar): EntityCalendarUiConfig {
        return this.calendarConfig
            .find((el) => el.typeKey === calendar.typeKey) || {} as EntityCalendarUiConfig;
    }

    public getCalendarSpec(calendar: Calendar): CalendarSpec {
        return this.calendarSpecs.filter(spec => spec.key === calendar.typeKey).shift();
    }

    private getReadonly(calendar: Calendar, specs: CalendarSpec[]): boolean {
        const matched = specs.filter((cs: CalendarSpec) => cs.key === calendar.typeKey);
        return matched && matched.length > 0 && matched.shift().readonly;
    }
}
