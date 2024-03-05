import {
    AfterViewInit,
    Directive,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    Renderer2
} from '@angular/core';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import {
    ChangebleDirectiveService,
} from './changeble-directive.service';
import { MatDialog } from '@angular/material/dialog';
import { ChangeableModalComponent } from '@xm-ngx/dashboard/src/changeable/changeable-modal/changeable-modal.component';
import { DashboardCollection, WidgetCollection } from '@xm-ngx/administration/dashboards-config';
import { XmEventManager } from '@xm-ngx/core';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, map, takeUntil } from 'rxjs/operators';


@Directive({
    selector: '[xmChangeable]',
    standalone: true,
    providers: [WidgetCollection, DashboardCollection],
})
export class ChangeableDirective implements OnInit, OnDestroy, AfterViewInit {
    public EDIT_EVENT: string = 'EDIT_WIDGET_EVENT';
    public isEditing = false;
    private startX: number = 0;
    private startWidth: number = 0;
    @Input() public config: any;
    @Input() public dashboard: any;
    @Output() public sizeChange: EventEmitter<number> = new EventEmitter<number>();
    private parentElement: HTMLElement;
    private subscription: Subscription;
    private sizeClass: string = '';
    private buttonContainer: HTMLElement;

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private changebleDirectiveService: ChangebleDirectiveService,
        protected readonly widgetService: WidgetCollection,
        public dialog: MatDialog,
        protected readonly dashboardCollection: DashboardCollection,
        protected readonly eventManager: XmEventManager,
    ) {
    }

    public ngAfterViewInit(): void {
        this.changeEditState();
    }

    public ngOnInit(): void {
        this.initButtons();
        this.parentElement = this.el.nativeElement.parentElement;
    }


    private initButtons(): void {
        this.buttonContainer = this.renderer.createElement('div');
        this.renderer.addClass(this.buttonContainer, 'ui-constructor-container');
        this.createButton('edit', 'ui-constructor-edit','click', this.openDialog.bind(this));
        this.createButton('save', 'ui-constructor-save','click', this.updateDashboard.bind(this));
        this.createButton('transform', 'ui-constructor-resize','mousedown', this.startResize.bind(this));
        this.renderer.appendChild(this.el.nativeElement, this.buttonContainer);
    }

    private createButton(iconName: string, additionalClass: string,event: string, clickCallback: (event: MouseEvent) => void): void {
        const button = this.renderer.createElement('button');
        const icon = this.renderer.createElement('mat-icon');
        this.renderer.addClass(button, 'btn');
        this.renderer.addClass(button, 'btn-primary');
        this.renderer.addClass(button, additionalClass);

        this.renderer.addClass(icon, 'material-icons');
        this.renderer.setAttribute(button, 'mat-icon-button', '');
        this.renderer.appendChild(icon, this.renderer.createText(iconName));
        this.renderer.appendChild(button, icon);
        this.renderer.listen(button, event, (event: MouseEvent) => {
            event.stopPropagation();
            event.preventDefault();
            clickCallback(event);
        });
        this.renderer.appendChild(this.buttonContainer, button);
    }

    public changeEditState(): void {
        this.changeUiEditState(this.changebleDirectiveService.getEditStorageState());
        this.changebleDirectiveService.getValue()
            .pipe(takeUntilOnDestroy(this))
            .subscribe((isEdit) => {
                this.isEditing = isEdit;
                this.changeUiEditState(isEdit);
            });
    }

    private changeUiEditState(isEdit: boolean): void {
        if (isEdit) {
            this.renderer.addClass(this.el.nativeElement, 'edit-ui-configurator');
            this.renderer.removeClass(this.buttonContainer, 'hidden');
        } else {
            this.renderer.removeClass(this.el.nativeElement, 'edit-ui-configurator');
            this.renderer.addClass(this.buttonContainer, 'hidden');
        }
    }



    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }


    private startResize(event: MouseEvent): void {
        event.preventDefault();
        this.startX = event.clientX;
        this.startWidth = this.parentElement.offsetWidth;
        const mouseMove$ = fromEvent<MouseEvent>(document, 'mousemove').pipe(
            map(event => this.calculateGridSize(event.clientX)),
        );
        const mouseUp$ = fromEvent(document, 'mouseup');
        this.subscription = mouseMove$.pipe(
            takeUntil(mouseUp$),
            debounceTime(0),
        ).subscribe(gridSize => this.updateGridClasses(gridSize));
        mouseUp$.subscribe(() => {
            if (this.subscription) {
                this.subscription.unsubscribe();
            }
        });
    }

    private calculateGridSize(clientX: number): number {
        const newWidth = this.startWidth + (clientX - this.startX);
        return Math.round((newWidth / this.parentElement.parentElement.offsetWidth) * 12);
    }

    private updateGridClasses(gridSize: number): void {
        const gridClass = `col-${Math.max(1, Math.min(gridSize, 12))}`;
        this.sizeClass = gridClass;
        this.updateGridClass(gridClass);
    }

    public updateGridClass(newClass: string): void {
        for (let i = 1; i <= 12; i++) {
            this.renderer.removeClass(this.el.nativeElement, `col-${i}`);
            if (this.extractColNumber(this.el.nativeElement.parentElement.parentElement) < i) {
                this.renderer.addClass(this.el.nativeElement.parentElement.parentElement, `col-${i}`);
            }
        }
        this.renderer.addClass(this.el.nativeElement, newClass);
        this.sizeClass = newClass;
    }

    public updateClass(): void {
        const colClassRegex = /\bcol-\d+\b/;
        if (colClassRegex.test(this.config.class)) {
            if (!this.config.class.includes(this.sizeClass)) {
                this.config.class = this.config.class.replace(colClassRegex, this.sizeClass);
            }
        } else {
            this.config.class = this.config.class ? `${this.config.class} ${this.sizeClass}` : this.sizeClass;
        }
    }

    private extractColNumber(element): number {
        const colClassRegex = /col-(\d+)/;
        for (const className of element.classList) {
            const match = colClassRegex.exec(className);
            if (match) {
                return parseInt(match[1], 10);
            }
        }
        return null;
    }

    public openDialog(): void {
        const dialogRef = this.dialog.open(ChangeableModalComponent, {
            width: '350px',
            data: this.config,
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.updateWidget(this.transformObject(result.widget));
            }
        });
    }

    public transformObject(originalObject: any): any {
        const transformedObject = {
            config: {layout: originalObject.config.layout},
            dashboard: {id: originalObject.dashboard},
            id: originalObject.id,
            name: originalObject.name,
            selector: originalObject.selector
        };
        return transformedObject;
    }


    public updateWidget(widget: any): void {
        this.widgetService.update(widget).pipe().subscribe((res) => {
            this.eventManager.broadcast({name: this.EDIT_EVENT, id: res.id, edit: true});
        });
    }

    public updateDashboard(): void {
        const result= this.changebleDirectiveService.getUpdatedDashboardWithWidget(this.dashboard, this.config);
        this.dashboardCollection.update(result).pipe().subscribe((res) => {
            this.eventManager.broadcast({name: this.EDIT_EVENT, id: res.id, edit: true});
        });
    }

}
