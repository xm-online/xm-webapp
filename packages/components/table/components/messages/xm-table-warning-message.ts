import { Component, inject, Input, OnInit } from '@angular/core';
import { XM_DYNAMIC_COMPONENT_CONFIG, XmDynamicModule } from '@xm-ngx/dynamic';
import { isObservable, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { DynamicInstance } from '@xm-ngx/ext/common-webapp-ext/module/stepper/to-core/dynamic-instance';
import { XmTranslatePipe } from '@xm-ngx/translation';
import {
    XmTableWarningMessageConfig
} from './xm-table-warning-message.model';

@Component({
    selector: 'xm-table-warning-message',
    standalone: true,
    template: `
        @if ((isShow$ | async) && !isClosed) {
            <div class="table-warning-message" [class.closing]="isClosing" (animationend)="onAnimationEnd($event)">
                <mat-icon class="warning-icon">warning</mat-icon>
                <span>{{config?.title | xmTranslate}}</span>
                <button class="close-icon" mat-icon-button (click)="close()">
                    <mat-icon>close</mat-icon>
                </button>
            </div>
        }
    `,
    styleUrls: ['./xm-table-warning-message.component.scss'],
    imports: [
        MatIconModule,
        XmDynamicModule,
        MatButtonModule,
        AsyncPipe,
        XmTranslatePipe,
    ],
})
export class XmTableWarningMessage extends DynamicInstance implements OnInit {
    @Input() public config = inject<XmTableWarningMessageConfig>(XM_DYNAMIC_COMPONENT_CONFIG);

    public isShow$: Observable<boolean | unknown>;
    public isClosing = false;
    public isClosed = false;

    public ngOnInit(): void {
        this.isShow$ = this.executeControllerMethod().pipe(
            tap((show) => {
                if (show) {
                    this.isClosing = false;
                    this.isClosed = false;
                }
            }),
        );
    }

    public executeControllerMethod(): Observable<boolean | unknown> {
        const controller = this.getControllerByKey(this.config.controller?.key);
        const method = controller?.[this.config.controller?.method];
        const executedMethod = method ? method.call(controller) : null;
        if (isObservable(executedMethod)) {
            return executedMethod;
        }
        return of(false);
    }

    public close(): void {
        this.isClosing = true;
    }

    public onAnimationEnd(event: AnimationEvent): void {
        if (event.target !== event.currentTarget) return;

        if (this.isClosing) {
            this.isClosed = true;
        }
    }
}
