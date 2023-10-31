import { Meta, moduleMetadata, applicationConfig } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { Component, Input, importProvidersFrom } from '@angular/core';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { XmCoreModule } from '@xm-ngx/core';
import { XmLoggerModule } from '@xm-ngx/logger';
import { XmCoreConfigModule } from '@xm-ngx/core/config';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { XmTranslationModule } from '@xm-ngx/translation';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { XmAuthenticationService } from '@xm-ngx/core/auth';
import { XmCarouselConfig } from './carousel.interface';
import { XmCarouselComponent } from './carousel.component';
import { XmCarouselContentDirective, XmCarouselNextButtonDirective, XmCarouselPrevButtonDirective, XmCarouselSwitchButtonDirective } from './carousel.directive';

function StaticLoaderFactory() {
    return of(require('src/i18n/en.json'));
}

@Component({
    standalone: true,
    selector: 'demo-carousel',
    imports: [
        NgIf,
        NgFor,
        MatIconModule,
        MatButtonModule,
        XmCarouselComponent,
        XmCarouselContentDirective,
        XmCarouselNextButtonDirective,
        XmCarouselPrevButtonDirective,
        XmCarouselSwitchButtonDirective,
    ],
    template: `
        <div>
            <xm-carousel [config]="config">
                <div before>
                    <div #s="switchButton" xmCarouselSwitchButton>Switch more or less {{s.switched}}</div>

                    <button mat-icon-button xmCarouselPrevButton>
                        <mat-icon>navigate_before</mat-icon>
                    </button>
                </div>

                <ng-container ngProjectAs="[track]">
                    <div xmCarouselContent *ngFor="let item of items">
                        {{item}}
                    </div>
                </ng-container>

                <div after>
                    <button mat-icon-button xmCarouselNextButton>
                        <mat-icon>navigate_next</mat-icon>
                    </button>
                </div>
            </xm-carousel>
        </div>
    `,
})
class DemoCarouselComponent {
    @Input() public config: XmCarouselConfig;
    public items = [1,2,3,4,5];
}

type DemoCarouselArgs = { config: XmCarouselConfig, selected?: object };

export default {
    title: 'Core/Presentation/Carousel/Simple',
    component: DemoCarouselComponent,
    decorators: [
        applicationConfig({
            providers: [
                XmAuthenticationService,
                importProvidersFrom(NgxWebstorageModule.forRoot()),
                importProvidersFrom(XmCoreModule.forRoot()),
                importProvidersFrom(XmLoggerModule.forRoot()),
                importProvidersFrom(XmCoreConfigModule),
                importProvidersFrom(HttpClientModule),
                importProvidersFrom(BrowserAnimationsModule),
                importProvidersFrom(TranslateModule.forRoot({
                    isolate: false,
                    loader: {
                        deps: [HttpClient],
                        provide: TranslateLoader,
                        useFactory: StaticLoaderFactory,
                    },
                })),
            ],
        }),
        moduleMetadata({
            imports: [
                CommonModule,
                BrowserAnimationsModule,
                TranslateModule.forRoot(),
                XmTranslationModule.forRoot(),
                ControlErrorModule.forRoot({errorTranslates: XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES}),
            ],
        }),
    ],
    argTypes: {
        change: { action: 'change' },
    },
} as Meta;

const simpleCarouselTemplate = (args: DemoCarouselArgs) => ({
    props: {
        ...args,
    },
});

export const SimpleCarousel = simpleCarouselTemplate.bind({});

SimpleCarousel.args = {
    config: {
        duration: 500,
        gap: 16,
        swipeThreshold: 100,
        breakpoints: [
            { max: 576, slidesCount: 1 },  
            { max: 768, slidesCount: 2 },
            { max: 992, slidesCount: 3 },
            { max: 1200, slidesCount: 4 },
            { max: 1400, slidesCount: 6 },
            { max: 1920, slidesCount: 8 }, 
        ],
    } as Partial<XmCarouselConfig>,
};