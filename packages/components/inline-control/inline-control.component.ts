import { OverlayModule, Overlay, OverlayRef, ViewportRuler } from '@angular/cdk/overlay';
import { PortalModule, TemplatePortal } from '@angular/cdk/portal';
import { EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, forwardRef, inject, Input, NgZone, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { XmDynamicModule } from '@xm-ngx/dynamic';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { BehaviorSubject, filter, fromEvent, map, Observable, shareReplay, switchMap, take, takeUntil, withLatestFrom } from 'rxjs';
import { NgModelWrapper } from '../ng-accessor';
import { MatTooltipModule } from '@angular/material/tooltip';
import { XmTranslationModule } from '@xm-ngx/translation';
import _ from 'lodash';

export interface XmInlineControlDynamic<C> {
    selector: string;
    config: C;
}

export interface XmInlineControlDynamicView<C, V> extends XmInlineControlDynamic<C> {
    value: V;
}

export interface XmInlineControlConfig {
    view: XmInlineControlDynamicView<unknown, unknown>;
    edit: XmInlineControlDynamic<unknown>;
}

export type XmInlineControlValue = unknown;

export enum XmInlineControlMode {
    view,
    edit
}

@Component({
    standalone: true,
    selector: 'xm-inline-control',
    template: `
        <ng-container [ngSwitch]="isEditMode | async">
            <ng-container *ngSwitchCase="true">
                <ng-template
                    xmDynamicControl
                    [selector]="config?.edit?.selector"
                    [config]="config?.edit?.config"
                    [options]="config?.edit?.config"
                    [value]="value"
                    [disabled]="disabled"
                    (valueChange)="changeValue($event)"></ng-template>
            </ng-container>

            <ng-container *ngSwitchDefault>
                <ng-template
                    xmDynamicPresentation
                    [selector]="config?.view.selector" 
                    [config]="config?.view?.config"
                    [options]="config?.view?.config"
                    [value]="value ?? config?.view?.value"></ng-template>
            </ng-container>
        </ng-container>

        <ng-template #buttons>
            <div class="shadow p-1 bg-white rounded">
                <button mat-icon-button color="primary" [matTooltip]="'xm-entity.common.save' | translate" (click)="save()">
                    <mat-icon>check</mat-icon>
                </button>
                <div class="vr"></div>
                <button mat-icon-button (click)="close()" [matTooltip]="'xm-entity.common.close' | translate">
                    <mat-icon>cancel</mat-icon>
                </button>
            </div>
        </ng-template>
    `,
    providers: [
        { 
            provide: NG_VALUE_ACCESSOR, 
            useExisting: forwardRef(() => XmInlineControlComponent), 
            multi: true,
        },
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        XmTranslationModule,
        XmDynamicModule,
        OverlayModule,
        PortalModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
    ],
    changeDetection: ChangeDetectionStrategy.Default,
})
export class XmInlineControlComponent extends NgModelWrapper<unknown> implements OnInit, OnDestroy {
    @Input() public config: XmInlineControlConfig;
    @Output() public saveValue = new EventEmitter<unknown>();

    @ViewChild('buttons') public buttons: TemplateRef<unknown>;

    private overlay = inject(Overlay);
    private ngZone = inject(NgZone);
    private viewportRuler = inject(ViewportRuler);
    private viewRef = inject(ViewContainerRef);
    private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
    private overlayRef: OverlayRef;

    public get hostElement(): HTMLElement | null {
        return this.ngZone.runOutsideAngular(() => this.elementRef.nativeElement);
    } 

    public get selectOverlayElement(): HTMLElement | null {
        return this.ngZone.runOutsideAngular(() => document.getElementsByClassName('mat-select-panel')?.[0] as HTMLElement | null);
    }

    public newValue: unknown;

    private _mode = new BehaviorSubject<XmInlineControlMode>(XmInlineControlMode.view);

    public set mode(mode: XmInlineControlMode) {
        this._mode.next(mode);
    }
    public get mode(): XmInlineControlMode {
        return this._mode.value;
    }

    public get modeChanges(): Observable<XmInlineControlMode> {
        return this._mode.asObservable().pipe(shareReplay());
    }

    public get isEditMode(): Observable<boolean> {
        return this.modeChanges.pipe(
            map((mode) => mode == XmInlineControlMode.edit),
            shareReplay(),
        );
    }

    public ngOnInit(): void {
        fromEvent(this.elementRef.nativeElement, 'dblclick')
            .pipe(
                filter(() => !this.disabled),
                withLatestFrom(this.isEditMode),
                filter(([__, isEditMode]) => !isEditMode),
                takeUntilOnDestroy(this),
            )
            .subscribe(() => {
                this.open();
            });

        this.isEditMode
            .pipe(
                switchMap((isEditMode: boolean) => fromEvent(document, 'click').pipe(
                    filter(() => isEditMode),
                    filter((evt) => {
                        const outsideClicked = (
                            this.hostElement.contains(evt.target as Node) === false
                            && this.overlayRef.overlayElement.contains(evt.target as Node) === false
                        );
                        
                        return outsideClicked;
                    }),
                    take(1),
                )),
                takeUntilOnDestroy(this),
            )
            .subscribe(() => {
                this.close();
            });
    }

    public ngOnDestroy(): void {
        this.overlayRef = null;

        takeUntilOnDestroyDestroy(this);
    }

    public createOverlay(): OverlayRef {
        if (this.overlayRef) {
            return this.overlayRef;
        }

        const strategy = this.overlay.position()
            .flexibleConnectedTo(this.elementRef)
            .withFlexibleDimensions(true)
            .withGrowAfterOpen(true)
            .withPositions([
                {
                    offsetY: 0,
                    originX: 'start',
                    originY: 'bottom',
                    overlayX: 'start',
                    overlayY: 'top',
                },

            ])
            .withLockedPosition(true);

        this.overlayRef = this.overlay.create({
            scrollStrategy: this.overlay.scrollStrategies.reposition(),
            disposeOnNavigation: true,
            positionStrategy: strategy,
        });

        this.viewportRuler.change(300).pipe(
            takeUntil(this.overlayRef.detachments()),
        ).subscribe(() => {
            this.overlayRef?.updatePosition();
        });

        return this.overlayRef;
    }

    public save(): void {
        this.change(this.newValue);
        this.saveValue.emit(this.newValue);

        setTimeout(() => this.close());
    }

    public close(): void {
        this.mode = XmInlineControlMode.view;

        this.ngZone.run(() => {
            this.overlayRef?.detach();
        });
    }

    public open(): void {
        this.mode = XmInlineControlMode.edit;

        const overlayRef = this.createOverlay();
        const portal = new TemplatePortal(this.buttons, this.viewRef);

        if (overlayRef && !overlayRef.hasAttached()) {
            this.ngZone.run(() => {
                overlayRef.attach(portal);
                overlayRef.updatePosition();
            });
        }
    }

    public changeValue(value: unknown): void {
        this.newValue = value;
    }
}