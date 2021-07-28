import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { XmSessionService } from '@xm-ngx/core';
import { takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { Observable } from 'rxjs';

@Component({
    selector: 'xm-navbar-arrow-back-widget',
    template: `
        <button (click)="onBack()"
                *ngIf="isSessionActive$ | async"
                class="bg-surface rounded-circle shadow-sm"
                mat-icon-button>
            <mat-icon>arrow_back</mat-icon>
        </button>
    `,
})
export class XmNavbarArrowBackWidget implements OnInit, OnDestroy {
    public isSessionActive$: Observable<boolean> = this.xmSessionService.isActive();

    private previousPath: string;
    private backStep: number = 0;

    constructor(
        private location: Location,
        private xmSessionService: XmSessionService,
    ) {
    }

    public ngOnInit(): void {
        this.registerPopState();
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    public onBack(): void {
        this.previousPath = this.location.path();
        this.location.back();
    }

    private registerPopState(): void {
        this.location.subscribe(() => {
            if (this.location.isCurrentPathEqualTo(this.previousPath)) {
                if (++this.backStep < 10) {
                    this.onBack();
                } else {
                    this.backStep = 0;
                }
            }
        });
    }
}

