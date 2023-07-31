import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { XmTableSelectionService, } from '../../controllers/selections/xm-table-selection.service';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { NgForOf, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { XmDynamicModule, XmDynamicPresentationLayout } from '@xm-ngx/dynamic';
import { tap } from 'rxjs/operators';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';

@Component({
    selector: 'xm-table-selection-header',
    template: `
        <div *ngIf="isVisible"
             @fadeInOut
             class="header-container">

            <span>{{this.selectionModel?.selected?.length}} items selected</span>

            <ng-container *ngIf="config">
                <ng-container xmDynamicPresentation
                              *ngFor="let el of config"
                              [class]="el.class"
                              [style]="el.style"
                              [selector]="el.selector"
                              [value]="selectionModel?.selected"
                              [options]="el.config">
                </ng-container>
            </ng-container>

        </div>
    `,
    standalone: true,
    styleUrls: ['./xm-table-selection-header.component.scss'],
    animations: [
        trigger('fadeInOut', [
            transition(':enter', [style({ opacity: 0 }), animate('250ms')]),
            transition(':leave', [animate('150ms')]),
        ]),
    ],
    imports: [
        MatButtonModule,
        MatMenuModule,
        NgForOf,
        NgIf,
        MatIconModule,
        XmDynamicModule,
    ],
})
export class XmTableSelectionHeaderComponent implements OnInit, OnDestroy {
    public isVisible: boolean;
    public selectionModel;

    constructor(private selectionService: XmTableSelectionService<unknown>) {
        this.selectionModel = this.selectionService.selection;
    }

    private _config: XmDynamicPresentationLayout[] = [];

    public get config(): XmDynamicPresentationLayout[] {
        return this._config;
    }

    @Input()
    public set config(value: XmDynamicPresentationLayout[]) {
        this._config = value || [];
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    public ngOnInit(): void {
        this.selectionService.selection.changed.pipe(
            tap((select) => {
                this.isVisible = !select.source.isEmpty();
            }),
            takeUntilOnDestroy(this),
        ).subscribe();
    }
}
