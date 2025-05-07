import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { Observable } from 'rxjs';
import { Role } from '@xm-ngx/core/role';
import { XmTranslatePipe } from '@xm-ngx/translation';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';

import { translates } from '../../constants';
import { AbstractSelectionList, SelectionFormGroup } from '../selection-list/abstract-selection-list';

@Component({
    selector: 'xm-roles-step',
    standalone: true,
    imports: [
        AsyncPipe,
        CdkFixedSizeVirtualScroll,
        CdkVirtualForOf,
        CdkVirtualScrollViewport,
        MatFormField,
        MatInput,
        MatLabel,
        MatListOption,
        MatSelectionList,
        ReactiveFormsModule,
        XmTranslatePipe,
    ],
    templateUrl: './roles-step.component.html',
    styleUrl: './roles-step.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolesStepComponent extends AbstractSelectionList<Role> implements OnInit, OnDestroy {
    @Input() public formGroup: SelectionFormGroup<Role>;
    @Input() public entities$: Observable<Role[]>;

    public readonly translates = translates;

    public filterFn = (searchTerm: string, roles: Role[]): Role[] => {
        return roles.filter(role => {
            return role.roleKey.toLowerCase().includes(searchTerm.trim().toLowerCase());
        });
    };

    public ngOnInit(): void {
        this.items$ = this.getEntities().pipe(
            takeUntilOnDestroy(this),
        );
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    public trackByFn = (_: number, role: Role): string => {
        return role.roleKey;
    };
}
