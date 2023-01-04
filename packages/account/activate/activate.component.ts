import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import { Activate } from './activate.service';

@Component({
    selector: 'xm-activate',
    templateUrl: './activate.component.html',
})
export class ActivateComponent implements OnInit {
    public error: string;
    public success: string;
    public modalRef: MatDialogRef<any>;

    constructor(private activate: Activate,
                private route: ActivatedRoute,
                private router: Router) {
    }

    public ngOnInit(): void {
        this.route.queryParams.subscribe((params) => {
            this.activate.get(params.key).subscribe(() => {
                this.error = null;
                this.success = 'OK';
            }, () => {
                this.success = null;
                this.error = 'ERROR';
            });
        });
    }

    public login(): void {
        this.router.navigate(['']);
    }

    public register(): void {
        this.router.navigate([''], {queryParams: {type: 'registration'}});
    }

}
