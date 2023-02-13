import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { XmTableAction } from '../../interfaces/xm-table.model';
import { XmTableSelectionService, } from '../../controllers/selections/xm-table-selection.service';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { NgForOf, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { XmDynamicModule } from '@xm-ngx/dynamic';
import { tap } from 'rxjs/operators';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';

@Component({
    selector: 'xm-table-selection-header',
    template: `
        <div *ngIf="isVisible"
             @fadeInOut
             class="header-wrapper">

            <span>{{this.selectionModel?.selected?.length}} items selected</span>

            <ng-container *ngIf="inlineComponents">
                <ng-container xmDynamicPresentation
                              *ngFor="let el of inlineComponents"
                              [class]="el.class"
                              [style]="el.style"
                              [selector]="el.component"
                              [value]="selectionModel?.selected"
                              [options]="el.options">
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
    public inlineComponents: XmTableAction[];
    public groupComponents: XmTableAction[];
    public isVisible: boolean;
    public selectionModel;

    constructor(private selectionService: XmTableSelectionService<unknown>) {
        this.selectionModel = this.selectionService.selection;
    }

    private _config: XmTableAction[];

    public get config(): XmTableAction[] {
        return this._config;
    }

    @Input()
    public set config(value: XmTableAction[]) {
        this._config = value;
        this.inlineComponents = this._config?.filter(node => node.inline);
        this.groupComponents = this._config?.filter(node => !node.inline);
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
