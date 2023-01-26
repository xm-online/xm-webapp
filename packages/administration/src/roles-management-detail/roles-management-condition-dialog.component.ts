import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { Permission } from '@xm-ngx/core/role';

@Component({
    selector: 'xm-role-mgmt-condition-dialog',
    templateUrl: './roles-management-condition-dialog.component.html',
})
export class RoleConditionDialogComponent implements OnInit {

    public condition: string;
    public variables: string[];
    public transInfo: string;
    public permission: Permission;
    public isAddMode: boolean;

    constructor(
        public activeModal: MatDialogRef<RoleConditionDialogComponent>,
    ) {
    }

    public ngOnInit(): void {
        this.isAddMode = !this.condition;
    }

    public onCancel(): void {
        this.activeModal.close(false);
    }

    public onSave(): void {
        this.activeModal.close(this.condition);
    }

}
