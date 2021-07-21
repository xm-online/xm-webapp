import { TranslateService } from '@ngx-translate/core';
import { MockTranslateService } from '@xm-ngx/translation/testing';
import { TranslateDirective } from './translate.directive';

describe('TranslateDirective', () => {
    it('should create an instance', () => {
        const directive = new TranslateDirective(new MockTranslateService() as TranslateService, null, null);
        expect(directive).toBeTruthy();
    });
});
