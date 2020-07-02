import { Location } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { XmSessionService } from '@xm-ngx/core';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';

@Component({
    selector: 'xm-navbar-arrow-back',
    template: `
        <button (click)="onBack()"
                *ngIf="isSessionActive"
                class="bg-white rounded-circle shadow-sm"
                mat-icon-button>
            <mat-icon>arrow_back</mat-icon>
        </button>
    `,
    encapsulation: ViewEncapsulation.None,
})

export class XmNavbarArrowBackComponent implements OnInit {
    public isSessionActive: boolean;
    private previousPath: string;
    private backStep: number = 0;

    constructor(
        private location: Location,
        private xmSessionService: XmSessionService,
    ) {
    }

    public ngOnInit(): void {
        this.xmSessionService.isActive()
            .pipe(takeUntilOnDestroy(this))
            .subscribe((isActive) => this.isSessionActive = isActive);
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
