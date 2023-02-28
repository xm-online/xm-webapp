import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Pocket } from '../shared/pocket.model';

import { PocketService } from '../shared/pocket.service';

@Component({
    selector: 'xm-balance-detail-dialog',
    templateUrl: './balance-detail-dialog.component.html',
})
export class BalanceDetailDialogComponent implements OnInit {

    @Input() public balanceId: number;

    public pockets: Pocket[];

    constructor(private activeModal: MatDialogRef<BalanceDetailDialogComponent>,
                private pocketService: PocketService) {
    }

    public ngOnInit(): void {
        this.pocketService.query({'balanceId.in': this.balanceId}).subscribe((pockets: HttpResponse<Pocket[]>) => {
            this.pockets = pockets.body;
        });
    }

    public onCancel(): void {
        this.activeModal.close(false);
    }

}
