import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ISession, XmSessionService } from '@xm-ngx/core';
import { Defaults, randomInt } from '@xm-ngx/operators';
import { Observable } from 'rxjs';
import { SPA_AUTH_ROOT_URL, SPA_ROOT_URL } from '../logo.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { XmTranslationModule } from '@xm-ngx/translation';

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
    styles:[`
        a {
            position: relative;
        }
        a:after {
            position: absolute;
            content: '';
            background-color: #DADADA;
            width: 100%;
            height: 64px;
        }
    `],
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

    @Input() @Defaults(DEFAULT) public config: ImageLogoConfig;
    public imgPath: string;

    constructor(private readonly sessionService: XmSessionService) {
    }

    public ngOnInit(): void {
        this.imgPath = this.getImageUrl(this.config.imageUrls);
        this.session$ = this.sessionService.get();
    }

    public getImageUrl(imageUrls: string[]): string {
        const length = imageUrls.length;
        const index = randomInt(0, length - 1);
        return imageUrls[index];
    }
}
