import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { SidebarUserComponent, SidebarUserSubtitle, UserWidgetBase } from '@xm-ngx/dashboard/sidebar-user';
import { CommonModule } from '@angular/common';
import { XmPermissionModule } from '@xm-ngx/core/permission';
import { MenuComponent } from '@xm-ngx/dashboard/menu';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { XmTranslationModule } from '@xm-ngx/translation';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { DashboardStore } from '@xm-ngx/core/dashboard';
import { XmUserService } from '@xm-ngx/core/user';
import { ContextService } from '@xm-ngx/core/context';
import { UserNavBar } from '@xm-ngx/dashboard/navbar-user-widget/navbar-user-widget.model';

@Component({
    selector: 'xm-navbar-user-widget',
    templateUrl: './navbar-user-widget.component.html',
    styleUrls: ['./navbar-user-widget.component.scss'],
    imports: [
        CommonModule,
        XmPermissionModule,
        SidebarUserComponent,
        MenuComponent,
        MatMenuModule,
        MatIconModule,
        RouterModule,
        XmTranslationModule,
        MatDividerModule,
        SidebarUserSubtitle,
        MatButtonModule,
        SidebarUserSubtitle,
    ],
    standalone: true,
    encapsulation: ViewEncapsulation.None,
})
export class NavbarUserWidgetComponent extends UserWidgetBase {
    public selectedFile: File = null;
    public config: UserNavBar;

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
        return this.user.user?.logins.filter((login) => {
            return login.typeKey === 'LOGIN.NICKNAME';
        })[0].login;
    }
}

