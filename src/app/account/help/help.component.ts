import { Component, OnInit } from '@angular/core';
import { XmConfigService } from '../../shared';
import { JhiLanguageService } from 'ng-jhipster';
import { finalize, map } from 'rxjs/operators';
import { MatDialog } from "@angular/material/dialog";
import { HelpInfoDialogComponent } from "./help-info-dialog/help-info-dialog.component";

export interface IHelpNavLink {
    url: string;
    icon?: string;
    text?: string | any;
 }

export interface IHelpConfig {
    title?: string | any;
    content: string | any;
    navLink: IHelpNavLink;
}

@Component({
    selector: 'xm-help',
    templateUrl: './help.component.html',
    styleUrls: ['./help.component.scss'],
})
export class HelpComponent implements OnInit {

    public config: IHelpConfig | null;
    public lang: string;
    public showLoader: boolean = true;

    constructor(
        private xmConfigService: XmConfigService,
        private languageService: JhiLanguageService,
        private dialog: MatDialog,
    ) {
        this.languageService.getCurrent().then((lang) => {
            this.lang = lang;
        });
    }

    public ngOnInit(): void {
        this.xmConfigService
            .getUiConfig()
            .pipe(
                map((res) => res.helpConfig || {}),
                finalize(() => this.showLoader = false),
            ).subscribe((c) => {
                this.config = c || null;
            });
    }

    public openInfoDialog(): void {
        this.dialog.open(HelpInfoDialogComponent);
    }
}
