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
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({standalone: false, name: 'truncateCharacters'})
export class JhiTruncateCharactersPipe implements PipeTransform {
    public transform(input: string, chars: number, breakOnWord?: boolean): string {
        if (isNaN(chars)) {
            return input;
        }
        if (chars <= 0) {
            return '';
        }
        if (input && input.length > chars) {
            input = input.substring(0, chars);

            if (!breakOnWord) {
                const lastspace = input.lastIndexOf(' ');
                // Get last space
                if (lastspace !== -1) {
                    input = input.substr(0, lastspace);
                }
            } else {
                while (input.endsWith(' ')) {
                    input = input.substr(0, input.length - 1);
                }
            }
            return input + '...';
        }
        return input;
    }
}
