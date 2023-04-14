import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class CalendarChangeService {

    private subject = new BehaviorSubject<void>(null);
    public calendarChanged$: Observable<void> = this.subject.asObservable();


    public changeCalendar(): void {
        this.subject.next();
    }
}
