import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    NgZone,
    OnDestroy,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import { merge, Subject } from 'rxjs';
import { PortalModule, TemplatePortal } from '@angular/cdk/portal';
import { Overlay, OverlayModule, OverlayRef, ViewportRuler } from '@angular/cdk/overlay';
import { filter, map, startWith, takeUntil } from 'rxjs/operators';
import { ESCAPE } from '@angular/cdk/keycodes';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'xm-hint-popover',
    standalone: true,
    imports: [
        CommonModule,
        XmTranslationModule,
        MatButtonModule,
        MatIconModule,
        OverlayModule,
        PortalModule,
    ],
    template: `
        <ng-template #popover>
            <div class="hint-popover">
                {{text | translate}}
            </div>
        </ng-template>

        <div #hint class="hint-text">
            {{text | translate}}
        </div>

        <button class="hint-toggle"
                mat-icon-button
                *ngIf="isTextOverflow && !panelOpen"
                [title]="title | translate"
                (click)="show()">
            <mat-icon class="hint-toggle__icon">visibility</mat-icon>
        </button>
    `,
    styles: [`
        :host {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
        }

        .hint-popover {
            display: block;
            background: #fff;
            border: 1px solid #ccc;
            border-radius: 4px;
            padding: 4px 8px;
            width: 100%;
        }
        
        .hint-text {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 100%;
            width: 100%;
        }
        
        .hint-toggle {
            width: 18px;
            height: 18px;
            font-size: 18px;
            padding: 5px;
            box-sizing: content-box;
        }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HintPopoverComponent implements AfterViewInit, OnDestroy {
    private unsubscribe = new Subject<void>();

    public title = {
        'en': 'Open',
        'ru': 'Открыть',
        'uk': 'Відкрити',
        'de': 'Offen',
        'it': 'Aprire',
    };

    private _attachTo: ElementRef<unknown>;

    @Input() public text: Translate;

    @Input()
    public set attachTo(attachTo: ElementRef) {
        this._attachTo = attachTo;
    }

    public get attachTo(): ElementRef {
        return this._attachTo ?? this.hint;
    }

    public get hintElement(): HTMLElement {
        return this.ngZone.runOutsideAngular(() => this.hint.nativeElement);
    }

    public get hostElement(): HTMLElement {
        return this.ngZone.runOutsideAngular(() => this.elementRef.nativeElement);
    }

    public panelOpen = false;
    public isTextOverflow = false;

    @ViewChild('popover', { read: TemplateRef, static: true }) public content: TemplateRef<unknown>;
    @ViewChild('hint', { read: ElementRef, static: true }) public hint: ElementRef<HTMLElement>;

    private portal: TemplatePortal<unknown>;
    private overlayRef: OverlayRef;

    constructor(
        private overlay: Overlay,
        private vcr: ViewContainerRef,
        private ngZone: NgZone,
        private cdr: ChangeDetectorRef,
        private elementRef: ElementRef,
        private viewportRuler: ViewportRuler,
    ) {
    }

    public ngAfterViewInit(): void {
        this.viewportRuler.change(300).pipe(
            startWith(false),
            map(() => this.overflowText()),
            takeUntil(this.unsubscribe),
        ).subscribe((isTextOverflow) => {
            this.isTextOverflow = isTextOverflow;
            this.cdr.detectChanges();
        });
    }

    public ngOnDestroy(): void {
        this.close();

        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    private createOverlay(): OverlayRef {
        if (this.overlayRef) {
            return this.overlayRef;
        }

        const strategy = this.overlay.position()
            .flexibleConnectedTo(this.attachTo)
            .withFlexibleDimensions(false)
            .withPositions([
                {
                    originX: 'start',
                    originY: 'top',
                    overlayX: 'start',
                    overlayY: 'top',
                },
            ])
            .withLockedPosition(true);

        this.overlayRef = this.overlay.create({
            width: this.hostElement.clientWidth,
            backdropClass: '',
            panelClass: '',
            hasBackdrop: false,
            disposeOnNavigation: true,
            scrollStrategy: this.overlay.scrollStrategies.reposition({}),
            positionStrategy: strategy,
        });

        this.viewportRuler.change(300).pipe(
            takeUntil(this.overlayRef.detachments()),
        ).subscribe(() => {
            this.overlayRef?.updateSize({
                width: this.hintElement.clientWidth,
            });
        });

        merge(
            this.overlayRef.backdropClick(),
            this.overlayRef.outsidePointerEvents(),
            this.overlayRef.keydownEvents().pipe(
                filter(event => event.keyCode === ESCAPE),
            ),
        ).pipe(takeUntil(this.unsubscribe)).subscribe(() => {
            this.close();
        });


        return this.overlayRef;
    }

    private overflowText(): boolean {
        const { offsetWidth, scrollWidth } = this.hintElement;

        return scrollWidth > offsetWidth;
    }

    public close(): void {
        if (this.overlayRef && this.overlayRef.hasAttached()) {
            this.ngZone.run(() => {
                this.overlayRef.detach();
            });
        }

        this.panelOpen = false;
        this.overlayRef = null;
        this.portal = null;

        this.cdr.markForCheck();
    }

    public show(): void {
        const overlayRef = this.createOverlay();

        this.portal = new TemplatePortal(this.content, this.vcr);

        if (overlayRef && !overlayRef.hasAttached()) {
            this.ngZone.run(() => {
                overlayRef.attach(this.portal);
                overlayRef.updatePosition();
            });
        }

        this.panelOpen = true;

        this.cdr.markForCheck();
    }

    public toggle(): void {
        this.panelOpen ? this.close() : this.show();
    }
}
