import { CommonModule } from '@angular/common';
import { HttpClientJsonpModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CovalentTextEditorModule } from '@covalent/text-editor';
import { XmDynamicModule } from '@xm-ngx/dynamic';

import { XmSharedModule } from '@xm-ngx/shared';
import { ClockWidgetComponent } from '../clock-widget/clock-widget.component';
import { ExchangeWidgetComponent } from '../exchange-widget/exchange-widget.component';
import { FinanceService } from '../exchange-widget/finance.service';
import { IframeWidgetComponent } from '../iframe-widget/iframe-widget.component';
import { MdWidgetComponent } from '../md-widget/md-widget.component';
import { FeedService } from '../news-widget/feed.service';
import { NewsWidgetComponent } from '../news-widget/news-widget.component';
import { SignInUpWidgetComponent } from '../sign-in-up-widget/sign-in-up-widget.component';
import { TwitterTimelineWidgetComponent } from '../twitter-timeline-widget/twitter-timeline-widget.component';
import { TwitterTimelineService } from '../twitter-timeline-widget/twitter-timeline.service';
import { WeatherWidgetComponent } from '../weather-widget/weather-widget.component';
import { WeatherService } from '../weather-widget/weather.service';
import { WelcomeWidgetComponent } from '../welcome-widget/welcome-widget.component';
import { SignInUpV2WidgetComponent } from '../sign-in-up-v2-widget/sign-in-up-v2-widget.component';
import { LoginV2Component } from '../sign-in-up-v2-widget/login-v2/login-v2.component';
import { LoginTfaComponent } from '../sign-in-up-v2-widget/login-tfa/login-tfa.component';

@NgModule({
    imports: [
        CommonModule,
        XmSharedModule,
        HttpClientJsonpModule,
        XmDynamicModule.forChild([
            { selector: 'xm-widget-clock', loadChildren: () => ClockWidgetComponent },
            { selector: 'xm-widget-exchange-calculator', loadChildren: () => ExchangeWidgetComponent },
            { selector: 'xm-widget-iframe', loadChildren: () => IframeWidgetComponent },
            { selector: 'xm-widget-md', loadChildren: () => MdWidgetComponent },
            { selector: 'xm-widget-news', loadChildren: () => NewsWidgetComponent },
            { selector: 'xm-widget-sign-in-up', loadChildren: () => SignInUpWidgetComponent },
            { selector: 'xm-widget-sign-in-up-v2', loadChildren: () => SignInUpV2WidgetComponent },
            { selector: 'xm-widget-twitter-timeline', loadChildren: () => TwitterTimelineWidgetComponent },
            { selector: 'xm-widget-weather', loadChildren: () => WeatherWidgetComponent },
            { selector: 'xm-widget-welcome', loadChildren: () => WelcomeWidgetComponent },
            { selector: 'xm-login-v2', loadChildren: () => LoginV2Component },
            { selector: 'xm-login-tfa', loadChildren: () => LoginTfaComponent },
        ]),
        CovalentTextEditorModule,
    ],
    declarations: [
        ClockWidgetComponent,
        ExchangeWidgetComponent,
        IframeWidgetComponent,
        MdWidgetComponent,
        NewsWidgetComponent,
        SignInUpWidgetComponent,
        TwitterTimelineWidgetComponent,
        WeatherWidgetComponent,
        WelcomeWidgetComponent,
    ],
    providers: [
        FeedService,
        FinanceService,
        TwitterTimelineService,
        WeatherService,
    ],
})
export class ExtCommonModule {
}
