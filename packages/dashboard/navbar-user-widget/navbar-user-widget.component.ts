import { Component, ElementRef, ViewChild } from '@angular/core';
import {
    SidebarUserComponent,
    SidebarUserSubtitle,
    SidebarUserSubtitleOptions,
    UserWidgetBase
} from '@xm-ngx/dashboard/sidebar-user';
import { CommonModule } from '@angular/common';
import { XmPermissionModule } from '@xm-ngx/core/permission';
import { MenuComponent, MenuItem } from '@xm-ngx/dashboard/menu';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { ITranslate, XmTranslationModule } from '@xm-ngx/translation';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { DashboardStore } from '@xm-ngx/core/dashboard';
import { XmUser, XmUserService } from '@xm-ngx/core/user';
import { ContextService } from '@xm-ngx/core/context';
import { Observable } from 'rxjs';

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
})
export class NavbarUserWidgetComponent extends UserWidgetBase {
    public selectedFile: File = null;
    public config: {
        user: UserOptions;
        config: {
            subtitles: SidebarUserSubtitleOptions[];
        };
        menu$: Observable<MenuItem[]>;
        subtitles: SidebarUserSubtitleOptions[],
        links: LinkItem[]
        changeAccount?: ChangeAccount,
        changePhoto?: boolean,
        settings?: SettingsBtn,
    };

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

interface LinkItem {
    url: string,
    title: ITranslate
}

interface UserOptions {
    roleKey: string;
    username: string;
    avatarUrl: string;
    user: XmUser;
}

interface ChangeAccount {
    url: string;
    title: ITranslate;
    icon?: string;
}

interface SettingsBtn {
    url: string;
    title: ITranslate;
}
