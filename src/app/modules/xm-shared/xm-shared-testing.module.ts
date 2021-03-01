import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgModule } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { XmTranslationTestingModule } from '@xm-ngx/translation';

import { XmSharedModule } from './xm-shared.module';


@NgModule({
    exports: [
        XmSharedModule,
        HttpClientTestingModule,
        RouterTestingModule,
        XmTranslationTestingModule,
    ],
})
/** @deprecated Use XmTranslationTestingModule */
export class XmSharedTestingModule {
}
