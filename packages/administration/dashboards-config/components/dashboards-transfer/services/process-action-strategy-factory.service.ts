import { inject, Injectable } from '@angular/core';
import { ProcessActionStrategy } from '../types/process-action-strategy.interface';
import { DashboardsTransferStrategyService } from './dashboards-transfer-strategy.service';
import { UpdateRolesStrategyService } from './update-roles-strategy.service';

@Injectable()
export class ProcessActionStrategyFactoryService {
    private transferDashboardsStrategy = inject(DashboardsTransferStrategyService);
    private updateRolesStrategy = inject(UpdateRolesStrategyService);

    public strategies: ProcessActionStrategy[] = [this.transferDashboardsStrategy, this.updateRolesStrategy];

    public getStrategy(actionType: string): ProcessActionStrategy {
        return this.strategies.find(s => s.actionType === actionType);
    }
}
