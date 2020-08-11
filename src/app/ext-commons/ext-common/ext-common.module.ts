import { CommonModule } from '@angular/common';
import { HttpClientJsonpModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CovalentTextEditorModule } from '@covalent/text-editor';
import { XmDynamicModule } from '@xm-ngx/dynamic';
import { XmSharedModule } from '../../shared/shared.module';
import {
    ClockWidgetComponent,
    ExchangeWidgetComponent,
    FeedService,
    FinanceService,
    IframeWidgetComponent,
    MdWidgetComponent,
    NewsWidgetComponent,
    SignInUpWidgetComponent,
    TwitterTimelineService,
    TwitterTimelineWidgetComponent,
    WeatherService,
    WeatherWidgetComponent,
    WelcomeWidgetComponent,
} from './';

@NgModule({
    imports: [
        CommonModule,
        XmSharedModule,
        HttpClientJsonpModule,
        XmDynamicModule.forChild([
            {selector: 'xm-widget-clock', loadChildren: () => ClockWidgetComponent},
            {selector: 'xm-widget-exchange-calculator', loadChildren: () => ExchangeWidgetComponent},
            {selector: 'xm-widget-iframe', loadChildren: () => IframeWidgetComponent},
            {selector: 'xm-widget-md', loadChildren: () => MdWidgetComponent},
            {selector: 'xm-widget-news', loadChildren: () => NewsWidgetComponent},
            {selector: 'xm-widget-sign-in-up', loadChildren: () => SignInUpWidgetComponent},
            {selector: 'xm-widget-twitter-timeline', loadChildren: () => TwitterTimelineWidgetComponent},
            {selector: 'xm-widget-weather', loadChildren: () => WeatherWidgetComponent},
            {selector: 'xm-widget-welcome', loadChildren: () => WelcomeWidgetComponent},
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
