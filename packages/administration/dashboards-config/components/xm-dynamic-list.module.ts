import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, OnInit, Type } from '@angular/core';
import { UntypedFormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { XmTextControl } from '@xm-ngx/components/text';
import { XmAceEditorControl } from '@xm-ngx/components/ace-editor';
import { XmDynamicModule } from '@xm-ngx/dynamic';
import { combineLatest, Observable } from 'rxjs';
import { map, shareReplay, startWith } from 'rxjs/operators';
import { ExtendedDynamicComponents, WidgetListService } from './widget-edit/widget-list.service';

@Component({
    selector: 'xm-dynamic-list-widget',
    template: `
        <xm-text-control [formControl]="filterControl"
                         [config]="{title: 'Filter by the selector'}"></xm-text-control>

        <section class="row">

            <div class="col-3">
                <cdk-virtual-scroll-viewport itemSize="50" style="height: 60vh">
                    <div *cdkVirtualFor="let widget of filteredWidgets$ | async">
                        <button mat-button
                                (click)="activeWidget = widget"
                                [color]="activeWidget === widget ? 'primary' : ''">
                            {{widget.globalSelector}}
                        </button>
                    </div>
                </cdk-virtual-scroll-viewport>
            </div>

            <div *ngIf="activeWidget"
                 class="col-4">
                <h4>{{activeWidget.globalSelector}}</h4>
                <ng-container xmDynamicPresentation
                              [selector]="activeWidget.globalSelector"
                              [value]="valueControl.value"
                              [options]="optionsControl.value">
                </ng-container>
            </div>

            <div *ngIf="activeWidget" class="col-5">
                <xm-ace-editor-control [formControl]="valueControl"
                                       [config]="{title: 'Value'}"></xm-ace-editor-control>
                <xm-ace-editor-control [formControl]="optionsControl"
                                       [config]="{title: 'Options'}"></xm-ace-editor-control>
            </div>

        </section>
    `,
    providers: [WidgetListService],
})

export class XmDynamicListComponent implements OnInit {

    public filterControl: UntypedFormControl = new UntypedFormControl();
    public valueControl: UntypedFormControl = new UntypedFormControl();
    public optionsControl: UntypedFormControl = new UntypedFormControl();
    public activeWidget: ExtendedDynamicComponents = null;
    public filteredWidgets$: Observable<ExtendedDynamicComponents[]>;

    @Input() public config: { modules: string[] };

    constructor(private widgetListService: WidgetListService) {
    }

    public ngOnInit(): void {
        this.widgetListService.load();

        const widgets$ = this.widgetListService.widgets$.pipe(shareReplay(1));

        widgets$.subscribe((widgets) => {
            this.activeWidget = widgets[0];
        });

        this.filteredWidgets$ = combineLatest([
            widgets$,
            this.filterControl.valueChanges.pipe(startWith('')),
        ]).pipe(
            map(([ws, f]) => {
                return ws.filter((w) => w.globalSelector.includes(f));
            }),
        );
    }
}

@NgModule({
    declarations: [XmDynamicListComponent],
    imports: [
        CommonModule,
        XmTextControl,
        ReactiveFormsModule,
        XmDynamicModule,
        MatButtonModule,
        ScrollingModule,
        XmAceEditorControl,
    ],
})
export class XmDynamicListModule {
    public entry: Type<XmDynamicListComponent> = XmDynamicListComponent;
}
