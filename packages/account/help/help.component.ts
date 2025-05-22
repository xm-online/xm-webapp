import { Component, OnInit } from '@angular/core';
import { IHelpNavLink } from '@xm-ngx/components/navbar';

import { XmConfigService } from '@xm-ngx/core/config';
import { JhiLanguageService } from '@xm-ngx/jhipster';
import { Translate } from '@xm-ngx/translation';
import { finalize, map } from 'rxjs/operators';

export interface IHelpConfig {
    title?: string | Translate;
    content: string | unknown;
    navLink: IHelpNavLink;
}

@Component({
    selector: 'xm-help',
    templateUrl: './help.component.html',
    styleUrls: ['./help.component.scss'],
    standalone: false,
})
export class HelpComponent implements OnInit {

    public config: IHelpConfig | null;
    public lang: string;
    public showLoader: boolean = true;

    constructor(
        private xmConfigService: XmConfigService,
        private languageService: JhiLanguageService,
    ) {
        this.languageService.getCurrent().then((lang) => {
            this.lang = lang;
        });
    }

    public ngOnInit(): void {
        this.xmConfigService
            .getUiConfig()
            .pipe(
                map((res) => res?.helpConfig || {}),
                finalize(() => this.showLoader = false),
            ).subscribe((c) => this.config = c || null);
    }

}
