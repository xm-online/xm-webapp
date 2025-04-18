import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { filter, map, Observable, tap } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { Role } from '@xm-ngx/core/role';
import { AsyncPipe } from '@angular/common';
import { CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { MatList, MatListItem } from '@angular/material/list';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';

import { DynamicScrollViewportHeight } from '../dynamic-scroll-viewport-height/dynamic-scroll-viewport-height';

@Component({
    selector: 'xm-roles-confirmation-step',
    standalone: true,
    imports: [
        AsyncPipe,
        CdkVirtualForOf,
        CdkVirtualScrollViewport,
        MatList,
        MatListItem,
        CdkFixedSizeVirtualScroll,
    ],
    templateUrl: './roles-confirmation-step.component.html',
    styleUrl: './roles-confirmation-step.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolesConfirmationStepComponent extends DynamicScrollViewportHeight implements OnInit, OnDestroy {
    @Input() public formGroup: FormGroup;

    @ViewChild('viewport') public cdkVirtualScrollViewport: CdkVirtualScrollViewport;

    public roles$: Observable<Role[]>;

    public cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

    public get selectedControl(): FormControl<Role[]> {
        return this.formGroup.get('selected') as FormControl<Role[]>;
    }

    public ngOnInit(): void {
        this.roles$ = this.selectedControl.valueChanges.pipe(
            startWith(this.selectedControl.value),
            filter(Boolean),
            map((roles: Role[]) => {
                return roles.filter(role => role?.roleKey);
            }),
            tap((roles: Role[]) => {
                this.changeViewportHeight(roles);
                this.cdr.detectChanges();
            }),
            takeUntilOnDestroy(this),
        );
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    public trackByFn(_: number, role: Role): string {
        return role.roleKey;
    }
}
