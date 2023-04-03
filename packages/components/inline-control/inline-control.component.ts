import { OverlayModule, Overlay, OverlayRef, ViewportRuler, ConnectedPosition } from '@angular/cdk/overlay';
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
import { MatCardModule } from '@angular/material/card';

export interface XmInlineControlDynamic<C> {
    selector: string;
    config: C;
    style: string;
    class: string;
}

export interface XmInlineControlDynamicView<C, V> extends XmInlineControlDynamic<C> {
    value: V;
}

export interface XmInlineControlEditConfig {
    position?: Partial<ConnectedPosition>;
}

export interface XmInlineControlConfig {
    view: XmInlineControlDynamicView<unknown, unknown>;
    edit: XmInlineControlDynamic<XmInlineControlEditConfig>;
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
        <ng-container *ngIf="isEditMode | async"></ng-container>

        <span [matTooltip]="'global.common.dbclick-to-edit' | translate">
            <ng-template
                xmDynamicPresentation
                [style]="config?.view?.style"
                [class]="config?.view?.class"
                [selector]="config?.view.selector" 
                [config]="config?.view?.config"
                [options]="config?.view?.config"
                [value]="value ?? config?.view?.value"></ng-template>
        </span>

        <ng-template #buttons>
            <mat-card>
                <mat-card-content>
                    <ng-template
                        xmDynamicControl
                        [style]="config?.edit?.style"
                        [class]="config?.edit?.class"
                        [selector]="config?.edit?.selector"
                        [config]="config?.edit?.config"
                        [options]="config?.edit?.config"
                        [value]="value"
                        [disabled]="disabled"
                        (valueChange)="changeValue($event)"></ng-template>
                </mat-card-content>

                <mat-card-actions align="end" class="shadow p-1 bg-white rounded">
                    <button mat-button (click)="close()">
                        <mat-icon>cancel</mat-icon> {{ 'xm-entity.common.close' | translate }}
                    </button>

                    <div class="vr m-2"></div>
                    
                    <button mat-button color="primary" (click)="save()">
                        <mat-icon>check</mat-icon> {{ 'xm-entity.common.save' | translate }}
                    </button>
                </mat-card-actions>
            </mat-card>
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
        MatCardModule,
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

    public get buttonsElement(): HTMLElement | null {
        return this.ngZone.runOutsideAngular(() => this.buttons.elementRef.nativeElement);
    } 

    public get listboxElement(): HTMLElement | null {
        return this.ngZone.runOutsideAngular(() => document.querySelector('[role="listbox"]'));
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
        return this._mode.asObservable().pipe(shareReplay(1));
    }

    public get isEditMode(): Observable<boolean> {
        return this.modeChanges.pipe(
            map((mode) => mode == XmInlineControlMode.edit),
            shareReplay(1),
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
                        const node = evt.target as Node;

                        const outsideClicked = (
                            !this.hostElement.contains(node) && !this.overlayRef.overlayElement.contains(node)
                        );

                        if (this.listboxElement) {
                            return outsideClicked && !this.listboxElement.contains(node);
                        }
                        
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
                _.defaults((this.config?.edit?.config?.position ?? {}), {
                    offsetY: 0,
                    offsetX: 10,
                    originX: 'end',
                    originY: 'center',
                    overlayX: 'start',
                    overlayY: 'center',
                }),
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