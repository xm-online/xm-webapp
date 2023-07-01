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
import { HintPopoverComponent } from './hint-popover.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'mat-hint[hint]',
    standalone: true,
    imports: [
        CommonModule,
        HintPopoverComponent,
    ],
    template: `
        <ng-container *ngIf="isDisplay">
            <xm-hint-popover [text]="hint?.title"></xm-hint-popover>
        </ng-container>
    `,
    styles: [`
        :host {
            display: flex;
            width: 100%;
        }

        :host + ::ng-deep .mat-form-field-hint-spacer {
            flex: auto;
        }

        .toggle-view {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
        }

        .toggle-view__text--truncate {
            overflow: hidden;
            min-width: 0;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    `],
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
