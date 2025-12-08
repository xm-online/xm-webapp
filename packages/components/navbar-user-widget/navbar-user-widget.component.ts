import { Component, ElementRef, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { SidebarUserSubtitle, UserWidgetBase } from '@xm-ngx/components/sidebar-user';
import { UserNavBar } from './navbar-user-widget.model';
import { CommonModule } from '@angular/common';
import { XmPermissionModule } from '@xm-ngx/core/permission';
import { XmTranslationModule } from '@xm-ngx/translation';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { XmUserService } from '@xm-ngx/core/user';
import { ContextService } from '@xm-ngx/core/context';
import { DashboardStore } from '@xm-ngx/core/dashboard';

@Component({
    selector: 'xm-navbar-user-widget',
    templateUrl: './navbar-user-widget.component.html',
    styleUrls: ['./navbar-user-widget.component.scss'],
    host: {'class': 'navbar-user-widget'},
    imports: [
        CommonModule,
        XmPermissionModule,
        MatMenuModule,
        MatIconModule,
        RouterModule,
        XmTranslationModule,
        MatDividerModule,
        SidebarUserSubtitle,
        MatButtonModule,
    ],
    standalone: true,
    encapsulation: ViewEncapsulation.None,
})
export class NavbarUserWidgetComponent extends UserWidgetBase {
    public selectedFile: File = null;
    @Input() public declare config: UserNavBar;

    constructor(dashboardService: DashboardStore, userService: XmUserService, contextService: ContextService, router: Router) {
        super(dashboardService, userService, contextService, router);

    }

    public ngOnInit(): void {
        super.ngOnInit();
    }

    @ViewChild('fileInput') public fileInput: ElementRef;


    public onFileSelected(event: any): void {
        this.selectedFile = <File>event.target.files[0];
        this.onUpload();
        this.showPreview(this.selectedFile);

    }

    private onUpload(): void {
        if (this.selectedFile) {
            const formData = new FormData();
            formData.append('image', this.selectedFile, this.selectedFile.name);
            this.fileInput.nativeElement.value = '';
        }
    }

    private showPreview(file: File): void {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            this.user.avatarUrl = reader.result + '';
        };
    }

    public getUserMail(): string {
        return this.user.user?.logins.find((login) => login.typeKey === 'LOGIN.NICKNAME')?.login;
    }
}

