import { Component, inject, Injector, Input, OnInit } from '@angular/core';
import { XM_DYNAMIC_COMPONENT_CONFIG, XmDynamicInstanceService, XmDynamicModule } from '@xm-ngx/dynamic';
import { isObservable, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { XmTranslatePipe } from '@xm-ngx/translation';
import { get } from 'lodash';
import {
    XmTableWarningMessageConfig,
    XmTableWarningMessageControllerResult,
    XmTableWarningMessageParams,
    XmTableWarningMessageState,
} from './xm-table-warning-message.model';

const PLACEHOLDER_PATTERN = /{{\s*([\w.]+)\s*}}/g;

@Component({
    selector: 'xm-table-warning-message',
    standalone: true,
    template: `
        @let state = state$ | async;
        @if (state?.show && !isClosed) {
            <div class="table-warning-message" [class.closing]="isClosing" (animationend)="onAnimationEnd($event)">
                <mat-icon class="warning-icon">warning</mat-icon>
                <span>{{interpolate((state.title || config?.title) | xmTranslate, state.params)}}</span>
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
export class XmTableWarningMessage implements OnInit {
    @Input() public config = inject<XmTableWarningMessageConfig>(XM_DYNAMIC_COMPONENT_CONFIG);

    public state$: Observable<XmTableWarningMessageState>;
    public isClosing = false;
    public isClosed = false;

    private xmDynamicInstanceService: XmDynamicInstanceService = inject(XmDynamicInstanceService);
    private injector: Injector = inject(Injector);
    private get controller(): any {
        return this.xmDynamicInstanceService.getControllerByKey(
            this.config.controller?.key,
            this.injector
        );
    }

    public ngOnInit(): void {
        this.state$ = this.executeControllerMethod().pipe(
            map((result) => this.toState(result)),
            tap(({ show }) => {
                if (show) {
                    this.isClosing = false;
                    this.isClosed = false;
                }
            }),
        );
    }

    public executeControllerMethod(): Observable<XmTableWarningMessageControllerResult> {
        const controller = this.controller;
        const method = controller?.[this.config.controller?.method];
        const executedMethod = method ? method.call(controller) : null;
        if (isObservable(executedMethod)) {
            return executedMethod as Observable<XmTableWarningMessageControllerResult>;
        }
        return of(false);
    }

    /** Replaces `{{key}}` placeholders with params; unresolved placeholders are kept as is. */
    public interpolate(text: string, params?: XmTableWarningMessageParams): string {
        if (typeof text !== 'string' || !params) {
            return text;
        }

        return text.replace(PLACEHOLDER_PATTERN, (placeholder: string, key: string) => {
            const value: unknown = get(params, key);
            return value === null || value === undefined ? placeholder : String(value);
        });
    }

    private toState(result: XmTableWarningMessageControllerResult): XmTableWarningMessageState {
        const state: XmTableWarningMessageState = typeof result === 'object' && result !== null
            ? result
            : { show: !!result };

        return {
            ...state,
            params: { ...this.config?.params, ...state.params },
        };
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
