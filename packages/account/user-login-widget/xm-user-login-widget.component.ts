import { Component, Input, OnInit } from '@angular/core';
import { XmUser, XmUserService } from '@xm-ngx/core/user';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { XmDynamicWidget } from '@xm-ngx/dynamic';
import { CommonModule } from '@angular/common';
import { XmTranslationModule } from '@xm-ngx/translation';
import { MatCardModule } from '@angular/material/card';
import { XmPermissionModule } from '@xm-ngx/core/permission';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { UserLoginFormComponent } from '../user-login-widget/login/user-login-form.component';

@Component({
    selector: 'xm-user-login-widget',
    templateUrl: './xm-user-login-widget.component.html',
    standalone: true,
    imports: [CommonModule, UserLoginFormComponent, XmTranslationModule, MatCardModule, XmPermissionModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule],
})
export class XmUserLoginWidgetComponent implements OnInit, XmDynamicWidget {

    @Input() public config: unknown;

    public user$: Observable<XmUser>;

    constructor(
        private userService: XmUserService,
    ) {
    }

    public ngOnInit(): void {
        this.user$ = this.userService.user$().pipe(map((user) => _.cloneDeep(user)));
    }
}
