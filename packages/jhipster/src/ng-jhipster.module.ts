/*
 Copyright 2016-2021 the original author or authors from the JHipster project.

 This file is part of the JHipster project, see https://www.jhipster.tech/
 for more information.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { JhiModuleConfig } from './config';
import { JhiConfigService } from './config.service';
import { JHI_DIRECTIVES, JHI_PIPES } from './jhi-components';
import { JhiMissingTranslationHandler } from './language/jhi-missing-translation.config';
import { JhiTranslateDirective } from './language/jhi-translate.directive';

export function translatePartialLoader(http: HttpClient): TranslateHttpLoader {
    return new TranslateHttpLoader(http, 'i18n/', `.json?buildTimestamp=${process.env.BUILD_TIMESTAMP}`);
}

export function missingTranslationHandler(configService: JhiConfigService): JhiMissingTranslationHandler {
    return new JhiMissingTranslationHandler(configService);
}

@NgModule({
    imports: [CommonModule, FormsModule],
    declarations: [...JHI_PIPES, ...JHI_DIRECTIVES, JhiTranslateDirective],
    exports: [...JHI_PIPES, ...JHI_DIRECTIVES, JhiTranslateDirective, CommonModule],
})
export class NgJhipsterModule {
    public static forRoot(moduleConfig: JhiModuleConfig): ModuleWithProviders<NgJhipsterModule> {
        return {
            ngModule: NgJhipsterModule,
            providers: [{ provide: JhiModuleConfig, useValue: moduleConfig }],
        };
    }
}
