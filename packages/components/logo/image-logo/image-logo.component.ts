import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ISession, XmSessionService } from '@xm-ngx/core';
import { Defaults, randomInt } from '@xm-ngx/operators';
import { Observable } from 'rxjs';
import { SPA_AUTH_ROOT_URL, SPA_ROOT_URL } from '../logo.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { XmTranslationModule } from '@xm-ngx/translation';
import {MenuService} from '@xm-ngx/components/menu/menu.service';
import {MenuCategory} from '@xm-ngx/components/menu/menu.interface';

interface ImageLogoConfig {
    title: string;
    imageUrls?: string[];
    rootUrl: string;
    userRootUrl: string;
}

const DEFAULT: ImageLogoConfig = {
    imageUrls: [],
    title: '',
    rootUrl: SPA_ROOT_URL,
    userRootUrl: SPA_AUTH_ROOT_URL,
};

@Component({
    selector: 'xm-image-logo',
    templateUrl: './image-logo.component.html',
    imports: [
        CommonModule,
        RouterModule,
        XmTranslationModule,
    ],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageLogoComponent implements OnInit {
    public session$: Observable<ISession>;
    public menuCategories$: Observable<MenuCategory[]>;

    @Input() @Defaults(DEFAULT) public config: ImageLogoConfig;
    public imgPath: string;

    constructor(
        private readonly sessionService: XmSessionService,
        private menuService: MenuService,
    ) {
    }

    public ngOnInit(): void {
        this.imgPath = this.getImageUrl(this.config.imageUrls);
        this.session$ = this.sessionService.get();
        this.menuCategories$ = this.menuService.menuCategories;
    }

    public getImageUrl(imageUrls: string[]): string {
        const length = imageUrls.length;
        const index = randomInt(0, length - 1);
        return imageUrls[index];
    }
}
