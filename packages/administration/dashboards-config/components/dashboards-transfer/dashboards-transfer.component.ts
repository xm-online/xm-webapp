import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    inject,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { MatStep, MatStepper, MatStepperNext, MatStepperPrevious } from '@angular/material/stepper';
import { MatButton } from '@angular/material/button';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Defaults, takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { delay, Observable, take, tap } from 'rxjs';
import { XmToasterService } from '@xm-ngx/toaster';
import { DashboardWithWidgets } from '@xm-ngx/core/dashboard';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { LoaderModule } from '@xm-ngx/components/loader';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgTemplateOutlet } from '@angular/common';
import { XmTranslatePipe } from '@xm-ngx/translation';
import { Role } from '@xm-ngx/core/role';

import { DashboardsTransferDataService } from './services/dashboards-transfer-data.service';
import { DashboardsTransferApiService } from './services/dashboards-transfer-api.service';
import { oneItemInArrayRequired, urlValidator } from './validators/';
import { translates } from './constants/translates';
import { DashboardsTransferConfig } from './types';
import { initialDashboardTransferConfig } from './constants';
import { EnvironmentStepComponent } from './components/environment-step/environment-step.component';
import { DashboardsStepComponent } from './components/dashboards-step/dashboards-step.component';
import {
    DashboardConfirmationStepComponent,
} from './components/dashboard-confirmation-step/dashboard-confirmation-step.component';
import { RolesStepComponent } from './components/roles-step/roles-step.component';
import { CongratulationsStepComponent } from './components/congratulations-step/congratulations-step.component';
import { ActionTypeStepComponent } from './components/action-type-step/action-type-step.component';
import {
    RolesConfirmationStepComponent,
} from './components/roles-confirmation-step/roles-confirmation-step.component';
import { DashboardsStateService } from './services/dashboards-state.service';
import { RolesStateService } from './services/roles-state.service';
import { ACTION_TYPES } from './constants/action-type.enum';
import { ProcessActionStrategyFactoryService } from './services/process-action-strategy-factory.service';
import { DashboardsTransferStrategyService } from './services/dashboards-transfer-strategy.service';
import { ProcessActionStrategy } from './types/process-action-strategy.interface';
import { TargetDashboardsService } from './services/target-dashboards.service';
import { UpdateRolesStrategyService } from './services/update-roles-strategy.service';

@Component({
    selector: 'xm-dashboards-transfer',
    standalone: true,
    imports: [
        MatStepper,
        MatStep,
        MatButton,
        MatStepperPrevious,
        EnvironmentStepComponent,
        DashboardsStepComponent,
        MatStepperNext,
        DashboardConfirmationStepComponent,
        LoaderModule,
        MatProgressSpinner,
        NgTemplateOutlet,
        RolesStepComponent,
        CongratulationsStepComponent,
        XmTranslatePipe,
        ActionTypeStepComponent,
        RolesConfirmationStepComponent,

    ],
    templateUrl: './dashboards-transfer.component.html',
    styleUrl: './dashboards-transfer.component.scss',
    providers: [DashboardsTransferApiService, DashboardsTransferDataService, RolesStateService, DashboardsStateService, ProcessActionStrategyFactoryService, DashboardsTransferStrategyService, UpdateRolesStrategyService, TargetDashboardsService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardsTransferComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() @Defaults(initialDashboardTransferConfig) public config: DashboardsTransferConfig;

    @ViewChild('stepperRef') public stepperRef: MatStepper;

    public rootGroup: FormGroup;
    public loading: boolean = false;
    public actionDone: boolean = false;

    public readonly translates = translates;

    protected readonly window = window;

    private readonly fb: FormBuilder = inject(FormBuilder);
    private readonly notify: XmToasterService = inject(XmToasterService);
    private readonly transferDataService = inject(DashboardsTransferDataService);
    private readonly dashboardsStateService = inject(DashboardsStateService);
    private readonly rolesStateService = inject(RolesStateService);
    private readonly processActionStrategyFactory = inject(ProcessActionStrategyFactoryService);

    public roles$: Observable<Role[]> = this.rolesStateService.getRoles();
    public dashboards$: Observable<DashboardWithWidgets[]> = this.dashboardsStateService.getDashboards();

    public ngOnInit(): void {
        this.buildFormGroups();
        this.listenLoadingChange();
        this.listenResetStepperChange();
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    public ngAfterViewInit(): void {
        this.listenStepperChange();
    }

    public buildFormGroups(): void {
        this.rootGroup = this.fb.group({
            actionTypeGroup: this.fb.group({
                selectedAction: [null, [Validators.required]],
            }),
            envGroup: this.fb.group({
                envUrl: ['', [Validators.required, urlValidator()]],
                token: ['', Validators.required],
            }),
            dashboardsGroup: this.fb.group({
                selected: [[], oneItemInArrayRequired()],
            }),
            rolesGroup: this.fb.group({
                selected: [[], oneItemInArrayRequired()],
            }),
        });
    }

    public processEnvStep(): void {
        if (this.envGroup.invalid) {
            this.envGroup.markAllAsTouched();
            return;
        }

        const STEP_NAME = 'environment';
        this.processAction(STEP_NAME).subscribe();
    }

    public processDashboardsStep(): void {
        if (this.dashboardsGroup.invalid) {
            this.dashboardsGroup.markAllAsTouched();
            this.notify.create({ type: 'danger', msg: this.translates.errors.atLeastOneDashboardRequired }).subscribe();
            return;
        }

        const STEP_NAME = 'dashboardsSelection';
        this.processAction(STEP_NAME).subscribe();
    }

    public processDashboardsConfirmationStep(): void {
        const STEP_NAME = 'dashboardsConfirmation';

        this.processAction(STEP_NAME).pipe(
            tap(() => {
                this.actionDone = true;
            }),
            delay(500),
            tap(() => {
                this.stepperRef.next();
            }),
        ).subscribe();
    }

    public processRolesStep(): void {
        if (this.rolesGroup.invalid) {
            this.rolesGroup.markAllAsTouched();
            this.notify.create({ type: 'danger', msg: this.translates.errors.atLeastOneRoleRequired }).subscribe();
            return;
        }

        const STEP_NAME = 'rolesSelection';
        this.processAction(STEP_NAME).subscribe();
    }

    public processRolesConfirmationStep(): void {
        const STEP_NAME = 'rolesConfirmation';

        this.processAction(STEP_NAME).pipe(
            tap(() => {
                this.actionDone = true;
            }),
            delay(500),
            tap(() => {
                this.stepperRef.next();
            }),
        ).subscribe();
    }

    private processAction(stepName: string): Observable<unknown> {
        const processActionStrategy: ProcessActionStrategy = this.processActionStrategyFactory.getStrategy(this.action);
        const processActionFn = processActionStrategy.getHandler(stepName);

        return processActionFn(this.stepperRef, this.rootGroup).pipe(
            take(1)
        );
    }

    private resetStepInteraction(event: StepperSelectionEvent): void {
        const { selectedIndex, previouslySelectedIndex } = event || {};
        if (selectedIndex < previouslySelectedIndex) {
            this.stepperRef.steps.forEach((step: MatStep, index: number) => index > selectedIndex && (step.interacted = false));
        }
    }

    private listenStepperChange(): void {
        this.stepperRef.selectionChange.pipe(
            tap((event: StepperSelectionEvent) => {
                this.resetStepInteraction(event);
            }),
            takeUntilOnDestroy(this),
        ).subscribe();
    }

    private listenLoadingChange(): void {
        this.transferDataService.loading$.pipe(
            tap(loading => this.loading = loading),
            tap(loading => {
                const formGroups = Object.values(this.rootGroup.controls) as FormGroup[];

                if (loading) {
                    formGroups.forEach((group: FormGroup) => group.disable({ emitEvent: false }));
                } else {
                    formGroups.forEach((group: FormGroup) => group.enable({ emitEvent: false }));
                }
            }),
            takeUntilOnDestroy(this),
        ).subscribe();
    }

    private listenResetStepperChange(): void {
        this.transferDataService.resetStepper$.pipe(
            tap(() => {
                this.rolesStateService.resetErrors();
                this.stepperRef.reset();

            }),
            takeUntilOnDestroy(this),
        ).subscribe();
    }

    public get actionTypeGroup(): FormGroup {
        return this.rootGroup.get('actionTypeGroup') as FormGroup;
    }

    public get action(): ACTION_TYPES {
        return this.actionTypeGroup.get('selectedAction').value as ACTION_TYPES;
    }

    public get envGroup(): FormGroup {
        return this.rootGroup.get('envGroup') as FormGroup;
    }

    public get dashboardsGroup(): FormGroup {
        return this.rootGroup.get('dashboardsGroup') as FormGroup;
    }

    public get rolesGroup(): FormGroup {
        return this.rootGroup.get('rolesGroup') as FormGroup;
    }
}
