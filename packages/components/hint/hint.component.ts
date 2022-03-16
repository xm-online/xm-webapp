import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { BehaviorSubject, Subject } from 'rxjs';
import { HintText } from './hint.interface';
import { HintService } from './hint.service';

@Component({
    selector: 'mat-hint[hint]',
    templateUrl: './hint.component.html',
    styleUrls: [ './hint.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HintComponent implements OnInit, OnDestroy {
    private readonly unsubscribe = new Subject<void>();

    private _hint = new BehaviorSubject<HintText | null>(null);

    @Input()
    public set hint(value: HintText | null) {
        this._hint.next(value);
    }
    public get hint(): HintText | null {
        return this._hint.getValue();
    }

    public isDisplay: boolean;

    constructor(
        private cdr: ChangeDetectorRef,
        private hintService: HintService,
    ) {
    }

    public ngOnInit(): void {
        this._hint.asObservable().pipe(
            filter((value) => coerceBooleanProperty(value)),
            switchMap(() => this.hintService.changes().pipe(map((state) => state))),
            takeUntil(this.unsubscribe),
        ).subscribe(state => {
            this.isDisplay = state;
            this.cdr.detectChanges();
        });
    }

    public ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
