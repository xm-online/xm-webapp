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
import { Injectable } from '@angular/core';
import { faSort, faSortDown, faSortUp, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Injectable({
    providedIn: 'root',
})
export class JhiModuleConfig {
    public sortIcon?: IconDefinition = faSort;
    public sortAscIcon?: IconDefinition = faSortUp;
    public sortDescIcon?: IconDefinition = faSortDown;
    public i18nEnabled? = false;
    public defaultI18nLang? = 'en';
    public noi18nMessage? = 'translation-not-found';
    public alertAsToast? = false;
    public alertTimeout? = 5000;
    public classBadgeTrue? = 'badge badge-success';
    public classBadgeFalse? = 'badge badge-danger';
    public classTrue? = 'fa fa-lg fa-check text-success';
    public classFalse? = 'fa fa-lg fa-times text-danger';
}
